"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

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

    // Initialize the map once
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (mapRef.current || !mapContainerRef.current) return;

        (async () => {
            const L = await import("leaflet");

            mapRef.current = L.map(mapContainerRef.current!).setView(center, zoom);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors",
                maxZoom: 19,
            }).addTo(mapRef.current);

            markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
        })();

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [center, zoom]); // <-- runs when center or zoom changes

    // Respond to center/zoom changes safely
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView(center, zoom);
        }
    }, [center, zoom]);

    // Update markers independently
    useEffect(() => {
        (async () => {
            const L = await import("leaflet");
            if (!markersLayerRef.current) return;

            markersLayerRef.current.clearLayers();

            const statusColors: Record<string, string> = {
                active: "#10b981",
                idle: "#f59e0b",
                offline: "#ef4444",
            };

            markers.forEach((markerData) => {
                const color = statusColors[markerData.status || "active"];

                const busIcon = L.divIcon({
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

                const marker = L.marker(markerData.position, { icon: busIcon }).bindPopup(`
          <div style="text-align:center;font-family:Cairo,sans-serif;">
            <strong>${markerData.title}</strong><br/>
            <span style="color:${color};">
              ${markerData.status === "active"
                        ? "Active"
                        : markerData.status === "idle"
                            ? "Idle"
                            : "Offline"
                    }
            </span>
          </div>
        `);

                markersLayerRef.current?.addLayer(marker);
            });
        })();
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
