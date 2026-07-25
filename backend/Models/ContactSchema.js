import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    orderNumber: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      enum: [
        "General Inquiry",
        "Order Status & Tracking",
        "Returns & Refunds",
        "Product Information",
        "Payment Issues",
        "Other",
      ],
      default: "General Inquiry",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Resolved"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
