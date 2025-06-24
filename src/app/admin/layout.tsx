import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-secondary/20">
            <AdminHeader />
            <main className="p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
