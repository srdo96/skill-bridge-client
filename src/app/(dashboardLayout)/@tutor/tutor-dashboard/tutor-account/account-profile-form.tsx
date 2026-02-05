"use client";

import { useForm } from "@tanstack/react-form";
import { useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod";

import { updateUserProfile } from "@/actions/user-profile.action";
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
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { User } from "@/types";

const accountSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    phone: z.string(),
    image: z.string(),
});

export function AccountProfileForm({ user }: { user: User }) {
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        defaultValues: {
            name: user.name ?? "",
            phone: user.phone ?? "",
            image: user.image ?? "",
        },
        validators: {
            onSubmit: accountSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Updating account...");
            startTransition(() => {
                void (async () => {
                    const result = await updateUserProfile(
                        {
                            name: value.name.trim(),
                            phone: value.phone?.trim() || undefined,
                            image: value.image?.trim() || undefined,
                        },
                        user.id,
                    );

                    if (result?.error) {
                        toast.error(result.error.message, { id: toastId });
                        return;
                    }

                    toast.success("Account updated successfully", {
                        id: toastId,
                    });
                })();
            });
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Profile</CardTitle>
                <CardDescription>
                    Update your account details and contact information.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="account-profile-form"
                    onSubmit={(event) => {
                        event.preventDefault();
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
                                        <FieldLabel htmlFor={field.name}>
                                            Full Name
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="e.g. Jane Doe"
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
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input value={user.email} disabled />
                        </Field>
                        <form.Field
                            name="phone"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>
                                        Phone (optional)
                                    </FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. +8801XXXXXXXXX"
                                    />
                                </Field>
                            )}
                        />
                        <form.Field
                            name="image"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>
                                        Avatar URL (optional)
                                    </FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://..."
                                        type="url"
                                    />
                                </Field>
                            )}
                        />
                        <Field>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Updating..." : "Update Account"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
