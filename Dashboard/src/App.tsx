import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Team from "./pages/Team";
import Therapist from "./pages/Therapist";
import SettingsIndex from "./pages/Settings/index";
import SecurityPrivacy from "./pages/Settings/SecurityPrivacy";
import Language from "./pages/Settings/Language";
import Profile from "./pages/Settings/Profile";
import Onboarding from "./pages/Settings/Onboarding";
import Subscriptions from "./pages/Subscriptions";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import { I18nProvider } from "./lib/i18n/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Students />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Team />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/therapist"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Therapist />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Settings routes (protected) */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SettingsIndex />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/security"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SecurityPrivacy />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/language"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Language />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/onboarding"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Onboarding />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* <Route path="/subscriptions" element={
                <ProtectedRoute>
                  <AppLayout><Subscriptions /></AppLayout>
                </ProtectedRoute>
              } /> */}
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Support />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
