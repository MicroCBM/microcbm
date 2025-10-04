import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-1 flex">
        <Sidebar />
        <div className="min-h-screen w-full p-6">{children}</div>
      </section>
    </div>
  );
}
