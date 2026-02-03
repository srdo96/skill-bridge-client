import { cn } from "@/lib/utils";

import { Logo, LogoImage, LogoText } from "@/components/shadcnblocks/logo";

interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface Footer2Props {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    className?: string;
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const Footer = ({
    logo = {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
        alt: "logo",
        title: "SkillBridge",
        url: "/",
    },
    className,
    tagline = "Connect with Expert Tutors, Learn Anything",
    menuItems = [
        {
            title: "Subjects",
            links: [
                { text: "Overview", url: "/subjects" },
                { text: "Pricing", url: "/subjects" },
                { text: "Marketplace", url: "/subjects" },
                { text: "Features", url: "/subjects" },
                { text: "Integrations", url: "/subjects" },
                { text: "Pricing", url: "/subjects" },
            ],
        },
        {
            title: "Company",
            links: [
                { text: "About", url: "/about" },
                { text: "Team", url: "#" },
                { text: "Blog", url: "/blog" },
                { text: "Careers", url: "/careers" },
                { text: "Contact", url: "/contact" },
                { text: "Privacy", url: "/privacy" },
            ],
        },
        {
            title: "Resources",
            links: [
                { text: "Help", url: "#" },
                { text: "Sales", url: "#" },
                { text: "Advertise", url: "#" },
            ],
        },
        {
            title: "Social",
            links: [
                { text: "Twitter", url: "#" },
                { text: "Instagram", url: "#" },
                { text: "LinkedIn", url: "#" },
            ],
        },
    ],
    copyright = "© 2024 Shadcnblocks.com. All rights reserved.",
    bottomLinks = [
        { text: "Terms and Conditions", url: "#" },
        { text: "Privacy Policy", url: "#" },
    ],
}: Footer2Props) => {
    return (
        <section className={cn("py-32", className)}>
            <div className="container">
                <footer>
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                        <div className="col-span-2 mb-8 lg:mb-0">
                            <div className="flex items-center gap-2 lg:justify-start">
                                <Logo url="https://shadcnblocks.com">
                                    <LogoImage
                                        src={logo.src}
                                        alt={logo.alt}
                                        title={logo.title}
                                        className="h-10 dark:invert"
                                    />
                                    <LogoText className="text-xl">
                                        {logo.title}
                                    </LogoText>
                                </Logo>
                            </div>
                            <p className="mt-4 font-bold">{tagline}</p>
                        </div>
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">
                                    {section.title}
                                </h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary"
                                        >
                                            <a href={link.url}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                        <p>{copyright}</p>
                        <ul className="flex gap-4">
                            {bottomLinks.map((link, linkIdx) => (
                                <li
                                    key={linkIdx}
                                    className="underline hover:text-primary"
                                >
                                    <a href={link.url}>{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export { Footer };
