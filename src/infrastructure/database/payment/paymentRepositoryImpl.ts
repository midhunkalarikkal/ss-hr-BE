import { Types } from "mongoose";
import { IPayment, PaymentModel } from "./paymentModel";
import { Payment } from "../../../domain/entities/payment";
import { ApiPaginationRequest, ApiResponse } from "../../dtos/common.dts";
import { AdminFetchAllPayments, CreatePayment, IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";

export class PaymentRepositoryImpl implements IPaymentRepository {
  private mapToEntity(paymentData: IPayment): Payment {
    return new Payment(
      paymentData._id,
      paymentData.customerId,
      paymentData.packageId,
      paymentData.customerName,
      paymentData.packageName,
      paymentData.totalAmount,
      paymentData.paidAmount,
      paymentData.balanceAmount,
      paymentData.paymentMethod,
      paymentData.paymentDate.toISOString(),
      paymentData.referenceId,
      paymentData.paymentProof,
      paymentData.adminNotes,
      paymentData.status,
      paymentData.createdAt.toISOString(),
      paymentData.updatedAt.toISOString()
    );
  }

  async createPayment(paymentData: CreatePayment): Promise<Payment> {
    try {
      // Calculate balance amount and status before creation
      const balanceAmount = paymentData.totalAmount - paymentData.paidAmount;
      let status = "pending";
      
      if (paymentData.paidAmount === 0) {
        status = "pending";
      } else if (paymentData.paidAmount >= paymentData.totalAmount) {
        status = "fullypaid";
      } else {
        status = "partiallypaid";
      }

      const createdPayment = await PaymentModel.create({
        ...paymentData,
        balanceAmount,
        status
      });
      return this.mapToEntity(createdPayment);
    } catch (error: any) {
      console.error("Detailed createPayment error:", error);
      throw new Error("Unable to create payment, please try again after a few minutes.");
    }
  }

  async findAllPayments({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>> {
    try {
      const skip = (page - 1) * limit;
      const [payments, totalCount] = await Promise.all([
        PaymentModel.find(
          {},
          {
            _id: 1,
            customerId: 1,
            packageId: 1,
            customerName: 1,
            packageName: 1,
            totalAmount: 1,
            paidAmount: 1,
            balanceAmount: 1,
            paymentMethod: 1,
            paymentDate: 1,
            referenceId: 1,
            paymentProof: 1,
            adminNotes: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          }
        )
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PaymentModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: payments.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch payments from database.");
    }
  }

  async findPaymentById(paymentId: Types.ObjectId): Promise<Payment | null> {
    try {
      const paymentData = await PaymentModel.findById(paymentId);
      return paymentData ? this.mapToEntity(paymentData) : null;
    } catch (error) {
      throw new Error("Payment not found.");
    }
  }

  async updatePayment(paymentData: Payment): Promise<Payment | null> {
    try {
      // Recalculate balance and status before update
      paymentData.updatePaymentStatus();
      
      const updatedPayment = await PaymentModel.findByIdAndUpdate(paymentData._id, paymentData, {
        new: true,
      });
      return updatedPayment ? this.mapToEntity(updatedPayment) : null;
    } catch (error) {
      throw new Error("Unable to update payment.");
    }
  }

  async deletePayment(paymentId: Types.ObjectId): Promise<boolean> {
    try {
      const result = await PaymentModel.findByIdAndDelete(paymentId);
      return !!result;
    } catch (error) {
      throw new Error("Failed to delete payment");
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      return await PaymentModel.countDocuments();
    } catch (error) {
      throw new Error("Failed to get total count");
    }
  }

  async findPaymentsByCustomerId(customerId: Types.ObjectId, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>> {
    try {
      const skip = (page - 1) * limit;
      const [payments, totalCount] = await Promise.all([
        PaymentModel.find(
          { customerId },
          {
            _id: 1,
            customerId: 1,
            packageId: 1,
            customerName: 1,
            packageName: 1,
            totalAmount: 1,
            paidAmount: 1,
            balanceAmount: 1,
            paymentMethod: 1,
            paymentDate: 1,
            referenceId: 1,
            paymentProof: 1,
            adminNotes: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          }
        )
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PaymentModel.countDocuments({ customerId }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: payments.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch payments by customer from database.");
    }
  }

  async findPaymentsByPackageId(packageId: Types.ObjectId, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>> {
    try {
      const skip = (page - 1) * limit;
      const [payments, totalCount] = await Promise.all([
        PaymentModel.find(
          { packageId },
          {
            _id: 1,
            customerId: 1,
            packageId: 1,
            customerName: 1,
            packageName: 1,
            totalAmount: 1,
            paidAmount: 1,
            balanceAmount: 1,
            paymentMethod: 1,
            paymentDate: 1,
            referenceId: 1,
            paymentProof: 1,
            adminNotes: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          }
        )
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PaymentModel.countDocuments({ packageId }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: payments.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch payments by package from database.");
    }
  }

  async findPaymentsByStatus(status: string, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>> {
    try {
      const skip = (page - 1) * limit;
      const [payments, totalCount] = await Promise.all([
        PaymentModel.find(
          { status },
          {
            _id: 1,
            customerId: 1,
            packageId: 1,
            customerName: 1,
            packageName: 1,
            totalAmount: 1,
            paidAmount: 1,
            balanceAmount: 1,
            paymentMethod: 1,
            paymentDate: 1,
            referenceId: 1,
            paymentProof: 1,
            adminNotes: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          }
        )
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PaymentModel.countDocuments({ status }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: payments.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch payments by status from database.");
    }
  }
}