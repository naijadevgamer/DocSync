"use client";

import { useState } from "react";
import FullLogo from "@/components/utils/FullLogo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logoutUser } from "@/lib/actions/auth.actions";
import {
  Activity,
  Calendar,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Import tab components
import OverviewTab from "./tabs/OverviewTab";
import AppointmentsTab from "./tabs/AppointmentsTab";
import ProfileTab from "./tabs/ProfileTab";
import SettingsTab from "./tabs/SettingsTab";
import MobileNav from "./MobileNav";
import { useLogout } from "@/hooks/useLogout";
import LogoutModal from "../modals/LogoutModal";
import { AppointmentUI, Patient } from "../../../types/appwrite.types";

export default function DashboardClient({
  user,
  patient,
  appointments,
}: {
  user: User;
  patient: Patient;
  appointments: AppointmentUI[];
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    isLoading: isLogoutLoading,
    showModal: showLogoutModal,
    handleLogout,
    confirmLogout,
    cancelLogout,
  } = useLogout({
    redirectTo: "/login",
    showToast: true,
  });

  return (
    <div className="bg-dark-300 min-h-screen">
      {/* Header - Consistent with Home page */}
      <header className="bg-dark-300/95 border-dark-400 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="shrink-0">
              <FullLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-4 md:flex">
              {/* <Link
                href="/"
                className="text-dark-600 hover:bg-dark-500/70 rounded-full px-4 py-2 text-sm transition-colors hover:text-white"
              >
                Home
              </Link> */}

              <Button
                variant="ghost"
                size="icon"
                className="text-dark-600 hover:text-white"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-dark-600 hover:text-red-500"
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
              </Button>

              {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <User className="h-4 w-4 text-green-500" />
              </div> */}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <MobileNav
            user={user}
            onClose={() => setMobileMenuOpen(false)}
            onLogout={handleLogout}
          />
        )}

        {/* Logout Modal */}
        <LogoutModal
          open={showLogoutModal}
          onOpenChange={cancelLogout}
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
          isLoading={isLogoutLoading}
        />
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-8 space-y-4">
          <h1 className="header">
            Welcome back, {patient?.gender === "male" ? "Mr." : "Ms."}{" "}
            {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-dark-700">Manage your appointments and profile.</p>
        </section>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="bg-dark-400 border-dark-500 inline-flex w-full gap-1 overflow-x-auto rounded-xl border p-1">
            <TabsTrigger
              value="overview"
              className="text-12-medium sm:text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-3 py-2 whitespace-nowrap transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-4"
            >
              <Activity className="inline h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="text-12-medium sm:text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-3 py-2 whitespace-nowrap transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-4"
            >
              <Calendar className="inline h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-12-medium sm:text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-3 py-2 whitespace-nowrap transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-4"
            >
              <User className="inline h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-12-medium sm:text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-3 py-2 whitespace-nowrap transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-4"
            >
              <Settings className="inline h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              user={user}
              patient={patient}
              appointments={appointments}
            />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsTab user={user} appointments={appointments} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab user={user} patient={patient} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab user={user} patient={patient} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
