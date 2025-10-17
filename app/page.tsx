"use client";

import { useEffect, useMemo, useState } from "react";
import Map from "./component/Map"; // ← تأكد من تطابق اسم المجلد (component vs components)
import VehicleCard from "./component/VehicleCard";
import StatsCard from "./component/StatsCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  TrendingUp,
  Clock,
  AlertCircle,
  Search,
  Settings,
  BarChart3,
  Bell,
} from "lucide-react";

type VehicleStatus = "active" | "idle" | "offline";

type Vehicle = {
  id: string;
  name: string;
  driver: string;
  status: VehicleStatus;
  location: string;
  speed: number;
  lastUpdate: string;
  position: [number, number];
};

// ====== أنواع الـ API بدل any ======
type ApiDriver = { name?: string | null };
type ApiLocation = {
  latitude?: number | string | null;
  longitude?: number | string | null;
  address?: string | null;
};
type ApiRouteInfo = { average_speed?: number | string | null };

type ApiBusLine = {
  id?: string | number;
  route_number?: string | number;
  name?: string | null;
  driver?: ApiDriver | null;
  status?: string | null;
  current_location?: ApiLocation | null;
  route_info?: ApiRouteInfo | null;
};

type ApiJson = {
  bus_lines?: unknown; // سنفحص النوع لاحقًا
};

// ====== Utilities آمنة للأنواع ======
function toNum(x: unknown): number {
  const n = typeof x === "string" || typeof x === "number" ? Number(x) : NaN;
  return Number.isFinite(n) ? n : NaN;
}

function mapStatus(s: string | null | undefined): VehicleStatus {
  const x = (s || "").toLowerCase();
  if (x.includes("active")) return "active";
  if (x.includes("maintenance") || x.includes("out of service"))
    return "offline";
  return "idle";
}

// Transform API → Vehicle[]
function toVehicles(apiJson: unknown): Vehicle[] {
  const root = (apiJson ?? {}) as ApiJson;

  // تأكيد أن bus_lines مصفوفة من الكائنات
  const lines = Array.isArray(root.bus_lines)
    ? (root.bus_lines as unknown[])
    : [];
  return lines
    .map((raw, idx): Vehicle | null => {
      const line = raw as ApiBusLine;

      const lat = toNum(line?.current_location?.latitude);
      const lng = toNum(line?.current_location?.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

      const idSource = line.id ?? line.route_number ?? line.name ?? idx;
      const speed = toNum(line?.route_info?.average_speed);

      return {
        id: String(idSource),
        name: (line.name ?? `Route ${line.route_number ?? ""}`)
          .toString()
          .trim(),
        driver: line?.driver?.name ?? "Unknown",
        status: mapStatus(line?.status),
        location: line?.current_location?.address ?? "Unknown",
        speed: Number.isFinite(speed) ? speed : 0,
        lastUpdate: "Just now",
        position: [lat, lng],
      };
    })
    .filter((v): v is Vehicle => v !== null);
}

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_VEHICLES_API || "/api/vehicles";

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch vehicles: ${res.status}`);
        const json = (await res.json()) as unknown;
        const parsed = toVehicles(json);
        if (mounted) setVehicles(parsed);
      } catch (e) {
        if (mounted)
          setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [apiUrl]);

  const filteredVehicles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return vehicles;
    return vehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.driver.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
    );
  }, [vehicles, searchQuery]);

  const markers = useMemo(
    () =>
      vehicles.map((v) => ({
        id: v.id,
        position: v.position,
        title: v.name,
        status: v.status,
      })),
    [vehicles]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group order-1">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center bg-blue-400">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-400 bg-clip-text text-transparent">
                  Transport Authority
                </h1>
                <p className="text-sm text-slate-400">
                  Intelligent Transport Management System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 order-2">
              <nav className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="gap-2 hover:bg-primary/10 hover:text-primary text-slate-700"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports</span>
                </Button>
                <Button
                  variant="ghost"
                  className="gap-2 hover:bg-primary/10 hover:text-primary text-slate-700"
                >
                  <Clock className="w-4 h-4" />
                  <span>Logs</span>
                </Button>
                <Button
                  variant="ghost"
                  className="gap-2 hover:bg-primary/10 hover:text-primary text-slate-700"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
                <div className="h-6 w-px bg-border mx-2" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-primary/10 hover:text-primary text-slate-700"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 left-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                </Button>
              </nav>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden hover-scale"
              >
                <Settings className="w-5 h-5  text-slate-700" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Vehicles"
            value={vehicles.length}
            icon={Car}
          />
          <StatsCard
            title="Active Vehicles"
            value={vehicles.filter((v) => v.status === "active").length}
            icon={TrendingUp}
          />
          <StatsCard
            title="Idle Vehicles"
            value={vehicles.filter((v) => v.status === "idle").length}
            icon={Clock}
          />
          <StatsCard
            title="Offline"
            value={vehicles.filter((v) => v.status === "offline").length}
            icon={AlertCircle}
          />
        </div>

        {/* Main */}
        <Tabs defaultValue="map" className="justify-center space-y-4">
          <TabsList className="flex justify-center w-full">
            <div className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="list">Vehicle List</TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <div className="bg-card rounded-lg p-4 shadow-soft border border-border">
              <div className="h-[500px] w-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    Loading map…
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full text-destructive">
                    {error}
                  </div>
                ) : (
                  <Map markers={markers} />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center gap-2 bg-card p-4 rounded-lg shadow-soft border border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for a vehicle or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0"
              />
            </div>

            {loading && (
              <div className="text-center py-6 text-muted-foreground">
                Loading vehicles…
              </div>
            )}
            {error && !loading && (
              <div className="text-center py-6 text-destructive">
                Error loading vehicles: {error}
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} {...vehicle} />
                  ))}
                </div>

                {filteredVehicles.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No search results found</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-card/80 backdrop-blur-xl border-t border-border/50 text-center py-4 mt-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Transport Authority. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
