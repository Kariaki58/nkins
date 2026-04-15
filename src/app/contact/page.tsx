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
                            <a href="mailto:support@giftoboutique.com" className="text-primary hover:underline">support@giftoboutique.com</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Phone</h3>
                            <p className="text-muted-foreground">Mon-Sat, 9am-6pm WAT.</p>
                            <a href="tel:+2348103549727" className="text-primary hover:underline">+234 810 354 9727</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Our Store</h3>
                            <p className="text-muted-foreground">Nwaniba Road, Uyo 520101, Akwa Ibom, Nigeria</p>
                            <p className="text-muted-foreground mt-1">Also at 139 Aka Etinan Road, Uyo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
