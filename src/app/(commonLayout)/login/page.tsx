import { LoginForm } from "@/components/modules/authentication/login-form";

export default function LoginPage() {
    return (
        <div className="flex py-2 w-full items-center justify-center  ">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    );
}
