import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Sprout,
  Tractor,
  Layers3,
  Calendar,
  CloudSun,
  TrendingUp,
  MessageSquare,
  FileText,
  BarChart3,
  Settings as SettingsIcon,
  Plus,
  ArrowRight,
  Droplets,
  Thermometer,
  Wind,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { useFarmStore, CROP_TYPES, type CropPlot } from "@/components/farm3d/farmStore"
import { useAuthStore } from "@/stores/authStore"

interface UserData {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  role?: string
}

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3002").replace(/\/+$/, "")

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user: authUser } = useAuthStore()
  const [user, setUser] = useState<UserData | null>(authUser)

  const { farmName, crops, weather, totalArea, selectCrop } = useFarmStore()

  useEffect(() => {
    // Check for token in URL (from Google OAuth redirect)
    const urlToken = searchParams.get("token")
    const urlUser = searchParams.get("user")

    if (urlUser) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(urlUser))
        localStorage.setItem("token", urlToken || localStorage.getItem("token") || "")
        localStorage.setItem("vaagai_token", urlToken || localStorage.getItem("vaagai_token") || "")
        localStorage.setItem("user", JSON.stringify(parsedUser))
        if (parsedUser.id) localStorage.setItem("vaagai_user_id", parsedUser.id)
        setUser(parsedUser)
        navigate("/farm", { replace: true })
        return
      } catch {
        navigate("/signin")
        return
      }
    }

    if (urlToken) {
      localStorage.setItem("token", urlToken)
      localStorage.setItem("vaagai_token", urlToken)
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${urlToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user))
            if (data.user.id) localStorage.setItem("vaagai_user_id", data.user.id)
            setUser(data.user)
            navigate("/farm", { replace: true })
          }
        })
        .catch(() => {
          navigate("/signin")
        })
      return
    }

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        // fallback to authUser
      }
    }
  }, [navigate, searchParams])

  const handleLaunch3DPlot = (plotId: string) => {
    selectCrop(plotId)
    navigate("/farm")
  }

  const quickActions = [
    {
      title: "3D Farm Simulator",
      description: "Interactive 3D field viewer with terrain, tractor, crops & lighting controls",
      icon: Tractor,
      path: "/farm",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      featured: true,
    },
    {
      title: "Crop Recommendations",
      description: "AI guidance tailored to your local weather, soil, and season",
      icon: Sprout,
      path: "/recommendations",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "3D Plot Details",
      description: "Inspect, resize, and configure crop stages across all 3D plots",
      icon: Layers3,
      path: "/plot-details",
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
    },
    {
      title: "Crop Planning & Kanban",
      description: "Track field tasks, schedules, irrigation cycles, and harvest goals",
      icon: Calendar,
      path: "/planning",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Live Market Prices",
      description: "Real-time crop market prices from regional agricultural mandis",
      icon: TrendingUp,
      path: "/market",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Weather & Radar",
      description: "Real-time forecast, precipitation alerts, and agricultural outlook",
      icon: CloudSun,
      path: "/weather",
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
    },
    {
      title: "AI Agronomist Chat",
      description: "Ask smart questions regarding crop diseases, fertilizers, and yield",
      icon: MessageSquare,
      path: "/chat",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "Farm Analytics",
      description: "Yield trends, soil health indices, and efficiency reports",
      icon: BarChart3,
      path: "/analytics",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Files & Soil Tests",
      description: "Upload and store soil test documents, receipts, and field guides",
      icon: FileText,
      path: "/files",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
  ]

  const userName = user?.firstName || "Farmer"

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── 3D Farm Hero Banner ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 via-[#0e1d13] to-green-950/60 p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Glow backdrop decoration */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-16 w-60 h-60 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Interactive 3D Farm Environment</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome to {farmName || "SmartFarm AI"}, {userName}!
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/75 leading-relaxed">
              Your 3D digital twin farm is active with <strong className="text-white">{crops.length} live plots</strong> across <strong className="text-white">{totalArea || 10} hectares</strong>. Explore your field in real-time 3D, simulate weather changes, and optimize irrigation and planting.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs text-emerald-200">
                <Tractor size={15} className="text-emerald-400" />
                <span>{crops.length} 3D Plots Planted</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs text-emerald-200">
                <Thermometer size={15} className="text-amber-400" />
                <span>{weather?.temperature ? `${weather.temperature.toFixed(1)}°C` : "26.5°C"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs text-emerald-200">
                <Droplets size={15} className="text-sky-400" />
                <span>{weather?.humidity ? `${weather.humidity}% Humidity` : "64% Moisture"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs text-emerald-200">
                <CheckCircle2 size={15} className="text-teal-400" />
                <span>Smart Irrigation Active</span>
              </div>
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto flex-shrink-0">
            <Button
              size="lg"
              onClick={() => navigate("/farm")}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-lg shadow-emerald-500/25 px-6 py-6 text-base rounded-2xl gap-2 transition-all hover:scale-[1.02]"
            >
              <Tractor size={20} />
              <span>Launch 3D Farm Simulator</span>
              <ArrowRight size={18} />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/plot-details")}
              className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/10 hover:text-white rounded-2xl gap-2"
            >
              <Plus size={18} />
              <span>Add / Edit 3D Plots</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Active 3D Plots Section ────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers3 className="text-emerald-400" size={20} />
              <span>Plots in Your 3D Farm</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live plots rendered inside the 3D scene. Click any plot to focus on it in 3D.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/plot-details")}
            className="text-xs text-emerald-400 hover:text-emerald-300 gap-1"
          >
            <span>View All Details</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {crops.map((crop: CropPlot) => {
            const cropMeta = CROP_TYPES[crop.cropType] || { icon: "🌱", name: crop.cropType, color: "#90EE90" }
            return (
              <div
                key={crop.id}
                onClick={() => handleLaunch3DPlot(crop.id)}
                className="group p-4 rounded-2xl border border-white/10 bg-card/60 hover:bg-card hover:border-emerald-500/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl" role="img" aria-label={cropMeta.name}>
                    {cropMeta.icon}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {crop.stage}
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  {crop.name}
                </h3>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {cropMeta.name} · {crop.width}×{crop.depth}m
                </p>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Health:</span>
                  <span className="font-semibold text-emerald-400">{crop.health}%</span>
                </div>

                <div className="mt-2 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${crop.health}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Quick Actions Grid ─────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sprout className="text-emerald-400" size={20} />
            <span>Farm Operations & Quick Actions</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Access any SmartFarm module directly from your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <div
                key={action.path}
                onClick={() => navigate(action.path)}
                className={`p-5 rounded-2xl border ${action.borderColor} bg-card/60 hover:bg-card transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg group hover:scale-[1.01] flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl ${action.bgColor} flex items-center justify-center ${action.color}`}>
                      <Icon size={22} />
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-white transition-all"
                    />
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {action.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-medium text-emerald-400">
                  <span>Open Module</span>
                  <span className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}