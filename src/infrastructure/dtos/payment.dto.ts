import { Types } from "mongoose";
import { ApiResponse } from "./common.dts";
import { PaymentMethod, PaymentStatus } from "../../domain/entities/payment";

// Create Payment DTOs
export interface CreatePaymentRequest {
  customerId: Types.ObjectId;
  packageId: Types.ObjectId;
  customerName: string;
  packageName: string;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  referenceId: string;
  paymentProof: string;
  adminNotes: string;
}

export interface CreatePaymentResponse extends ApiResponse {
  payment?: {
    _id: Types.ObjectId;
    customerId: Types.ObjectId;
    packageId: Types.ObjectId;
    customerName: string;
    packageName: string;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    paymentMethod: PaymentMethod;
    paymentDate: string;
    referenceId: string;
    paymentProof: string;
    adminNotes: string;
    status: PaymentStatus;
  };
}

// Update Payment DTOs
export interface UpdatePaymentRequest {
  _id: Types.ObjectId;
  customerId?: Types.ObjectId;
  packageId?: Types.ObjectId;
  customerName?: string;
  packageName?: string;
  totalAmount?: number;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  referenceId?: string;
  paymentProof?: string;
  adminNotes?: string;
}

export interface UpdatePaymentResponse extends ApiResponse {
  payment?: {
    _id: Types.ObjectId;
    customerId: Types.ObjectId;
    packageId: Types.ObjectId;
    customerName: string;
    packageName: string;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    paymentMethod: PaymentMethod;
    paymentDate: string;
    referenceId: string;
    paymentProof: string;
    adminNotes: string;
    status: PaymentStatus;
  };
}

// Get Payment DTOs
export interface GetPaymentByIdRequest {
  paymentId: Types.ObjectId;
}

export interface GetPaymentByIdResponse extends ApiResponse {
  payment?: {
    _id: Types.ObjectId;
    customerId: Types.ObjectId;
    packageId: Types.ObjectId;
    customerName: string;
    packageName: string;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    paymentMethod: PaymentMethod;
    paymentDate: string;
    referenceId: string;
    paymentProof: string;
    adminNotes: string;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Delete Payment DTOs
export interface DeletePaymentRequest {
  paymentId: Types.ObjectId;
}

// Get Payments by Customer DTOs
export interface GetPaymentsByCustomerRequest {
  customerId: Types.ObjectId;
  page: number;
  limit: number;
}

// Get Payments by Package DTOs
export interface GetPaymentsByPackageRequest {
  packageId: Types.ObjectId;
  page: number;
  limit: number;
}

// Get Payments by Status DTOs
export interface GetPaymentsByStatusRequest {
  status: string;
  page: number;
  limit: number;
}