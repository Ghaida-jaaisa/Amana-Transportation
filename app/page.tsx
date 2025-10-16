"use client";

import { useState } from "react";
import Map from "./component/Map";
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Vehicle data
  const vehicles = [
    {
      id: "1",
      name: "Vehicle 101",
      driver: "Ahmed Mohamed",
      status: "active" as const,
      location: "Jalan Tun Razak", // major road in Kuala Lumpur
      speed: 65,
      lastUpdate: "2 minutes ago",
      position: [3.139, 101.6869], // Kuala Lumpur
    },
    {
      id: "2",
      name: "Vehicle 102",
      driver: "Khaled Ali",
      status: "idle" as const,
      location: "Bukit Bintang", // popular district
      speed: 0,
      lastUpdate: "5 minutes ago",
      position: [3.1478, 101.7134],
    },
    {
      id: "3",
      name: "Vehicle 103",
      driver: "Saad Abdullah",
      status: "active" as const,
      location: "Jalan Ampang", // famous road near KLCC
      speed: 45,
      lastUpdate: "1 minute ago",
      position: [3.157, 101.712],
    },
    {
      id: "4",
      name: "Vehicle 104",
      driver: "Mohammed Saeed",
      status: "offline" as const,
      location: "Petaling Jaya", // nearby city
      speed: 0,
      lastUpdate: "1 hour ago",
      position: [3.1073, 101.6067],
    },
  ];


  // Filter vehicles based on search input
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.includes(searchQuery) ||
      vehicle.driver.includes(searchQuery) ||
      vehicle.location.includes(searchQuery)
  );

  // Prepare map markers
  const markers = vehicles.map((v) => ({
    id: v.id,
    position: v.position as [number, number],
    title: v.name,
    status: v.status,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - site name and logo */}
            <div className="flex items-center gap-3 group order-1">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center bg-blue-400">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-400 bg-clip-text text-transparent">
                  Transport Authority
                </h1>
                <p className="text-sm text-slate-400">
                  Intelligent Transport Management System
                </p>
              </div>
            </div>

            {/* Right side - nav */}
            <div className="flex items-center gap-4 order-2">
              <nav className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="gap-2 hover-scale transition-all duration-200 hover:bg-primary/10 hover:text-primary text-slate-700"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports</span>
                </Button>
                <Button
                  variant="ghost"
                  className="gap-2 hover-scale transition-all duration-200 hover:bg-primary/10 hover:text-primary  text-slate-700"
                >
                  <Clock className="w-4 h-4" />
                  <span>Logs</span>
                </Button>
                <Button
                  variant="ghost"
                  className="gap-2 hover-scale transition-all duration-200 hover:bg-primary/10 hover:text-primary  text-slate-700"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
                <div className="h-6 w-px bg-border mx-2" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover-scale transition-all duration-200 hover:bg-primary/10 hover:text-primary  text-slate-700"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 left-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                </Button>
              </nav>

              {/* Mobile icon */}
              <Button variant="outline" size="icon" className="md:hidden hover-scale">
                <Settings className="w-5 h-5  text-slate-700" />
              </Button>
            </div>
          </div>
        </div>
      </header>



      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Vehicles" value={vehicles.length} icon={Car} />
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

        {/* Main Content */}
        <Tabs defaultValue="map" className="justify-center space-y-4">
          <TabsList className="flex justify-center w-full">
            <div className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="list">Vehicle List</TabsTrigger>
            </div>
          </TabsList>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-4">
            <div className="bg-card rounded-lg p-4 shadow-soft border border-border">
              <div className="h-[500px] w-full">
                <Map markers={markers} />
              </div>
            </div>
          </TabsContent>

          {/* List Tab */}
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
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-xl border-t border-border/50 text-center py-4 mt-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Transport Authority. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
