import { RegisterForm } from "@/components/modules/authentication/register-form";

export default function RegisterPage() {
    return (
        <div className="flex py-2 w-full items-center justify-center  ">
            <div className="w-full max-w-sm">
                <RegisterForm />
            </div>
        </div>
    );
}
