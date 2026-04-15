import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
    title: 'Contact Us - Gifto Boutique',
    description: 'Get in touch with Gifto Boutique, Uyo. We are here to help with any questions about our products, orders, or styling advice.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
                <p className="mt-2 text-lg text-muted-foreground">We&apos;d love to hear from you!</p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="bg-secondary/30 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    <ContactForm />
                </div>
                <div className="space-y-8 pt-2">
                    <h2 className="text-2xl font-bold text-center md:text-left">Our Information</h2>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Email</h3>
                            <p className="text-muted-foreground">Reach out to us for any inquiries.</p>
                            <a href="mailto:info@ciftoconcepts.com" className="text-primary hover:underline">info@ciftoconcepts.com</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Phone</h3>
                            <p className="text-muted-foreground">Mon-Sat: 8:00 AM - 7:00 PM · Sun: 10:00 AM - 5:00 PM</p>
                            <a href="tel:+2348085936511" className="text-primary hover:underline">+234 808 593 6511</a>
                            <br />
                            <a href="tel:+2347064255138" className="text-primary hover:underline">+234 706 425 5138</a>
                            <br />
                            <a href="tel:+2347011703831" className="text-primary hover:underline">+234 701 170 3831</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Head Office</h3>
                            <p className="text-muted-foreground">135 Aka Etinan Road, by NTA Uyo, Akwa Ibom State</p>
                            <h3 className="text-lg font-semibold mt-4">Branch Office</h3>
                            <p className="text-muted-foreground">328 Nwaniba Road, Use Offot, Uyo, Akwa Ibom State</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
