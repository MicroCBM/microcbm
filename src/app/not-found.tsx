import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-sm text-gray-400 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-black px-6 py-2.5 text-sm text-white hover:bg-gray-800 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
