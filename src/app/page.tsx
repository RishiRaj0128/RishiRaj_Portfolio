import fs from "fs";
import path from "path";
import { AudienceProvider } from "@/components/notebook/AudienceContext";
import { Header } from "@/components/notebook/Header";
import { Hero } from "@/components/notebook/Hero";
import { ScrollStory } from "@/components/notebook/ScrollStory";
import { ProjectsSection } from "@/components/notebook/ProjectsSection";
import { SkillsSection } from "@/components/notebook/SkillsSection";
import { AboutPrinciples } from "@/components/notebook/AboutPrinciples";
import { TimelineSecurity } from "@/components/notebook/TimelineSecurity";
import { ContactSection } from "@/components/notebook/ContactSection";
import { Footer } from "@/components/notebook/Footer";

export default function HomePage() {
  const photoPath = path.join(process.cwd(), "public", "rishi.jpg");
  const hasPhoto = fs.existsSync(photoPath);

  return (
    <AudienceProvider>
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[2px] font-mono text-xs"
      >
        Skip to main content
      </a>

      {/* Main Notebook Header with Audience Switch & Theme Toggle */}
      <Header />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero hasPhoto={hasPhoto} />
        <ScrollStory />
        <ProjectsSection />
        <SkillsSection />
        <AboutPrinciples />
        <TimelineSecurity />
        <ContactSection />
      </main>

      {/* Site Footer */}
      <Footer />
    </AudienceProvider>
  );
}
