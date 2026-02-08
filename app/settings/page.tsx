"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Webhook, Copy, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    const router = useRouter();
    const [isFetching, setIsFetching] = useState(true);
    const [userId, setUserId] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const supabase = createClient();

    const webhookUrls = [
        {
            title: "Email Parser Webhook",
            description: "n8n webhook for parsing Etsy order emails",
            url: `https://arcanaflow.vercel.app/api/webhooks/orders`,
            icon: "📧",
        },
        {
            title: "AI Reading Webhook",
            description: "n8n webhook for AI tarot reading generation",
            url: `https://arcanaflow.vercel.app/api/webhooks/reading`,
            icon: "🔮",
        },
    ];

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUserId(user.id);
        } catch (err) {
            console.error("Error fetching user:", err);
        } finally {
            setIsFetching(false);
        }
    };

    const copyToClipboard = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
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
            <div className="max-w-4xl mx-auto">
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
                        Configure your n8n workflows with these webhook URLs
                    </p>
                </motion.div>

                {/* User ID Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 mb-6"
                >
                    <h2 className="text-lg font-semibold text-cosmic-accent mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Your User ID
                    </h2>
                    <div className="bg-cosmic-void/50 rounded-lg p-4 border border-cosmic-glow/20">
                        <div className="flex items-center justify-between gap-4">
                            <code className="text-sm text-cosmic-light/80 font-mono break-all">
                                {userId}
                            </code>
                            <button
                                onClick={() => copyToClipboard(userId, -1)}
                                className="flex-shrink-0 p-2 hover:bg-cosmic-glow/10 rounded-lg transition-colors"
                            >
                                {copiedIndex === -1 ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Copy className="w-5 h-5 text-cosmic-glow" />
                                )}
                            </button>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-cosmic-light/50">
                        Use this User ID in your n8n workflows to identify your orders
                    </p>
                </motion.div>

                {/* Webhook URLs */}
                {webhookUrls.map((webhook, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="glass-card p-6 mb-6"
                    >
                        <h2 className="text-lg font-semibold text-cosmic-accent mb-3 flex items-center gap-2">
                            <span className="text-2xl">{webhook.icon}</span>
                            {webhook.title}
                        </h2>
                        <p className="text-sm text-cosmic-light/60 mb-4">
                            {webhook.description}
                        </p>

                        <div className="bg-cosmic-void/50 rounded-lg p-4 border border-cosmic-glow/20">
                            <div className="flex items-center justify-between gap-4">
                                <code className="text-sm text-cosmic-light/80 font-mono break-all">
                                    {webhook.url}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(webhook.url, index)}
                                    className="flex-shrink-0 p-2 hover:bg-cosmic-glow/10 rounded-lg transition-colors"
                                >
                                    {copiedIndex === index ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-cosmic-glow" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Instructions Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-lg font-semibold text-cosmic-accent mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Setup Instructions
                    </h2>
                    <ol className="text-sm text-cosmic-light/80 space-y-3 list-decimal list-inside">
                        <li>
                            Copy your <strong>User ID</strong> - you'll need it in n8n workflows
                        </li>
                        <li>
                            In your n8n workflow, use the <strong>Email Parser Webhook URL</strong> for the HTTP Request node
                        </li>
                        <li>
                            Add <strong>Authorization</strong> header:
                            <code className="ml-2 px-2 py-1 bg-cosmic-void/50 rounded text-xs">
                                Bearer bf7fa5d75f174d3f8a250a2abf7028da0ffd69df0e04ab31d0237e2ece334f0a
                            </code>
                        </li>
                        <li>
                            Send order data in JSON format with your <strong>userId</strong> field
                        </li>
                        <li>
                            Test the connection from n8n to verify it works
                        </li>
                    </ol>
                </motion.div>

                {/* Security Notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center text-xs text-cosmic-light/40"
                >
                    🔒 All webhook requests are authenticated with Bearer tokens
                </motion.div>
            </div>
        </div>
    );
}
