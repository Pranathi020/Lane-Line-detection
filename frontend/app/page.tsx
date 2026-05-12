import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { LiveDemoSection } from "@/components/live-demo-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { AnalyticsSection } from "@/components/analytics-section";
import { TechnologiesSection } from "@/components/technologies-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <LiveDemoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AnalyticsSection />
      <TechnologiesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
