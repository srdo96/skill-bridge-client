"use client";
import { getMyTutorProfile } from "@/actions/tutor-profile.action";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Roles } from "@/constants/roles";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});
export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Logging in...");
            try {
                const { data, error } = await authClient.signIn.email({
                    ...value,
                    // callbackURL: "http://localhost:3000",
                });
                if (error) {
                    toast.error(error.message, { id: toastId });
                    return;
                }
                const userRole = (data?.user as { role?: string } | undefined)
                    ?.role;
                if (userRole === Roles.tutor) {
                    const { data: tutorData } = await getMyTutorProfile();
                    console.log("tutor data", tutorData);
                    if (
                        tutorData?.success &&
                        tutorData?.data?.tutorProfiles === null
                    ) {
                        toast.success("Logged in successfully", {
                            id: toastId,
                        });
                        router.push("/tutor-dashboard/tutor-profile");
                    } else {
                        toast.success("Logged in successfully", {
                            id: toastId,
                        });
                        router.push("/tutor-dashboard");
                    }
                } else {
                    toast.success("Logged in successfully", { id: toastId });
                    router.push("/");
                }
            } catch (error: any) {
                toast.error(error.message, { id: toastId });
            }
        },
    });
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="login-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <form.Field
                                name="email"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Email
                                            </FieldLabel>
                                            <Input
                                                type="email"
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {isInvalid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <form.Field
                                name="password"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Password
                                            </FieldLabel>
                                            <Input
                                                type="password"
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {isInvalid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <FieldGroup>
                                <Field>
                                    <Button type="submit">Login</Button>
                                    {/* <Button variant="outline" type="button">
                                        Login with Google
                                    </Button> */}
                                    <FieldDescription className="px-6 text-center">
                                        Don't have an account?{" "}
                                        <Link
                                            href="/register"
                                            className="text-primary underline"
                                        >
                                            Create an account
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
