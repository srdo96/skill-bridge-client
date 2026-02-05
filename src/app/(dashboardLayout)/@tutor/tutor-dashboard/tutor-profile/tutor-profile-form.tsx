"use client";

import { useForm } from "@tanstack/react-form";
import { useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod";

import {
    createTutorProfile,
    updateTutorProfile,
} from "@/actions/tutor-profile.action";
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
import { TutorProfile } from "@/types";

const profileSchema = z.object({
    hourly_rate: z
        .string()
        .min(1, "Hourly rate is required")
        .refine((value) => !Number.isNaN(Number(value)), "Must be a number")
        .refine((value) => Number(value) > 0, "Must be greater than 0"),
    year_of_experience: z
        .string()
        .min(1, "Years of experience is required")
        .refine((value) => !Number.isNaN(Number(value)), "Must be a number")
        .refine((value) => Number(value) >= 0, "Must be 0 or greater"),
});

export function TutorProfileForm({
    initialProfile,
}: {
    initialProfile: TutorProfile | null;
}) {
    const [isPending, startTransition] = useTransition();
    console.log("initialProfile", initialProfile);

    const form = useForm({
        defaultValues: {
            hourly_rate: initialProfile?.hourly_rate?.toString() ?? "",
            year_of_experience:
                initialProfile?.year_of_experience?.toString() ?? "",
        },
        validators: {
            onSubmit: profileSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading(
                initialProfile ? "Updating profile..." : "Creating profile...",
            );
            startTransition(() => {
                void (async () => {
                    const payload = {
                        hourly_rate: Number(value.hourly_rate),
                        year_of_experience: Number(value.year_of_experience),
                    };

                    const result = initialProfile
                        ? await updateTutorProfile(
                              payload,
                              initialProfile.tutor_profile_id,
                          )
                        : await createTutorProfile(payload);

                    if (result?.error) {
                        toast.error(result.error.message, { id: toastId });
                        return;
                    }

                    toast.success(
                        initialProfile
                            ? "Profile updated successfully"
                            : "Profile created successfully",
                        { id: toastId },
                    );
                })();
            });
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tutor Profile</CardTitle>
                <CardDescription>
                    {initialProfile
                        ? "Update your tutoring profile details."
                        : "Create your tutor profile to start receiving bookings."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="tutor-profile-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field
                            name="hourly_rate"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Hourly Rate
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="e.g. 25.00"
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
                            name="year_of_experience"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Years of Experience
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="e.g. 3"
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
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? initialProfile
                                        ? "Updating..."
                                        : "Creating..."
                                    : initialProfile
                                      ? "Update Profile"
                                      : "Create Profile"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
