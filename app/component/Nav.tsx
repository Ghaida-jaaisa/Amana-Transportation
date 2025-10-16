import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <Truck className="h-8 w-8 text-sky-500" />
                        <span className="text-2xl font-bold text-slate-900">
                            Amana Transportation
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#services"
                            className="text-slate-500 hover:text-sky-500 transition-colors"
                        >
                            Services
                        </a>
                        <a
                            href="#schedule"
                            className="text-slate-500 hover:text-sky-500 transition-colors"
                        >
                            Schedule
                        </a>
                        <a
                            href="#about"
                            className="text-slate-500 hover:text-sky-500 transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#contact"
                            className="text-slate-500 hover:text-sky-500 transition-colors"
                        >
                            Contact
                        </a>
                    </div>

                    {/* Button */}
                    <Button className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold px-6 py-2 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:scale-105 transition-transform">
                        Book Now
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
