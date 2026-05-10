import { StatCard } from "@/components/utils/StatsCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.action";
import { getAllPatients } from "@/lib/actions/patient.actions";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminTabs from "../../components/admin/AdminTabs";

export default async function AdminPage() {
  const appointments = await getRecentAppointmentList();
  const patientsResult = await getAllPatients();

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
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        {/* Tabs for Appointments, Patients, and Insights */}
        <AdminTabs
          appointments={appointments}
          patients={patientsResult.data?.patients || []}
        />
      </main>
    </div>
  );
}
