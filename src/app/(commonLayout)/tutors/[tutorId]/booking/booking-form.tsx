"use client";

import { useForm } from "@tanstack/react-form";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod";

import { createBooking } from "@/actions/booking.action";
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
import { Availability, TutorSubject } from "@/types";
import { useRouter } from "next/navigation";

const bookingSchema = z.object({
    subject_id: z.string().min(1, "Subject is required"),
    availability_id: z.string().min(1, "Time slot is required"),
});

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
};

type BookingFormProps = {
    tutorProfileId: string;
    tutorName: string;
    hourlyRate: number;
    subjects: TutorSubject[];
    availabilities: Availability[];
};

export function BookingForm({
    tutorProfileId,
    tutorName,
    hourlyRate,
    subjects,
    availabilities,
}: BookingFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const availabilityMap = useMemo(
        () =>
            new Map(availabilities.map((slot) => [slot.availability_id, slot])),
        [availabilities],
    );

    const form = useForm({
        defaultValues: {
            subject_id: "",
            availability_id: "",
        },
        validators: {
            onSubmit: bookingSchema,
        },
        onSubmit: async ({ value }) => {
            const slot = availabilityMap.get(value.availability_id);
            if (!slot) {
                toast.error("Selected time slot is no longer available.");
                return;
            }

            const toastId = toast.loading("Requesting booking...");
            startTransition(() => {
                void (async () => {
                    const result = await createBooking({
                        tutor_profile_id: tutorProfileId,
                        subject_id: value.subject_id,
                        day_of_week: slot.day_of_week,
                        start_time: slot.start_time,
                        end_time: slot.end_time,
                    });

                    if (result?.error) {
                        toast.error(result.error.message, { id: toastId });
                        return;
                    }

                    toast.success("Booking requested successfully", {
                        id: toastId,
                    });
                    router.push("/dashboard/bookings");
                })();
            });
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Request a booking</CardTitle>
                <CardDescription>
                    Choose a subject and time slot with {tutorName}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="booking-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field
                            name="subject_id"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Subject
                                        </FieldLabel>
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                            required
                                        >
                                            <option value="">
                                                Select subject
                                            </option>
                                            {subjects.map((subject) => (
                                                <option
                                                    key={subject.subject_id}
                                                    value={subject.subject_id}
                                                >
                                                    {subject.subject.name}
                                                </option>
                                            ))}
                                        </select>
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
                            name="availability_id"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Time slot
                                        </FieldLabel>
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                            required
                                        >
                                            <option value="">
                                                Select time slot
                                            </option>
                                            {availabilities.map((slot) => (
                                                <option
                                                    key={slot.availability_id}
                                                    value={slot.availability_id}
                                                >
                                                    {slot.day_of_week} ·{" "}
                                                    {formatTime(
                                                        slot.start_time,
                                                    )}
                                                    {" - "}
                                                    {formatTime(slot.end_time)}
                                                </option>
                                            ))}
                                        </select>
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />

                        <div className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
                            Hourly rate: ${hourlyRate}/hr
                        </div>

                        <Field>
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? "Requesting..."
                                    : "Request booking"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
