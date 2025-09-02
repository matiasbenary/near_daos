const {heroui} = require("@heroui/theme")

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(
    {
  "themes": {
    "light": {
      "colors": {
        "default": {
          "50": "#f8fafc",
          "100": "#f1f5f9",
          "200": "#e2e8f0",
          "300": "#cbd5e1",
          "400": "#94a3b8",
          "500": "#64748b",
          "600": "#475569",
          "700": "#334155",
          "800": "#1e293b",
          "900": "#0f172a",
          "foreground": "#000",
          "DEFAULT": "#64748b"
        },
        "primary": {
          "50": "#eff6ff",
          "100": "#dbeafe",
          "200": "#bfdbfe",
          "300": "#93c5fd",
          "400": "#60a5fa",
          "500": "#3b82f6",
          "600": "#2563eb",
          "700": "#1d4ed8",
          "800": "#1e40af",
          "900": "#1e3a8a",
          "foreground": "#fff",
          "DEFAULT": "#2563eb"
        },
        "secondary": {
          "50": "#f0fdfa",
          "100": "#ccfbf1",
          "200": "#99f6e4",
          "300": "#5eead4",
          "400": "#2dd4bf",
          "500": "#14b8a6",
          "600": "#0d9488",
          "700": "#0f766e",
          "800": "#115e59",
          "900": "#134e4a",
          "foreground": "#fff",
          "DEFAULT": "#14b8a6"
        },
        "success": {
          "50": "#f0fdf4",
          "100": "#dcfce7",
          "200": "#bbf7d0",
          "300": "#86efac",
          "400": "#4ade80",
          "500": "#22c55e",
          "600": "#16a34a",
          "700": "#15803d",
          "800": "#166534",
          "900": "#14532d",
          "foreground": "#fff",
          "DEFAULT": "#22c55e"
        },
        "warning": {
          "50": "#fffbeb",
          "100": "#fef3c7",
          "200": "#fde68a",
          "300": "#fcd34d",
          "400": "#fbbf24",
          "500": "#f59e0b",
          "600": "#d97706",
          "700": "#b45309",
          "800": "#92400e",
          "900": "#78350f",
          "foreground": "#000",
          "DEFAULT": "#f59e0b"
        },
        "danger": {
          "50": "#fef2f2",
          "100": "#fee2e2",
          "200": "#fecaca",
          "300": "#fca5a5",
          "400": "#f87171",
          "500": "#ef4444",
          "600": "#dc2626",
          "700": "#b91c1c",
          "800": "#991b1b",
          "900": "#7f1d1d",
          "foreground": "#fff",
          "DEFAULT": "#ef4444"
        },
        "background": "#ffffff",
        "foreground": "#0f172a",
        "content1": {
          "DEFAULT": "#ffffff",
          "foreground": "#0f172a"
        },
        "content2": {
          "DEFAULT": "#f8fafc",
          "foreground": "#0f172a"
        },
        "content3": {
          "DEFAULT": "#f1f5f9",
          "foreground": "#0f172a"
        },
        "content4": {
          "DEFAULT": "#e2e8f0",
          "foreground": "#0f172a"
        },
        "focus": "#2563eb",
        "overlay": "#000000"
      }
    },
    "dark": {
      "colors": {
        "default": {
          "50": "#0f172a",
          "100": "#1e293b",
          "200": "#334155",
          "300": "#475569",
          "400": "#64748b",
          "500": "#94a3b8",
          "600": "#cbd5e1",
          "700": "#e2e8f0",
          "800": "#f1f5f9",
          "900": "#f8fafc",
          "foreground": "#fff",
          "DEFAULT": "#334155"
        },
        "primary": {
          "50": "#1e3a8a",
          "100": "#1e40af",
          "200": "#1d4ed8",
          "300": "#2563eb",
          "400": "#3b82f6",
          "500": "#60a5fa",
          "600": "#93c5fd",
          "700": "#bfdbfe",
          "800": "#dbeafe",
          "900": "#eff6ff",
          "foreground": "#fff",
          "DEFAULT": "#3b82f6"
        },
        "secondary": {
          "50": "#134e4a",
          "100": "#115e59",
          "200": "#0f766e",
          "300": "#0d9488",
          "400": "#14b8a6",
          "500": "#2dd4bf",
          "600": "#5eead4",
          "700": "#99f6e4",
          "800": "#ccfbf1",
          "900": "#f0fdfa",
          "foreground": "#000",
          "DEFAULT": "#14b8a6"
        },
        "success": {
          "50": "#14532d",
          "100": "#166534",
          "200": "#15803d",
          "300": "#16a34a",
          "400": "#22c55e",
          "500": "#4ade80",
          "600": "#86efac",
          "700": "#bbf7d0",
          "800": "#dcfce7",
          "900": "#f0fdf4",
          "foreground": "#000",
          "DEFAULT": "#22c55e"
        },
        "warning": {
          "50": "#78350f",
          "100": "#92400e",
          "200": "#b45309",
          "300": "#d97706",
          "400": "#f59e0b",
          "500": "#fbbf24",
          "600": "#fcd34d",
          "700": "#fde68a",
          "800": "#fef3c7",
          "900": "#fffbeb",
          "foreground": "#000",
          "DEFAULT": "#f59e0b"
        },
        "danger": {
          "50": "#7f1d1d",
          "100": "#991b1b",
          "200": "#b91c1c",
          "300": "#dc2626",
          "400": "#ef4444",
          "500": "#f87171",
          "600": "#fca5a5",
          "700": "#fecaca",
          "800": "#fee2e2",
          "900": "#fef2f2",
          "foreground": "#fff",
          "DEFAULT": "#ef4444"
        },
        "background": "#0f172a",
        "foreground": "#f8fafc",
        "content1": {
          "DEFAULT": "#1e293b",
          "foreground": "#f8fafc"
        },
        "content2": {
          "DEFAULT": "#334155",
          "foreground": "#f8fafc"
        },
        "content3": {
          "DEFAULT": "#475569",
          "foreground": "#f8fafc"
        },
        "content4": {
          "DEFAULT": "#64748b",
          "foreground": "#f8fafc"
        },
        "focus": "#3b82f6",
        "overlay": "#000000"
      }
    }
  },
  "layout": {
    "disabledOpacity": "0.5"
  }
}
  )],
}

module.exports = config;