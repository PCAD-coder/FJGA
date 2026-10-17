import ContentSection from "@/components/services"
import FooterSection from "@/components/contacts"
import HeroSection from "@/components/hero-section"
import TeamSection from "@/components/projects"
export default function Page() {
  return (
    <div>
    <HeroSection/>
    <TeamSection/>
    <ContentSection/>
    <FooterSection/>
    </div>
  )
}
