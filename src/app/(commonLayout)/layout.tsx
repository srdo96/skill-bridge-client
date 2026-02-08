import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function CommonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
