"use client";

import { useForm } from "@tanstack/react-form";
import { Trash2 } from "lucide-react";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod";

import {
    createAvailability,
    deleteAvailability,
} from "@/actions/tutor-availability.action";
import { Badge } from "@/components/ui/badge";
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
import { Availability, Days } from "@/types";

const availabilitySchema = z.object({
    day_of_week: z.string().min(1, "Day is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
});

const dayOptions = [
    Days.SATURDAY,
    Days.SUNDAY,
    Days.MONDAY,
    Days.TUESDAY,
    Days.WEDNESDAY,
    Days.THURSDAY,
    Days.FRIDAY,
];

function formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
}

export function TutorAvailabilityForm({
    availabilities,
}: {
    availabilities: Availability[];
}) {
    const [isPending, startTransition] = useTransition();
    const [isDeleting, startDeleting] = useTransition();

    const form = useForm({
        defaultValues: {
            day_of_week: "",
            start_time: "",
            end_time: "",
        },
        validators: {
            onSubmit: availabilitySchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Adding availability...");
            startTransition(() => {
                void (async () => {
                    const result = await createAvailability(value);
                    if (result?.error) {
                        toast.error(result.error.message, { id: toastId });
                        return;
                    }
                    toast.success("Availability added", { id: toastId });
                    form.reset();
                })();
            });
        },
    });

    const grouped = useMemo(() => {
        const byDay = new Map<Days, Availability[]>();
        dayOptions.forEach((day) => byDay.set(day, []));
        availabilities.forEach((item) => {
            const day = item.day_of_week as Days;
            if (!byDay.has(day)) byDay.set(day, []);
            byDay.get(day)?.push(item);
        });
        byDay.forEach((list) =>
            list.sort((a, b) => a.start_time.localeCompare(b.start_time)),
        );
        return byDay;
    }, [availabilities]);

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Add Availability</CardTitle>
                    <CardDescription>
                        Add the time slots when you are available to teach.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="tutor-availability-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <form.Field
                                name="day_of_week"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Day of Week
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
                                                    Select day
                                                </option>
                                                {dayOptions.map((day) => (
                                                    <option
                                                        key={day}
                                                        value={day}
                                                    >
                                                        {day}
                                                    </option>
                                                ))}
                                            </select>
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
                                name="start_time"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Start Time
                                            </FieldLabel>
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                type="time"
                                                value={field.state.value}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                required
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
                                name="end_time"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                End Time
                                            </FieldLabel>
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                type="time"
                                                value={field.state.value}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                required
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
                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending
                                        ? "Adding..."
                                        : "Add Availability"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Availability</CardTitle>
                    <CardDescription>
                        Manage your weekly availability schedule.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...grouped.entries()].map(([day, items]) => (
                        <div key={day} className="space-y-2">
                            <div className="text-sm font-semibold">{day}</div>
                            {items.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    No slots added
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {items.map((slot) => (
                                        <div
                                            key={slot.availability_id}
                                            className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">
                                                    {formatTime(
                                                        slot.start_time,
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(slot.end_time)}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={isDeleting}
                                                onClick={() =>
                                                    startDeleting(() => {
                                                        void (async () => {
                                                            const result =
                                                                await deleteAvailability(
                                                                    slot.availability_id,
                                                                );
                                                            if (result?.error) {
                                                                toast.error(
                                                                    result.error
                                                                        .message,
                                                                );
                                                                return;
                                                            }
                                                            toast.success(
                                                                "Availability removed",
                                                            );
                                                        })();
                                                    })
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
