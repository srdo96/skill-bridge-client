"use client";

import { useForm } from "@tanstack/react-form";
import { Trash2 } from "lucide-react";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod";

import {
    addTutorSubject,
    removeTutorSubject,
} from "@/actions/tutor-subjects.action";
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
import { Subject, TutorSubject } from "@/types";

const subjectSchema = z.object({
    subject_id: z.string().min(1, "Subject is required"),
});

export function TutorSubjectsForm({
    subjects,
    tutorSubjects,
}: {
    subjects: Subject[];
    tutorSubjects: TutorSubject[];
}) {
    const [isPending, startTransition] = useTransition();
    const [isRemoving, startRemoving] = useTransition();

    const assignedIds = useMemo(
        () => new Set(tutorSubjects.map((item) => item.subject_id)),
        [tutorSubjects],
    );

    const availableSubjects = useMemo(
        () =>
            subjects.filter((subject) => !assignedIds.has(subject.subject_id)),
        [subjects, assignedIds],
    );

    const form = useForm({
        defaultValues: {
            subject_id: "",
        },
        validators: {
            onSubmit: subjectSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Adding subject...");
            startTransition(() => {
                void (async () => {
                    const result = await addTutorSubject({
                        subject_id: value.subject_id,
                    });
                    if (result?.error) {
                        toast.error(result.error.message, { id: toastId });
                        return;
                    }
                    toast.success("Subject added", { id: toastId });
                    form.reset();
                })();
            });
        },
    });

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Add Subject</CardTitle>
                    <CardDescription>
                        Select subjects you can teach.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="tutor-subjects-form"
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
                                                    Select a subject
                                                </option>
                                                {availableSubjects.map(
                                                    (subject) => (
                                                        <option
                                                            key={
                                                                subject.subject_id
                                                            }
                                                            value={
                                                                subject.subject_id
                                                            }
                                                        >
                                                            {subject.name}
                                                        </option>
                                                    ),
                                                )}
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
                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Adding..." : "Add Subject"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Subjects</CardTitle>
                    <CardDescription>
                        Manage subjects assigned to your profile.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {tutorSubjects.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No subjects assigned yet.
                        </p>
                    ) : (
                        tutorSubjects.map((item) => (
                            <div
                                key={item.subject_id}
                                className="flex items-center justify-between rounded-md border px-3 py-2"
                            >
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {item.subject?.name || "Subject"}
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isRemoving}
                                    onClick={() =>
                                        startRemoving(() => {
                                            void (async () => {
                                                const result =
                                                    await removeTutorSubject(
                                                        item.subject_id,
                                                    );
                                                if (result?.error) {
                                                    toast.error(
                                                        result.error.message,
                                                    );
                                                    return;
                                                }
                                                toast.success(
                                                    "Subject removed",
                                                );
                                            })();
                                        })
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
