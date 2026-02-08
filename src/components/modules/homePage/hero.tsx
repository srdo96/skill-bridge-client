import { ArrowDownRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Hero3Props {
    heading?: string;
    description?: string;
    buttons?: {
        primary?: {
            text: string;
            url: string;
            className?: string;
        };
        secondary?: {
            text: string;
            url: string;
        };
    };
    reviews?: {
        count: number;
        avatars: {
            src: string;
            alt: string;
        }[];
        rating?: number;
    };
    className?: string;
}

const Hero = ({
    heading = "Find Your Perfect Tutor on SkillBridge",
    description = "Connect with expert tutors, book personalized sessions, and master any subject at your own pace.",
    buttons = {
        primary: {
            text: "Browse Tutors",
            url: "/tutors",
        },
        secondary: {
            text: "Get Started",
            url: "/register",
        },
    },

    className,
}: Hero3Props) => {
    return (
        <section className={cn("py-3", className)}>
            <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-20 mx-auto">
                <div className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left">
                    <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl xl:text-7xl">
                        {heading}
                    </h1>
                    <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                        {description}
                    </p>

                    <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                        {buttons.primary && (
                            <Button asChild className="w-full sm:w-auto">
                                <Link href={buttons.primary.url}>
                                    {buttons.primary.text}
                                </Link>
                            </Button>
                        )}
                        {buttons.secondary && (
                            <Button asChild variant="outline">
                                <Link href={buttons.secondary.url}>
                                    {buttons.secondary.text}
                                    <ArrowDownRight className="size-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex">
                    <Image
                        src="/hero-image.png"
                        width={500}
                        height={500}
                        alt="placeholder hero"
                        className="max-h-[600px] w-full rounded-md object-cover lg:max-h-[800px]"
                    />
                </div>
            </div>
        </section>
    );
};

export { Hero };
