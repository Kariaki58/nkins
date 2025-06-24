import { RegisterForm } from "@/components/auth/RegisterForm";
import Logo from "@/components/shared/Logo";

export default function RegisterPage() {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)] px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <Logo />
                    </div>
                    <h1 className="text-3xl font-bold">Admin Registration</h1>
                    <p className="text-muted-foreground">Create your admin account for Nkins.</p>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}
