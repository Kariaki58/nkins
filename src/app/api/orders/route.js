import { connectToDatabase } from "../../../lib/mongoose";
import { getServerSession } from "next-auth";
import { options } from "../auth/options";
import User from "../../../../models/user";
import Order from "../../../../models/orders";
import { logActivity } from "@/lib/activityLogger";
import { Activities } from "@/lib/activityLogger";
import { sendEmail } from "@/lib/sendEmail";
import { generateSimpleSellerOrderNotificationTemplate } from "@/lib/email-template/content";

export async function GET(request) {
  try {
    const session = await getServerSession(options);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    if (session.user.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ _id: session.user.id });
    if (!user || user.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 8;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();

    let orders = [];
    if (query) {
      orders = await Order.find({ _id: query });
    } else {
      orders = await Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    }

    const transformedOrders = orders.map((order) => ({
      id: order._id.toString(),
      customer: `${order.formData.firstName} ${order.formData.lastName}`,
      customerDetails: {
        email: order.formData.email,
        phone: order.formData.phone,
        address: `${order.formData.address}, ${order.formData.city}, ${order.formData.state} ${order.formData.zip}, ${order.formData.country}`,
      },
      date: new Date(order.createdAt).toISOString().split("T")[0],
      items: order.items.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        image: item.image,
        variant: item.variant,
      })),
      subtotal: order.items
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2),
      shipping: order.shipping?.toFixed(2) || "0.00",
      tax: order.tax?.toFixed(2) || "0.00",
      total: order.total.toFixed(2),
      status: order.status,
      paymentMethod: "Credit Card",
      transactionId: order.transactionId,
      cancellationReason: order.cancellationReason || null,
    }));

    return new Response(
      JSON.stringify({
        orders: transformedOrders,
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customer,
      items,
      total,
      shipping,
      tax,
      transactionId,
    } = body;

    const formData = customer;

    // Validate
    if (!formData || !items || !total || !transactionId) {
      return new Response(
        JSON.stringify({ message: "Missing required fields." }),
        { status: 400 }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ message: "Items must be a non-empty array." }),
        { status: 400 }
      );
    }
    console.log({ items })
    // Normalize items before saving
    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image || null,
      price: item.price,
      category: item.category,
      quantity: item.quantity,
      variant: {
        size: item.variant?.size || null,
        color: item.variant?.color || null,
      },
    }));

    await connectToDatabase();

    const order = new Order({
      items: normalizedItems,
      total,
      shipping,
      tax,
      formData,
      transactionId,
    });

    await order.save();

    const session = await getServerSession(options);
    await logActivity(Activities.orderCreated(order, session?.user));

    const emailNotification = generateSimpleSellerOrderNotificationTemplate();
    await sendEmail(
      process.env.EMAIL_ADDRESS,
      "🎉 New Order Received",
      emailNotification
    );

    return new Response(
      JSON.stringify({
        message: "Order processed successfully.",
        orderId: order._id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error." }),
      { status: 500 }
    );
  }
}
