"use client";

import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { Order, SKU_LABELS, STATUS_COLORS } from "@/types/order";
import { cn } from "@/lib/utils";

interface OrderCardProps {
    order: Order;
    onProcess: (orderId: string) => void;
    index: number;
}

export function OrderCard({ order, onProcess, index }: OrderCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const skuInfo = SKU_LABELS[order.sku];

    const statusColorMap = {
        "status-pending": "from-yellow-500/50 to-amber-500/50",
        "status-processing": "from-blue-500/50 to-sky-500/50",
        "status-ready": "from-green-500/50 to-emerald-500/50",
        "status-sent": "from-indigo-500/50 to-violet-500/50",
    };

    const statusBgMap = {
        PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        READY: "bg-green-500/10 text-green-400 border-green-500/30",
        SENT: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={cn("glass-card p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden animate-float")}
            style={{ animationDelay: `${index * 0.3}s` }}
        >
            {/* Glow effect */}
            <div
                className={cn(
                    "absolute -inset-0.5 bg-gradient-to-r rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300 -z-10",
                    statusColorMap[STATUS_COLORS[order.status]]
                )}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{skuInfo?.icon || "🔮"}</span>
                        <span className="text-sm font-medium text-cosmic-accent">{skuInfo?.label || order.sku}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{order.customer}</h3>
                    <p className="text-xs text-cosmic-light/60 mt-1">Order #{order.id}</p>
                </div>

                {/* Status Badge */}
                <div
                    className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border",
                        statusBgMap[order.status]
                    )}
                >
                    {order.status}
                </div>
            </div>

            {/* Personalization Note */}
            <div className="mb-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm text-cosmic-glow hover:text-cosmic-accent transition-colors w-full text-left"
                >
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                    <span>Personalization Note</span>
                </button>

                <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <p className="mt-3 text-sm text-cosmic-light/80 bg-cosmic-void/30 p-3 rounded-lg border border-cosmic-glow/10">
                        {order.note}
                    </p>
                </motion.div>
            </div>

            {/* Action Button */}
            {order.status === "PENDING" && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onProcess(order.id)}
                    className="w-full bg-gradient-to-r from-cosmic-glow to-cosmic-accent text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-cosmic-glow/50 transition-all flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    Process Order
                </motion.button>
            )}

            {order.status === "PROCESSING" && (
                <div className="w-full bg-blue-500/20 text-blue-400 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="w-4 h-4" />
                    </motion.div>
                    Processing...
                </div>
            )}

            {order.status === "READY" && (
                <div className="w-full bg-green-500/20 text-green-400 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                    ✨ Ready to Send
                </div>
            )}
        </motion.div>
    );
}
