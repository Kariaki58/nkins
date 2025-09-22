'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Nkins Policies</h1>

      {/* Privacy Policy */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We respect your privacy and are committed to protecting your personal data.
            Information collected during checkout (such as your name, email, phone number,
            and delivery address) is used <strong>solely</strong> for order processing,
            delivery, and customer support.
          </p>
          <p>
            We do not sell, rent, or share your personal information with third parties,
            except where required to fulfill your order (e.g., shipping carriers or payment
            providers).
          </p>
          <p>
            Payment information is securely handled by trusted third-party gateways (such as
            <strong> Paystack</strong>) and is never stored directly by Nkins.
          </p>
        </CardContent>
      </Card>

      {/* Shipping Policy */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Shipping Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Orders are typically processed within <strong>1–2 business days</strong> after confirmation.</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Lagos</strong>: 1–3 business days</li>
            <li><strong>Other Nigerian States</strong>: 3–7 business days</li>
          </ul>
          <p>
            You will receive an <strong>Order ID</strong> by email after placing your order.  
            This can be used to track your delivery status on our website.
          </p>
        </CardContent>
      </Card>

      {/* Return & Refund Policy */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Return & Refund Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You may request a return within <strong>2 days</strong> of receiving your order
            if the item is defective, damaged, or incorrect.
          </p>
          <p>
            Items must be unused, in their original packaging, and in the same condition
            that you received them.
          </p>
          <p>
            Refunds are processed once the returned item has been inspected and approved.
            Shipping fees are non-refundable.
          </p>
        </CardContent>
      </Card>

      {/* Payment Policy */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We accept secure online payments via <strong>Paystack</strong>.
          </p>
          <p>
            All transactions are encrypted, and your payment details are never stored on our servers.
          </p>
        </CardContent>
      </Card>

      {/* Terms of Service */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            By placing an order on Nkins, you agree to abide by these policies.
          </p>
          <p>
            We reserve the right to update or modify our policies at any time. Changes will
            be posted on this page and will take effect immediately.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
