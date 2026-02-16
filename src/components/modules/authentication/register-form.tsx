"use client";
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
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.enum([Roles.student, Roles.tutor] as const, {
        message: "Please select a role",
    }),
});

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: Roles.student,
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Creating account...");
            try {
                const { data, error } = await authClient.signUp.email({
                    ...value,
                    callbackURL: "/login",
                });

                if (error) {
                    toast.error(error.message, { id: toastId });
                    return;
                }
                toast.success("Account created successfully", { id: toastId });
                router.push("/login");
            } catch (error: any) {
                toast.error(error.message, { id: toastId });
                return;
            }
        },
    });
    const isSubmitting = form.state.isSubmitting;
    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="register-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor="name">
                                            Full Name
                                        </FieldLabel>
                                        <Input
                                            type="text"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="John Doe"
                                            required
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
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
                                                errors={field.state.meta.errors}
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
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <form.Field
                            name="role"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel>Select Role</FieldLabel>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <Button
                                                type="button"
                                                variant={
                                                    field.state.value ===
                                                    Roles.student
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    field.handleChange(
                                                        Roles.student,
                                                    )
                                                }
                                                aria-pressed={
                                                    field.state.value ===
                                                    Roles.student
                                                }
                                            >
                                                Student
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={
                                                    field.state.value ===
                                                    Roles.tutor
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    field.handleChange(
                                                        Roles.tutor,
                                                    )
                                                }
                                                aria-pressed={
                                                    field.state.value ===
                                                    Roles.tutor
                                                }
                                            >
                                                Tutor
                                            </Button>
                                        </div>
                                        <FieldDescription>
                                            Choose how you want to use the
                                            platform.
                                        </FieldDescription>
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <FieldGroup>
                            <Field>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? "Creating account..."
                                        : "Create Account"}
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    disabled={isSubmitting}
                                >
                                    Sign up with Google
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="text-primary underline"
                                    >
                                        Sign in
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
