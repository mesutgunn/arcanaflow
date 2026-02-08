"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, Loader2, CheckCircle2, AlertCircle, Store, Key, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const supabase = createClient();

    const [formData, setFormData] = useState({
        etsyShopId: "",
        etsyKeystring: "",
        etsySharedSecret: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            const response = await fetch("/api/settings");
            if (response.ok) {
                const data = await response.json();
                if (data.shopSettings) {
                    setFormData({
                        etsyShopId: data.shopSettings.etsyShopId || "",
                        etsyKeystring: "", // Don't show encrypted values
                        etsySharedSecret: "", // Don't show encrypted values
                    });
                }
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        if (!formData.etsyShopId || !formData.etsyKeystring || !formData.etsySharedSecret) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to save settings");
            }

            setSuccess("Settings saved successfully! Redirecting to dashboard...");
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 2000);
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cosmic-glow" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cosmic-glow to-cosmic-accent bg-clip-text text-transparent mb-2">
                        Shop Settings
                    </h1>
                    <p className="text-cosmic-light/60">
                        Connect your Etsy shop to start managing your tarot reading orders
                    </p>
                </motion.div>

                {/* Instructions Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 mb-6"
                >
                    <h2 className="text-lg font-semibold text-cosmic-accent mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        How to find your Etsy API credentials
                    </h2>
                    <ol className="text-sm text-cosmic-light/80 space-y-2 list-decimal list-inside">
                        <li>Go to <a href="https://www.etsy.com/developers/your-apps" target="_blank" rel="noopener noreferrer" className="text-cosmic-accent hover:text-cosmic-glow underline">Etsy Developers</a></li>
                        <li>Create a new app or select an existing one</li>
                        <li>Copy your <strong>Keystring</strong> (API Key) and <strong>Shared Secret</strong></li>
                        <li>Find your Shop ID in your Etsy shop URL (e.g., etsy.com/shop/<strong>YourShopName</strong>)</li>
                    </ol>
                </motion.div>

                {/* Settings Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8"
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            {success}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Etsy Shop ID */}
                        <div>
                            <label htmlFor="etsyShopId" className="block text-sm font-medium text-cosmic-light/80 mb-2">
                                Etsy Shop ID
                            </label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-glow/50" />
                                <input
                                    id="etsyShopId"
                                    type="text"
                                    value={formData.etsyShopId}
                                    onChange={(e) => setFormData({ ...formData, etsyShopId: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-cosmic-void/50 border border-cosmic-glow/20 rounded-lg text-white placeholder-cosmic-light/40 focus:outline-none focus:border-cosmic-glow/50 transition-colors"
                                    placeholder="e.g., ARVION"
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="mt-1 text-xs text-cosmic-light/50">Your shop name or ID from Etsy</p>
                        </div>

                        {/* Etsy Keystring (API Key) */}
                        <div>
                            <label htmlFor="etsyKeystring" className="block text-sm font-medium text-cosmic-light/80 mb-2">
                                Etsy Keystring (API Key)
                            </label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-glow/50" />
                                <input
                                    id="etsyKeystring"
                                    type="text"
                                    value={formData.etsyKeystring}
                                    onChange={(e) => setFormData({ ...formData, etsyKeystring: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-cosmic-void/50 border border-cosmic-glow/20 rounded-lg text-white placeholder-cosmic-light/40 focus:outline-none focus:border-cosmic-glow/50 transition-colors font-mono text-sm"
                                    placeholder="Your Etsy API Keystring"
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="mt-1 text-xs text-cosmic-light/50">Will be stored encrypted</p>
                        </div>

                        {/* Etsy Shared Secret */}
                        <div>
                            <label htmlFor="etsySharedSecret" className="block text-sm font-medium text-cosmic-light/80 mb-2">
                                Etsy Shared Secret
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-glow/50" />
                                <input
                                    id="etsySharedSecret"
                                    type="password"
                                    value={formData.etsySharedSecret}
                                    onChange={(e) => setFormData({ ...formData, etsySharedSecret: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-cosmic-void/50 border border-cosmic-glow/20 rounded-lg text-white placeholder-cosmic-light/40 focus:outline-none focus:border-cosmic-glow/50 transition-colors font-mono text-sm"
                                    placeholder="Your Etsy Shared Secret"
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="mt-1 text-xs text-cosmic-light/50">Will be stored encrypted</p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-cosmic-glow to-cosmic-accent text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-cosmic-glow/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save & Connect Shop
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Security Notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center text-xs text-cosmic-light/40"
                >
                    🔒 Your API credentials are encrypted using AES-256-GCM before storage
                </motion.div>
            </div>
        </div>
    );
}
