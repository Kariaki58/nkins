"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";


export default function page() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center space-x-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium"
        >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
        </button>
    )
}