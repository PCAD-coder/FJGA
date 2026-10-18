import ContentSection from "@/components/services"
import FooterSection from "@/components/contacts"
import HeroSection from "@/components/hero-section"
import ProjectsSection from "@/components/projects"
import FeedbackSection from "@/components/feedback"
export default function Page() {
  return (
    <div>
    <HeroSection/>
    <ProjectsSection />
    <ContentSection/>
    <FeedbackSection />
    <FooterSection/>
    </div>
  )
}
