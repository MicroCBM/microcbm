"use server";
import { RouteGuard } from "@/components/content-guard";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { cookies } from "next/headers";
import { SessionUser } from "@/types";
// import { logoutUserSession } from "@/libs/session";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = (await JSON.parse(
    (await cookies()).get("userData")?.value || "null"
  )) as SessionUser;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-1 flex pt-[53.35px]">
        <Sidebar user={user} />
        <div className="flex-1 ml-64 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="p-6 bg-gray-50 min-h-full">
            <RouteGuard loadingFallback={<div className="flex min-h-[200px] items-center justify-center text-sm text-gray-500">Loading…</div>}>
              {children}
            </RouteGuard>
          </div>
        </div>
      </section>
    </div>
  );
}
