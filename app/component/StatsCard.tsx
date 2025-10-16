"use client";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant?: "default" | "primary" | "secondary";
}

const StatsCard = ({
    title,
    value,
    icon: Icon,
    trend,
    variant = "default",
}: StatsCardProps) => {
    const variantStyles = {
        default: "bg-card border border-border/50 text-foreground",
        primary:
            "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border-0",
        secondary:
            "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 border-0",
    };

    return (
        <Card
            className={`p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${variantStyles[variant]}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p
                        className={`text-sm font-medium mb-2 ${variant !== "default" ? "text-white/80" : "text-muted-foreground"
                            }`}
                    >
                        {title}
                    </p>
                    <p
                        className={`text-3xl font-bold ${variant !== "default" ? "text-white" : "text-foreground"
                            }`}
                    >
                        {value}
                    </p>
                    {trend && (
                        <p
                            className={`text-sm mt-2 ${variant !== "default"
                                    ? "text-white/80"
                                    : trend.isPositive
                                        ? "text-emerald-500"
                                        : "text-rose-500"
                                }`}
                        >
                            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                <div
                    className={`p-3 rounded-lg ${variant !== "default" ? "bg-white/20" : "bg-primary/10"
                        }`}
                >
                    <Icon
                        className={`w-6 h-6 ${variant !== "default" ? "text-white" : "text-primary"
                            }`}
                    />
                </div>
            </div>
        </Card>
    );
};

export default StatsCard;
