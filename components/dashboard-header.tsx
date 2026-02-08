"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Settings, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface DashboardHeaderProps {
    onSync: () => void;
    isSyncing?: boolean;
    userEmail?: string;
}

export function DashboardHeader({ onSync, isSyncing = false, userEmail }: DashboardHeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="glass-header sticky top-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo & Title */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="text-3xl"
                        >
                            🔮
                        </motion.div>
                        <motion.div
                            className="absolute inset-0 bg-cosmic-glow/30 rounded-full blur-xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cosmic-glow to-cosmic-accent bg-clip-text text-transparent">
                            ArcanaFlow
                        </h1>
                        <p className="text-xs text-cosmic-light/60">ARVION Order Management</p>
                    </div>
                </motion.div>

                {/* User Profile & Actions */}
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSync}
                        disabled={isSyncing}
                        className="glass-card px-6 py-3 flex items-center gap-2 font-medium text-cosmic-accent hover:text-cosmic-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <motion.div
                            animate={isSyncing ? { rotate: 360 } : {}}
                            transition={{ duration: 1, repeat: isSyncing ? Infinity : 0, ease: "linear" }}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </motion.div>
                        {isSyncing ? "Checking..." : "Check Orders"}
                    </motion.button>

                    {/* User Profile Dropdown */}
                    {userEmail && (
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="glass-card px-4 py-3 flex items-center gap-3"
                            >
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-glow to-cosmic-accent flex items-center justify-center text-white font-semibold text-sm">
                                    {userEmail.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-cosmic-light/80 max-w-[150px] truncate hidden md:block">
                                    {userEmail}
                                </span>
                                <motion.div
                                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="w-4 h-4 text-cosmic-glow" />
                                </motion.div>
                            </motion.button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-56 glass-card rounded-lg shadow-2xl overflow-hidden"
                                    >
                                        <div className="p-3 border-b border-cosmic-glow/20">
                                            <p className="text-xs text-cosmic-light/60">Signed in as</p>
                                            <p className="text-sm text-white font-medium truncate">{userEmail}</p>
                                        </div>

                                        <div className="p-2">
                                            <Link
                                                href="/settings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2 text-sm text-cosmic-light/80 hover:bg-cosmic-glow/10 rounded-lg transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
