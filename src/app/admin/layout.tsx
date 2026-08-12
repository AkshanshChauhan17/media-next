// 3. src/app/admin/layout.tsx
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}