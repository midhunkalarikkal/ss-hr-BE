import mongoose, { Document, Schema, Types } from "mongoose";
import { PaymentMethod, PaymentStatus } from "../../../domain/entities/payment";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  packageId: Types.ObjectId;
  customerName: string;
  packageName: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  referenceId: string;
  paymentProof: string;
  adminNotes: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  customerId: {
    type: Schema.Types.ObjectId,
    required: [true, "Customer ID is required"],
    ref: 'Customer'
  },
  packageId: {
    type: Schema.Types.ObjectId,
    required: [true, "Package ID is required"],
    ref: 'Package'
  },
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    minLength: [2, "Customer name must be at least 2 characters"],
    maxlength: [100, "Customer name must be at most 100 characters"],
    trim: true,
  },
  packageName: {
    type: String,
    required: [true, "Package name is required"],
    minLength: [2, "Package name must be at least 2 characters"],
    maxlength: [100, "Package name must be at most 100 characters"],
    trim: true,
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0, "Total amount cannot be negative"],
  },
  paidAmount: {
    type: Number,
    required: [true, "Paid amount is required"],
    min: [0, "Paid amount cannot be negative"],
    default: 0,
  },
  balanceAmount: {
    type: Number,
    required: [true, "Balance amount is required"],
    min: [0, "Balance amount cannot be negative"],
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: [true, "Payment method is required"],
  },
  paymentDate: {
    type: Date,
    required: [true, "Payment date is required"],
  },
  referenceId: {
    type: String,
    required: [true, "Reference ID is required"],
    minLength: [3, "Reference ID must be at least 3 characters"],
    maxlength: [50, "Reference ID must be at most 50 characters"],
    trim: true,
  },
  paymentProof: {
    type: String,
    required: [true, "Payment proof is required"],
    trim: true,
  },
  adminNotes: {
    type: String,
    maxlength: [500, "Admin notes must be at most 500 characters"],
    trim: true,
    default: "",
  },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    required: [true, "Payment status is required"],
    default: PaymentStatus.pending,
  },
}, {
  timestamps: true
});

// Index for better query performance
PaymentSchema.index({ customerId: 1 });
PaymentSchema.index({ packageId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentDate: -1 });

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);