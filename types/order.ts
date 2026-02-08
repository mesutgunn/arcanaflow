export type OrderSKU = "arvionlove" | "arvioncareer" | "arvionyesno";
export type OrderStatus = "PENDING" | "PROCESSING" | "READY" | "SENT";

export interface Order {
    id: string;
    etsyOrderId: string;
    sku: OrderSKU;
    customer: string;
    note: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
}

export const SKU_LABELS: Record<OrderSKU, { icon: string; label: string }> = {
    arvionlove: { icon: "💖", label: "Love Reading" },
    arvioncareer: { icon: "💼", label: "Career Path" },
    arvionyesno: { icon: "🔮", label: "Yes/No" },
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING: "status-pending",
    PROCESSING: "status-processing",
    READY: "status-ready",
    SENT: "status-sent",
};
