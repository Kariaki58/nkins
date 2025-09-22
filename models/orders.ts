import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  formData: {
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    country: { type: String, default: "Nigeria" },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true },
  },

  items: [
    {
      productId: String,
      name: String,
      imageUrl: String,
      price: Number,
      category: String,
      quantity: Number,
      variant: {
        size: String,
        color: String,
      },
    },
  ],

  total: { type: Number, required: true },
  shipping: Number,
  tax: Number,
  transactionId: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  cancellationReason: String,
}, {
  timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
