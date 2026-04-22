"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.log("Error in error tx", error);

  const subject = encodeURIComponent("DocSync App Paused");
  const body = encodeURIComponent(
    "Hello, my DocSync app is paused and needs reactivation.",
  );
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-xl font-semibold text-red-500">Server Error</h1>
      <p>{error.message}</p>
      {error.message.includes("DocSync is paused") ? (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {" "}
          <Link
            href={`mailto:sabdullahialaba50@gmail.com?subject=${subject}&body=${body}`}
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Contact Support
          </Link>
          <button
            onClick={() => reset()}
            className="bg-dark-600 hover:bg-dark-500 cursor-pointer rounded px-4 py-2 text-white transition"
          >
            Try again
          </button>
        </div>
      ) : (
        <button
          onClick={() => reset()}
          className="bg-dark-600 hover:bg-dark-500 mt-4 cursor-pointer rounded px-4 py-2 text-white transition"
        >
          Try again
        </button>
      )}
    </div>
  );
}
