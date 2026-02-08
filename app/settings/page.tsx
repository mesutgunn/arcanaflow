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

    const supabaseCredentials = [
        {
            title: "Supabase URL",
            description: "n8n Supabase connection - Project URL",
            value: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
            icon: "🔗",
        },
        {
            title: "Supabase Service Role Key",
            description: "n8n Supabase connection - Service role key for INSERT operations",
            value: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
            icon: "🔑",
        },
    ];

    const webhookUrls = [
        {
            title: "AI Reading Webhook",
            description: "n8n webhook for triggering AI tarot reading generation",
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

                {/* Supabase Credentials for n8n */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-6"
                >
                    <h2 className="text-xl font-semibold text-cosmic-accent mb-4">
                        Supabase Credentials (for n8n)
                    </h2>
                    <p className="text-sm text-cosmic-light/60 mb-4">
                        Use these credentials in n8n Supabase node to insert orders directly
                    </p>

                    {supabaseCredentials.map((cred, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="glass-card p-6 mb-4"
                        >
                            <h3 className="text-lg font-semibold text-cosmic-accent mb-2 flex items-center gap-2">
                                <span className="text-2xl">{cred.icon}</span>
                                {cred.title}
                            </h3>
                            <p className="text-sm text-cosmic-light/60 mb-3">
                                {cred.description}
                            </p>

                            <div className="bg-cosmic-void/50 rounded-lg p-4 border border-cosmic-glow/20">
                                <div className="flex items-center justify-between gap-4">
                                    <code className="text-xs text-cosmic-light/80 font-mono break-all">
                                        {cred.value}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(cred.value, index + 100)}
                                        className="flex-shrink-0 p-2 hover:bg-cosmic-glow/10 rounded-lg transition-colors"
                                    >
                                        {copiedIndex === index + 100 ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-cosmic-glow" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Webhook URLs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                >
                    <h2 className="text-xl font-semibold text-cosmic-accent mb-4">
                        Webhook URLs (for AI/PDF workflows)
                    </h2>
                </motion.div>
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
                        n8n Setup Instructions
                    </h2>
                    <div className="space-y-4 text-sm text-cosmic-light/80">
                        <div>
                            <h3 className="font-semibold text-cosmic-accent mb-2">For Order Creation (Email Parsing):</h3>
                            <ol className="space-y-2 list-decimal list-inside">
                                <li>Copy <strong>Supabase URL</strong> and <strong>Service Role Key</strong></li>
                                <li>In n8n, add <strong>Supabase</strong> credentials with these values</li>
                                <li>Use <strong>Supabase Insert</strong> node to insert into <code className="px-2 py-1 bg-cosmic-void/50 rounded">Order</code> table</li>
                                <li>Include <strong>userId</strong> field (copy from above) in row data</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="font-semibold text-cosmic-accent mb-2">For AI/PDF Generation:</h3>
                            <ol className="space-y-2 list-decimal list-inside">
                                <li>Use the <strong>AI Reading Webhook URL</strong> above</li>
                                <li>Add <strong>Authorization</strong> header with Bearer token</li>
                                <li>Send POST request with order data in JSON format</li>
                            </ol>
                        </div>
                    </div>
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
