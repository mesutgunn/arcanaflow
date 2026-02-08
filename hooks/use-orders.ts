"use client";

import { useState } from "react";
import { Order } from "@/types/order";
import { mockOrders } from "@/lib/mock-orders";

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [isSyncing, setIsSyncing] = useState(false);

    const syncOrders = async () => {
        setIsSyncing(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSyncing(false);
    };

    const processOrder = async (orderId: string) => {
        // Update order status to PROCESSING
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: "PROCESSING" as const } : order
            )
        );

        // Simulate n8n webhook call (will be real in Phase 2)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // For demo purposes, update to READY after processing
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: "READY" as const } : order
            )
        );
    };

    return {
        orders,
        isSyncing,
        syncOrders,
        processOrder,
    };
}
