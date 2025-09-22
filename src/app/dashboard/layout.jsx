import Sidebar from "./sidebar";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/options";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";


export default async function DashboardLayout({ children }) {
    const session = await getServerSession(options);
    if (!session) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Please sign in</h1>
            </div>
        );
    }
    console.log({session})
    if (session.user.role !== "admin") {

        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">You are not authorized to view this page</h1>
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Home
                </Link>
            </div>
        );
    }
    return (
        <div className="py-8">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <Sidebar />
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}