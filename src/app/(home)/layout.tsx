"use server";
import { RouteGuard } from "@/components/content-guard";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { cookies } from "next/headers";
import { SessionUser } from "@/types";

function parseUserData(raw: string | undefined): SessionUser | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = parseUserData((await cookies()).get("userData")?.value);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-1 flex pt-[53.35px]">
        <Sidebar user={user} />
        <div className="flex-1 ml-64 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="p-6 bg-gray-50">
            <RouteGuard loadingFallback={<div className="flex min-h-[200px] items-center justify-center text-sm text-gray-500">Loading…</div>}>
              {children}
            </RouteGuard>
          </div>
        </div>
      </section>
    </div>
  );
}
