import { CartClient } from "@/components/cart/CartClient";

export const metadata = {
    title: 'Your Shopping Cart - Nkins Online',
    description: 'Review items in your shopping cart and proceed to checkout.',
};

export default function CartPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold">Shopping Cart</h1>
            </div>
            <CartClient />
        </div>
    );
}
