import { Hero } from "@/components/modules/homePage/hero";
import Link from "next/link";

export default function HomePage() {
    return (
        <div>
            <Hero />
            {/* Additional sections start here */}

            {/* About Section */}
            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        About SkillBridge
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                        SkillBridge connects students with expert tutors to help
                        you master any subject, anytime, anywhere. Our platform
                        is dedicated to helping learners achieve their academic
                        goals through personalized guidance and support.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">
                        Why Choose Us?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="bg-card p-6 rounded-lg shadow text-center">
                            <h3 className="text-xl font-semibold mb-2">
                                Expert Tutors
                            </h3>
                            <p className="text-muted-foreground">
                                Learn from industry professionals and top
                                educators with proven experience.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow text-center">
                            <h3 className="text-xl font-semibold mb-2">
                                Flexible Scheduling
                            </h3>
                            <p className="text-muted-foreground">
                                Book sessions that fit your schedule—anytime,
                                anywhere in the world.
                            </p>
                        </div>
                        <div className="bg-card p-6 rounded-lg shadow text-center">
                            <h3 className="text-xl font-semibold mb-2">
                                Personalized Learning
                            </h3>
                            <p className="text-muted-foreground">
                                Get tailored lessons and feedback designed just
                                for your needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to get started?
                    </h2>
                    <p className="mb-6">
                        Join SkillBridge and start your learning journey today.
                    </p>
                    <Link
                        href="/register"
                        className="inline-block bg-card text-card-foreground font-semibold px-6 py-3 rounded hover:bg-muted transition"
                    >
                        Sign Up Now
                    </Link>
                </div>
            </section>

            {/* Additional sections end here */}
        </div>
    );
}
