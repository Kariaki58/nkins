import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata = {
    title: 'Checkout - Nkins Online',
    description: 'Complete your purchase securely.',
};

export default function CheckoutPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold">Checkout</h1>
            </div>
            <CheckoutClient />
        </div>
    );
}
