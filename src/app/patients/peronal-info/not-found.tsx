// app/patients/[userId]/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold text-red-500">User not found</h1>
      <p className="text-gray-600">
        The patient ID you requested does not exist.
      </p>
    </div>
  );
}
