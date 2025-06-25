import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminOrdersPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Orders</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>This feature is coming soon.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        You will be able to view customer orders, update their status (e.g., pending, shipped, delivered), and manage returns from this page.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
