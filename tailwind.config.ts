import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                cosmic: {
                    void: "#0a0118",
                    purple: "#1a0b2e",
                    deep: "#2d1b4e",
                    glow: "#8b5cf6",
                    accent: "#c084fc",
                    light: "#e9d5ff",
                },
                status: {
                    pending: "#fbbf24",
                    processing: "#60a5fa",
                    ready: "#34d399",
                    sent: "#818cf8",
                },
            },
            backgroundImage: {
                "cosmic-gradient": "linear-gradient(135deg, #0a0118 0%, #1a0b2e 50%, #2d1b4e 100%)",
                "glass-gradient": "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)",
            },
            backdropBlur: {
                xs: "2px",
            },
            animation: {
                "float": "float 6s ease-in-out infinite",
                "float-delayed": "float 6s ease-in-out 2s infinite",
                "glow": "glow 2s ease-in-out infinite",
                "shimmer": "shimmer 2s linear infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                glow: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-1000px 0" },
                    "100%": { backgroundPosition: "1000px 0" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
