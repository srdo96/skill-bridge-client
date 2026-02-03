"use client";

import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { Accordion } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
    requiresAuth?: boolean;
}

interface Navbar1Props {
    className?: string;
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
        className?: string;
    };
    menu?: MenuItem[];
    auth?: {
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
}

const Navbar = ({
    logo = {
        url: "/",
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
        alt: "logo",
        title: "SkillBridge",
    },
    menu = [
        { title: "Home", url: "/" },
        {
            title: "Tutors",
            url: "/tutors",
        },
        {
            title: "Subjects",
            url: "/subjects",
        },
        {
            title: "Dashboard",
            url: "/dashboard",
            requiresAuth: true,
        },
    ],
    auth = {
        login: { title: "Login", url: "/login" },
        signup: { title: "Sign up", url: "/register" },
    },
    className,
}: Navbar1Props) => {
    const { data: session } = authClient.useSession();

    const handleLogout = async () => {
        await authClient.signOut();
    };

    // Filter menu items based on auth state
    const filteredMenu = menu.filter((item) => !item.requiresAuth || session);

    return (
        <section className={cn("py-4", className)}>
            <div className="container">
                {/* Desktop Menu */}
                <nav className="hidden items-center justify-between lg:flex">
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src={logo.src}
                                width={32}
                                height={32}
                                className="max-h-8 dark:invert"
                                alt={logo.alt}
                            />
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </Link>
                        <div className="flex items-center">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {filteredMenu.map((item) =>
                                        renderMenuItem(item),
                                    )}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {session ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-8">
                                        <AvatarImage
                                            src={
                                                session.user.image || undefined
                                            }
                                            alt={session.user.name}
                                        />
                                        <AvatarFallback>
                                            {session.user.name
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            {session.user.name}
                                        </span>
                                        {(session.user as { role?: string })
                                            .role && (
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {
                                                    (
                                                        session.user as {
                                                            role?: string;
                                                        }
                                                    ).role
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={auth.login.url}>
                                        {auth.login.title}
                                    </Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={auth.signup.url}>
                                        {auth.signup.title}
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href={logo.url}
                            className="flex items-center gap-2"
                        >
                            <img
                                src={logo.src}
                                className="max-h-8 dark:invert"
                                alt={logo.alt}
                            />
                        </Link>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>
                                        <Link
                                            href={logo.url}
                                            className="flex items-center gap-2"
                                        >
                                            <img
                                                src={logo.src}
                                                className="max-h-8 dark:invert"
                                                alt={logo.alt}
                                            />
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 p-4">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="flex w-full flex-col gap-4"
                                    >
                                        {filteredMenu.map((item) =>
                                            renderMobileMenuItem(item),
                                        )}
                                    </Accordion>

                                    <div className="flex flex-col gap-3">
                                        {session ? (
                                            <>
                                                <div className="flex items-center gap-3 py-2">
                                                    <Avatar className="size-10">
                                                        <AvatarImage
                                                            src={
                                                                session.user
                                                                    .image ||
                                                                undefined
                                                            }
                                                            alt={
                                                                session.user
                                                                    .name
                                                            }
                                                        />
                                                        <AvatarFallback>
                                                            {session.user.name
                                                                ?.split(" ")
                                                                .map(
                                                                    (n) => n[0],
                                                                )
                                                                .join("")
                                                                .toUpperCase() ||
                                                                "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">
                                                            {session.user.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {session.user.email}
                                                        </span>
                                                        {(
                                                            session.user as {
                                                                role?: string;
                                                            }
                                                        ).role && (
                                                            <span className="text-xs font-medium text-primary capitalize">
                                                                {
                                                                    (
                                                                        session.user as {
                                                                            role?: string;
                                                                        }
                                                                    ).role
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                >
                                                    <Link href={auth.login.url}>
                                                        {auth.login.title}
                                                    </Link>
                                                </Button>
                                                <Button asChild>
                                                    <Link
                                                        href={auth.signup.url}
                                                    >
                                                        {auth.signup.title}
                                                    </Link>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </section>
    );
};

const renderMenuItem = (item: MenuItem) => {
    return (
        <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
                href={item.url}
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
            >
                {item.title}
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
};

const renderMobileMenuItem = (item: MenuItem) => {
    return (
        <Link
            key={item.title}
            href={item.url}
            className="text-md font-semibold hover:text-primary"
        >
            {item.title}
        </Link>
    );
};

export { Navbar };
