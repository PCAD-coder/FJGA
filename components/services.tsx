import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
const links = [
    { title: 'Features', href: '#' },
    { title: 'Solution', href: '#' },
    { title: 'Customers', href: '#' },
    { title: 'Pricing', href: '#' },
    { title: 'Help', href: '#' },
    { title: 'About', href: '#' },
]

export default function ContentSection() {
    return (
        <section id="services" className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl border-t px-6">
                <span className="text-caption -ml-6 -mt-3.5 mb-8 block w-max bg-gray-50 px-6 dark:bg-gray-950">
                    Services
                </span>
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-6xl font-medium">Uniting creativity, quality, and expert fabrication.</h2>
                    <div className="space-y-6">
                        <p><strong>Bespoke</strong><br></br>
                        Tailored glass pieces crafted to match your space, style, and vision.<br></br>
                        <strong>Installation</strong><br></br>
                        Precise and secure installations that ensure both beauty and performance.<br></br>
                        <strong>Fit-Outs</strong><br></br>
                        Functional, elegant furniture solutions for professional spaces.<br></br>
                        <strong>Consultation & Design Planning</strong><br></br>
                        Expert guidance to turn your ideas into refined, practical designs.<br></br>
                        <strong>Powder-Coated Aluminum Finishing</strong><br></br>
                        Sleek, corrosion-resistant finishes that elevate durability and style.</p><br></br>

                    </div>
                </div>
                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150"
                        >
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
