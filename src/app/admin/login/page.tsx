import { LoginForm } from "@/components/admin/LoginForm";
import Logo from "@/components/shared/Logo";

export default function AdminLoginPage() {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)] px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <Logo />
                    </div>
                    <h1 className="text-3xl font-bold">Admin Panel</h1>
                    <p className="text-muted-foreground">Sign in to manage your store.</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
