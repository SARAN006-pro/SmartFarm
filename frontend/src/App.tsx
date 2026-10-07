import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/queryClient"
import AppLayout from "./components/AppLayout"

const Landing = lazy(() => import("./pages/Landing"))
const Demo = lazy(() => import("./pages/Demo"))
const SignIn = lazy(() => import("./pages/SignIn"))
const SignUp = lazy(() => import("./pages/SignUp"))
const AuthCallback = lazy(() => import("./pages/AuthCallback"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Analytics = lazy(() => import("./pages/Analytics"))
const FarmCalendar = lazy(() => import("./pages/FarmCalendar"))
const Chat = lazy(() => import("./pages/Chat"))
const Economics = lazy(() => import("./pages/Economics"))
const Market = lazy(() => import("./pages/Market"))
const Recommendations = lazy(() => import("./pages/Recommendations"))
const PlotDetails = lazy(() => import("./pages/PlotDetails"))
const PlanningIndex = lazy(() => import("./pages/planning/PlanningIndex"))
const Files = lazy(() => import("./pages/Files"))
const Records = lazy(() => import("./pages/Records"))
const Sensors = lazy(() => import("./pages/Sensors"))
const Settings = lazy(() => import("./pages/Settings"))
const Weather = lazy(() => import("./pages/Weather"))
const FarmPage = lazy(() => import("./components/farm3d/FarmPage"))
const FloatingChatBot = lazy(() => import("./components/FloatingChatBot"))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const token = localStorage.getItem("token") || localStorage.getItem("vaagai_token")
  const user = localStorage.getItem("user") || localStorage.getItem("vaagai_user_id")

  if (!token || !user) {
    const urlToken = new URLSearchParams(location.search).get("token")
    const urlUser = new URLSearchParams(location.search).get("user")
    if (urlToken && urlUser) {
      return <>{children}</>
    }
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}

function ProtectedLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <AppLayout title={title} subtitle={subtitle}>
      {children}
    </AppLayout>
  )
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="spinner spinner-lg" />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<Navigate to="/signin" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<Navigate to="/signup" replace />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/google/callback" element={<AuthCallback />} />

            {/* 3D Farm - Primary interactive workspace for farmers */}
            <Route
              path="/farm"
              element={
                <ProtectedRoute>
                  <FarmPage />
                </ProtectedRoute>
              }
            />
            <Route path="/farms" element={<Navigate to="/farm" replace />} />

            {/* Dashboard with 3D farm overview and quick actions */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Farm Dashboard" subtitle="Overview of your 3D farm operations, crops, and live insights">
                    <Dashboard />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Crop Recommendations */}
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Crop Recommendations" subtitle="Season-aware crop guidance and weather outlook">
                    <Recommendations />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/recommend" element={<Navigate to="/recommendations" replace />} />

            {/* 3D Plot Details */}
            <Route
              path="/plot-details"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Plot Details" subtitle="Detailed view and management of your 3D farm plots">
                    <PlotDetails />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Crop Planning & Tasks */}
            <Route
              path="/planning"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Crop Planning" subtitle="Plan and track farming activities, schedules, and kanban tasks">
                    <PlanningIndex />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Market Prices */}
            <Route
              path="/market"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Market Prices" subtitle="Live crop price trends across regional mandis">
                    <Market />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Weather */}
            <Route
              path="/weather"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Weather Forecast" subtitle="Real-time forecasts, precipitation, and agricultural radar">
                    <Weather />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Crop Calendar */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Crop Calendar" subtitle="Daily stage guidance and operations timeline">
                    <FarmCalendar />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Analytics */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Analytics" subtitle="Explore yield trends and farm performance">
                    <Analytics />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Files & Uploads */}
            <Route
              path="/files"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Files & Documents" subtitle="Manage soil tests, crop reports, and farming guides">
                    <Files />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* AI Assistant Chat */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="AI Agronomist" subtitle="Ask questions and get intelligent crop advice">
                    <Chat />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Financial Economics */}
            <Route
              path="/economics"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Economics" subtitle="Financial planning, expenses, and profit forecast">
                    <Economics />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Harvest Records */}
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Yield Records" subtitle="Track historical yields and harvest batches">
                    <Records />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Sensors */}
            <Route
              path="/sensors"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="IoT Sensors" subtitle="Monitor soil moisture, temperature, and farm hardware">
                    <Sensors />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ProtectedLayout title="Settings" subtitle="Configure your SmartFarm profile and preferences">
                    <Settings />
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback to 3D Farm */}
            <Route path="*" element={<Navigate to="/farm" replace />} />
          </Routes>
          {typeof window !== 'undefined' && (localStorage.getItem('token') || localStorage.getItem('vaagai_token')) ? (
            <Suspense fallback={null}><FloatingChatBot /></Suspense>
          ) : null}
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
