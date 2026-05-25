import { StatCard } from "@/components/utils/StatsCard";
import { getRecentAppointmentList } from "@/lib/appwrite/actions/appointment.action";
import { getAllPatients } from "@/lib/appwrite/actions/patient.actions";
import { requireAdmin } from "@/lib/appwrite/auth/guards";
import { unwrapAction } from "@/lib/appwrite/helper/unwrap-action";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminTabs from "../../components/admin/AdminTabs";

export default async function AdminPage() {
  // Middleware handles early auth checks.
  // This is the final server-side authorization guard.
  const [_, appointmentsResult, patientsResult] = await Promise.all([
    requireAdmin(),
    unwrapAction(getRecentAppointmentList),
    unwrapAction(getAllPatients),
  ]);

  return (
    <div className="mx-auto flex flex-col space-y-14">
      <AdminHeader />
      <main className="admin-main container">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome, Admin 👋</h1>

          <p className="text-dark-700">
            Manage appointments and view patient data
          </p>
        </section>

        {/* Stats Cards */}
        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointmentsResult.totalCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointmentsResult.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointmentsResult.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        {/* Tabs for Appointments, Patients, and Insights */}
        <AdminTabs
          appointments={appointmentsResult}
          patients={patientsResult?.patients || []}
        />
      </main>
    </div>
  );
}
