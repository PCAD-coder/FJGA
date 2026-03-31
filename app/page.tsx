import ContentSection from "@/components/services"
import FooterSection from "@/components/contacts"
import HeroSection from "@/components/hero-section"
import TeamSection from "@/components/projects"
import { Button } from "@/components/ui/button"
import SignUp from "@/components/sign-up"
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
