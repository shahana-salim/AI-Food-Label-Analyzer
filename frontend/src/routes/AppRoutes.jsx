import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import History from "../pages/History";
import ProtectedRoute from "./ProtectedRoute";
import AnalysisDetails from "../pages/AnalysisDetails";
import Profile from "../pages/Profile";
import PersonalInformation from "../pages/PersonalInformation";
import HealthPreferences from "../pages/HealthPreferences";
import Security from "../pages/Security";

import AdminLayout from "../components/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminAnalyses from "../pages/AdminAnalyses";

import DirectGemini from "../pages/DirectGemini";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Dashboard */}
        <Route path="/" element={<Dashboard />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected History */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/:id"
          element={
            <ProtectedRoute>
              <AnalysisDetails />
            </ProtectedRoute>
          }
        />

        <Route
  path="/direct-gemini"
  element={
    <ProtectedRoute>
      <DirectGemini />
    </ProtectedRoute>
  }
/>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/personal"
          element={
            <ProtectedRoute>
              <PersonalInformation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/health"
          element={
            <ProtectedRoute>
              <HealthPreferences />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/security"
          element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}

        <Route path="/admin" element={<AdminLayout />}>

          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

          <Route
            path="analyses"
            element={<AdminAnalyses />}
          />
        </Route>

    </Routes>
       

    </BrowserRouter >
  );
}

export default AppRoutes;