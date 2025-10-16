"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Gauge } from "lucide-react";

interface VehicleCardProps {
    id: string;
    name: string;
    driver: string;
    status: "active" | "idle" | "offline";
    location: string;
    speed?: number;
    lastUpdate: string;
}

const VehicleCard = ({
    name,
    driver,
    status,
    location,
    speed = 0,
    lastUpdate,
}: VehicleCardProps) => {
    const statusConfig = {
        active: {
            label: "Active",
            className: "bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-md",
        },
        idle: {
            label: "Idle",
            className: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md",
        },
        offline: {
            label: "Offline",
            className: "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md",
        },
    };

    return (
        <Card className="p-5 bg-gradient-to-br from-slate-900/90 to-slate-800/80 border border-slate-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl backdrop-blur">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-lg text-sky-200">{name}</h3>
                    <p className="text-sm text-slate-400">{driver}</p>
                </div>
                <Badge className={`${statusConfig[status].className} text-xs px-3 py-1 rounded-full`}>
                    {statusConfig[status].label}
                </Badge>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span>{location}</span>
                </div>

                {status === "active" && (
                    <div className="flex items-center gap-2 text-slate-300">
                        <Gauge className="w-4 h-4 text-emerald-400" />
                        <span>{speed} km/h</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4 text-blue-300" />
                    <span>{lastUpdate}</span>
                </div>
            </div>
        </Card>
    );
};

export default VehicleCard;
