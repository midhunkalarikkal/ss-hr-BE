import { Types } from "mongoose";
import { Payment } from "../../domain/entities/payment";
import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { PaymentRepositoryImpl } from "../../infrastructure/database/payment/paymentRepositoryImpl";
import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  UpdatePaymentRequest,
  UpdatePaymentResponse,
  DeletePaymentRequest,
  GetPaymentByIdRequest,
  GetPaymentByIdResponse,
  GetPaymentsByCustomerRequest,
  GetPaymentsByPackageRequest,
  GetPaymentsByStatusRequest,
} from "../../infrastructure/dtos/payment.dto";

export class CreatePaymentUseCase {
  constructor(private paymentRepository: PaymentRepositoryImpl) {}

  async execute(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      const { 
        customerId,
        packageId,
        customerName, 
        packageName, 
        totalAmount, 
        paidAmount, 
        paymentMethod, 
        paymentDate, 
        referenceId, 
        paymentProof,
        adminNotes
      } = data;

      const createdPayment = await this.paymentRepository.createPayment({
        customerId,
        packageId,
        customerName,
        packageName,
        totalAmount,
        paidAmount: paidAmount || 0,
        paymentMethod,
        paymentDate,
        referenceId,
        paymentProof,
        adminNotes: adminNotes || "",
      });

      return {
        success: true,
        message: "Payment created successfully",
        payment: {
          _id: createdPayment._id,
          customerId: createdPayment.customerId,
          packageId: createdPayment.packageId,
          customerName: createdPayment.customerName,
          packageName: createdPayment.packageName,
          totalAmount: createdPayment.totalAmount,
          paidAmount: createdPayment.paidAmount,
          balanceAmount: createdPayment.balanceAmount,
          paymentMethod: createdPayment.paymentMethod,
          paymentDate: createdPayment.paymentDate,
          referenceId: createdPayment.referenceId,
          paymentProof: createdPayment.paymentProof,
          adminNotes: createdPayment.adminNotes,
          status: createdPayment.status,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to create payment");
    }
  }
}

export class UpdatePaymentUseCase {
  constructor(private paymentRepository: PaymentRepositoryImpl) {}

  async execute(data: UpdatePaymentRequest): Promise<UpdatePaymentResponse> {
    try {
      const { _id, ...updateData } = data;

      const existingPayment = await this.paymentRepository.findPaymentById(_id);
      if (!existingPayment) throw new Error("Payment not found");

      const updatedPayment = new Payment(
        existingPayment._id,
        updateData.customerId ?? existingPayment.customerId,
        updateData.packageId ?? existingPayment.packageId,
        updateData.customerName ?? existingPayment.customerName,
        updateData.packageName ?? existingPayment.packageName,
        updateData.totalAmount ?? existingPayment.totalAmount,
        updateData.paidAmount ?? existingPayment.paidAmount,
        existingPayment.balanceAmount, // Will be recalculated
        updateData.paymentMethod ?? existingPayment.paymentMethod,
        updateData.paymentDate ?? existingPayment.paymentDate,
        updateData.referenceId ?? existingPayment.referenceId,
        updateData.paymentProof ?? existingPayment.paymentProof,
        updateData.adminNotes ?? existingPayment.adminNotes,
        existingPayment.status, // Will be recalculated
        existingPayment.createdAt,
        existingPayment.updatedAt
      );

      const result = await this.paymentRepository.updatePayment(updatedPayment);
      if (!result) throw new Error("Failed to update payment");

      return {
        success: true,
        message: "Payment updated successfully",
        payment: {
          _id: result._id,
          customerId: result.customerId,
          packageId: result.packageId,
          customerName: result.customerName,
          packageName: result.packageName,
          totalAmount: result.totalAmount,
          paidAmount: result.paidAmount,
          balanceAmount: result.balanceAmount,
          paymentMethod: result.paymentMethod,
          paymentDate: result.paymentDate,
          referenceId: result.referenceId,
          paymentProof: result.paymentProof,
          adminNotes: result.adminNotes,
          status: result.status,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to update payment");
    }
  }
}

export class DeletePaymentUseCase {
  constructor(private paymentRepository: PaymentRepositoryImpl) {}

  async execute(data: DeletePaymentRequest): Promise<ApiResponse> {
    try {
      const { paymentId } = data;

      const existingPayment = await this.paymentRepository.findPaymentById(paymentId);
      if (!existingPayment) throw new Error("Payment not found");

      const deleted = await this.paymentRepository.deletePayment(paymentId);
      if (!deleted) throw new Error("Failed to delete payment");

      return { success: true, message: "Payment deleted successfully" };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to delete payment");
    }
  }
}

export class GetPaymentByIdUseCase {
  constructor(private paymentRepository: PaymentRepositoryImpl) {}

  async execute(data: GetPaymentByIdRequest): Promise<GetPaymentByIdResponse> {
    try {
      const { paymentId } = data;

      const paymentData = await this.paymentRepository.findPaymentById(paymentId);
      if (!paymentData) throw new Error("Payment not found");

      return {
        success: true,
        message: "Payment retrieved successfully",
        payment: {
          _id: paymentData._id,
          customerId: paymentData.customerId,
          packageId: paymentData.packageId,
          customerName: paymentData.customerName,
          packageName: paymentData.packageName,
          totalAmount: paymentData.totalAmount,
          paidAmount: paymentData.paidAmount,
          balanceAmount: paymentData.balanceAmount,
          paymentMethod: paymentData.paymentMethod,
          paymentDate: paymentData.paymentDate,
          referenceId: paymentData.referenceId,
          paymentProof: paymentData.paymentProof,
          adminNotes: paymentData.adminNotes,
          status: paymentData.status,
          createdAt: new Date(paymentData.createdAt),
          updatedAt: new Date(paymentData.updatedAt),
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get payment");
    }
  }
}

export class GetAllPaymentsUseCase {
  constructor(private paymentRepository: PaymentRepositoryImpl) {}

  async execute(data: { page: number; limit: number }) {
    try {
      const result = await this.paymentRepository.findAllPayments(data);
      return {
        success: true,
        message: "Payments retrieved successfully",
        ...result,
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get payments");
    }
  }
}

export class GetPaymentsByCustomerUseCase {
  constructor(private paymentRepository: PaymentRepositoryImpl) {}

  async execute(data: GetPaymentsByCustomerRequest) {
    try {
      const { customerId, page, limit } = data;
      const result = await this.paymentRepository.findPaymentsByCustomerId(customerId, { page, limit });
      return {
        success: true,
        message: "Customer payments retrieved successfully",
        ...result,
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get payments by customer");
    }
  }
}

export class GetPaymentsByPackageUseCase {
  constructor(private paymentRepository: PaymentRepositoryImpl) {}

  async execute(data: GetPaymentsByPackageRequest) {
    try {
      const { packageId, page, limit } = data;
      const result = await this.paymentRepository.findPaymentsByPackageId(packageId, { page, limit });
      return {
        success: true,
        message: "Package payments retrieved successfully",
        ...result,
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get payments by package");
    }
  }
}

export class GetPaymentsByStatusUseCase {
  constructor(private paymentRepository: PaymentRepositoryImpl) {}

  async execute(data: GetPaymentsByStatusRequest) {
    try {
      const { status, page, limit } = data;
      const result = await this.paymentRepository.findPaymentsByStatus(status, { page, limit });
      return {
        success: true,
        message: `${status} payments retrieved successfully`,
        ...result,
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get payments by status");
    }
  }
}

export class GetPaymentStatsUseCase {
  constructor(private paymentRepository: PaymentRepositoryImpl) {}

  async execute() {
    try {
      const totalPayments = await this.paymentRepository.getTotalCount();
      return {
        success: true,
        message: "Payment stats retrieved successfully",
        stats: { totalPayments },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get payment stats");
    }
  }
}