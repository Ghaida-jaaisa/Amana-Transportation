"use client";

import { useEffect, useRef } from "react";
import type * as L from "leaflet"; // types only
import "leaflet/dist/leaflet.css";

type LeafletEl = HTMLElement & { _leaflet_id?: number };

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    position: [number, number];
    title: string;
    status?: "active" | "idle" | "offline";
  }>;
}

const Map = ({
  center = [3.139, 101.6869], // Kuala Lumpur
  zoom = 6,
  markers = [],
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // يمنع إعادة التهيئة أثناء StrictMode / السباق مع async
  const initLockRef = useRef<Promise<void> | null>(null);

  // Initialize the map ONCE
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;          // خريطة مهيّأة
    if (initLockRef.current) return;     // تهيئة قيد التنفيذ

    // تنظيف أي ختم سابق من Leaflet على نفس العنصر (بسبب hot reload/strict mode)
    try {
      const el = mapContainerRef.current as LeafletEl | null;
      if (el && el._leaflet_id != null) {
        el.innerHTML = "";
        delete el._leaflet_id;
      }
    } catch {
      /* ignore */
    }

    let cancelled = false;

    initLockRef.current = (async () => {
      const Leaflet = (await import("leaflet")).default;

      if (cancelled || !mapContainerRef.current) return;

      // فحص أخير قبل الإنشاء لتجنّب الخطأ
      const el = mapContainerRef.current as LeafletEl;
      if (el._leaflet_id != null) {
        try {
          el.innerHTML = "";
          delete el._leaflet_id;
        } catch {}
      }

      const map = Leaflet.map(el).setView(center, zoom);
      mapRef.current = map;

      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = Leaflet.layerGroup().addTo(map);
    })();

    return () => {
      cancelled = true;

      try {
        markersLayerRef.current?.clearLayers();
      } catch {}

      try {
        mapRef.current?.remove();
      } catch {}

      mapRef.current = null;
      markersLayerRef.current = null;

      // إزالة ختم Leaflet نهائيًا
      try {
        const el = mapContainerRef.current as LeafletEl | null;
        if (el) {
          delete el._leaflet_id;
          el.innerHTML = "";
        }
      } catch {}

      initLockRef.current = null; // اسمح بمحاولة تهيئة جديدة بعد التفكيك
    };
    // عمداً []: لا تجعلها تتبع center/zoom لتجنّب إعادة الإنشاء
  }, []);

  // Update view when center/zoom change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers independently
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const Leaflet = (await import("leaflet")).default;
      if (!markersLayerRef.current || !mapRef.current || cancelled) return;

      markersLayerRef.current.clearLayers();

      const statusColors: Record<string, string> = {
        active: "#10b981",
        idle: "#f59e0b",
        offline: "#ef4444",
      };

      markers.forEach((m) => {
        const color = statusColors[m.status || "active"];
        const busIcon = Leaflet.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              background-color: ${color};
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
            ">🚍</div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = Leaflet.marker(m.position, { icon: busIcon }).bindPopup(
          `
          <div style="text-align:center;font-family:Cairo,sans-serif;">
            <strong>${m.title}</strong><br/>
            <span style="color:${color};">
              ${
                m.status === "active"
                  ? "Active"
                  : m.status === "idle"
                  ? "Idle"
                  : "Offline"
              }
            </span>
          </div>
        `
        );

        markersLayerRef.current?.addLayer(marker);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [markers]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[400px] rounded-lg"
      style={{ zIndex: 1 }}
    />
  );
};

export default Map;
