"use client";

import { useForm } from "@tanstack/react-form";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod";

import { createCategory, createSubject } from "@/actions/category.action";
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
import { Category } from "@/types";

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    desc: z.string(),
    img_url: z.string(),
});

const subjectSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    category_id: z.string().min(1, "Category is required"),
    desc: z.string(),
    img_url: z.string(),
});

export function CreateCategorySubjectForms({
    categories,
}: {
    categories: Category[];
}) {
    const [isCategoryPending, startCategory] = useTransition();
    const [isSubjectPending, startSubject] = useTransition();

    const sortedCategories = useMemo(
        () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
        [categories],
    );

    const categoryForm = useForm({
        defaultValues: {
            name: "",
            desc: "",
            img_url: "",
        },
        validators: {
            onSubmit: categorySchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Creating category...");
            startCategory(() => {
                void (async () => {
                    const result = await createCategory({
                        name: value.name.trim(),
                        desc: value.desc?.trim() || undefined,
                        img_url: value.img_url?.trim() || undefined,
                    });

                    if (result?.error) {
                        toast.error(result.error.message, { id: toastId });
                        return;
                    }

                    toast.success("Category created successfully", {
                        id: toastId,
                    });
                    categoryForm.reset();
                })();
            });
        },
    });

    const subjectForm = useForm({
        defaultValues: {
            name: "",
            category_id: "",
            desc: "",
            img_url: "",
        },
        validators: {
            onSubmit: subjectSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Creating subject...");
            startSubject(() => {
                void (async () => {
                    const result = await createSubject({
                        name: value.name.trim(),
                        desc: value.desc?.trim() || undefined,
                        img_url: value.img_url?.trim() || undefined,
                        category_id: value.category_id,
                    });

                    if (result?.error) {
                        toast.error(result.error.message, { id: toastId });
                        return;
                    }

                    toast.success("Subject created successfully", {
                        id: toastId,
                    });
                    subjectForm.reset();
                })();
            });
        },
    });

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Create Category</CardTitle>
                    <CardDescription>
                        Add a new category for organizing subjects.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="create-category-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            categoryForm.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <categoryForm.Field
                                name="name"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Name
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
                                                placeholder="e.g. Mathematics"
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
                            <categoryForm.Field
                                name="desc"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Description (optional)
                                        </FieldLabel>
                                        <textarea
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Short description of the category"
                                            className="min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                                        />
                                    </Field>
                                )}
                            />
                            <categoryForm.Field
                                name="img_url"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Image URL (optional)
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
                                <Button
                                    type="submit"
                                    disabled={isCategoryPending}
                                >
                                    {isCategoryPending
                                        ? "Creating..."
                                        : "Create Category"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Create Subject</CardTitle>
                    <CardDescription>
                        Create a subject under an existing category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="create-subject-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            subjectForm.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <subjectForm.Field
                                name="name"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Name
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
                                                placeholder="e.g. Algebra"
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
                            <subjectForm.Field
                                name="category_id"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Category
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
                                                    Select a category
                                                </option>
                                                {sortedCategories.map(
                                                    (category) => (
                                                        <option
                                                            key={
                                                                category.category_id
                                                            }
                                                            value={
                                                                category.category_id
                                                            }
                                                        >
                                                            {category.name}
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
                            <subjectForm.Field
                                name="desc"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Description (optional)
                                        </FieldLabel>
                                        <textarea
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Short description of the subject"
                                            className="min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                                        />
                                    </Field>
                                )}
                            />
                            <subjectForm.Field
                                name="img_url"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Image URL (optional)
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
                                <Button
                                    type="submit"
                                    disabled={isSubjectPending}
                                >
                                    {isSubjectPending
                                        ? "Creating..."
                                        : "Create Subject"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
