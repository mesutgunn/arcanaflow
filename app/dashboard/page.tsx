"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { OrderCard } from "@/components/order-card";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Loader2, Settings } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/types/order";

export default function DashboardPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasShopSettings, setHasShopSettings] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [error, setError] = useState("");
    const supabase = createClient();

    useEffect(() => {
        checkAuthAndFetch();
    }, []);

    const checkAuthAndFetch = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        setUserEmail(user.email || "");

        // Check if user has shop settings
        const settingsResponse = await fetch("/api/settings");
        if (settingsResponse.ok) {
            const data = await settingsResponse.json();
            if (data.shopSettings) {
                setHasShopSettings(true);
                await fetchOrders();
            } else {
                setHasShopSettings(false);
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders");
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else if (response.status === 401) {
                router.push("/login");
            }
        } catch (err) {
            setError("Failed to fetch orders");
        } finally {
            setIsLoading(false);
        }
    };

    const syncOrders = async () => {
        setIsSyncing(true);
        setError("");

        try {
            // Trigger n8n email check
            const checkResponse = await fetch("/api/orders/check", {
                method: "POST",
            });

            if (!checkResponse.ok) {
                const data = await checkResponse.json();
                if (data.error === "n8n webhook not configured yet") {
                    // Silently ignore if n8n not set up yet
                    console.log("n8n not configured, skipping check");
                } else {
                    throw new Error(data.error || "Failed to check orders");
                }
            }

            // Wait a moment for n8n to process
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Refresh orders from database
            await fetchOrders();
        } catch (err: any) {
            console.error("Check orders error:", err);
            setError(err.message || "Failed to check orders");
        } finally {
            setIsSyncing(false);
        }
    };

    const processOrder = async (orderId: string) => {
        // Update order status locally
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: "PROCESSING" as const } : order
            )
        );

        // Call API to process (will trigger n8n webhook in Phase 5)
        try {
            await fetch(`/api/orders/${orderId}/process`, {
                method: "POST",
            });

            // Simulate processing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Update to READY state
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, status: "READY" as const } : order
                )
            );
        } catch (err) {
            console.error("Failed to process order:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cosmic-glow" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <DashboardHeader onSync={syncOrders} isSyncing={isSyncing} userEmail={userEmail} />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Onboarding Banner */}
                {!hasShopSettings && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 glass-card p-6 border-2 border-cosmic-accent/30"
                    >
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-cosmic-accent flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-cosmic-accent mb-2">
                                    Connect Your Etsy Shop
                                </h3>
                                <p className="text-cosmic-light/80 mb-4">
                                    To start managing your tarot reading orders, you need to connect your Etsy shop
                                    by providing your API credentials.
                                </p>
                                <Link href="/settings">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-cosmic-glow to-cosmic-accent text-white font-medium py-2 px-6 rounded-lg hover:shadow-lg hover:shadow-cosmic-glow/50 transition-all flex items-center gap-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Go to Settings
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Welcome Section */}
                {hasShopSettings && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 text-center"
                        >
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-cosmic-glow via-cosmic-accent to-cosmic-light bg-clip-text text-transparent mb-2">
                                Order Management
                            </h2>
                            <p className="text-cosmic-light/60">
                                Manage your tarot reading orders with the cosmic flow
                            </p>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                        >
                            {[
                                { label: "Pending", count: orders.filter((o) => o.status === "PENDING").length, color: "from-yellow-500 to-amber-500" },
                                { label: "Processing", count: orders.filter((o) => o.status === "PROCESSING").length, color: "from-blue-500 to-sky-500" },
                                { label: "Ready", count: orders.filter((o) => o.status === "READY").length, color: "from-green-500 to-emerald-500" },
                                { label: "Sent", count: orders.filter((o) => o.status === "SENT").length, color: "from-indigo-500 to-violet-500" },
                            ].map((stat, i) => (
                                <div key={stat.label} className="glass-card p-4 text-center">
                                    <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                        {stat.count}
                                    </div>
                                    <div className="text-sm text-cosmic-light/60 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Orders Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order, index) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onProcess={processOrder}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {orders.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="text-6xl mb-4">🌙</div>
                                <h3 className="text-xl text-cosmic-light/60">No orders yet</h3>
                                <p className="text-cosmic-light/40 mt-2">Click "Sync Orders" to fetch from Etsy</p>
                            </motion.div>
                        )}
                    </>
                )}
            </main>

            {/* Floating particles effect */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cosmic-glow/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
