// app/patients/[userId]/error.tsx
"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-xl font-semibold text-red-500">Server Error</h1>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-dark-600 mt-4 rounded px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  );
}
