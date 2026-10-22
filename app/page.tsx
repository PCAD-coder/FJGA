import ContentSection from "@/components/services"
import FooterSection from "@/components/contacts"
import HeroSection from "@/components/hero-section"
import ProjectsSection from "@/components/projects"
import FeedbackSection from "@/components/feedback"
import ProductsSection from "@/components/products-section"
import AboutSection from "@/components/about-section"
export default function Page() {
  return (
    <div>
    <HeroSection/>
    <ProductsSection />
    <ProjectsSection />
    <AboutSection />
    <ContentSection/>
    <FeedbackSection />
    <FooterSection/>
    </div>
  )
}
