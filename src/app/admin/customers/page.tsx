import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminCustomersPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Customers</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Customer Management</CardTitle>
                    <CardDescription>This feature is coming soon.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        You will be able to view your customer list, their order history, and manage customer data from this page.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
