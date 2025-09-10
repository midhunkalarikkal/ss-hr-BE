import { Types } from "mongoose";

export enum PaymentMethod {
    googlePay = "googlepay",
    bankTransfer = "banktransfer", 
    cash = "cash"
}

export enum PaymentStatus {
    pending = "pending",
    partiallyPaid = "partiallypaid",
    fullyPaid = "fullypaid"
}

export class Payment {
    constructor(
        public _id: Types.ObjectId,
        public customerId: Types.ObjectId,
        public packageId: Types.ObjectId,
        public customerName: string,
        public packageName: string,
        public totalAmount: number,
        public paidAmount: number,
        public balanceAmount: number,
        public paymentMethod: PaymentMethod,
        public paymentDate: string,
        public referenceId: string,
        public paymentProof: string,
        public adminNotes: string,
        public status: PaymentStatus,
        public createdAt: string,
        public updatedAt: string,
    ) { }

    // Business logic method to calculate and update status
    public updatePaymentStatus(): void {
        this.balanceAmount = this.totalAmount - this.paidAmount;
        
        if (this.paidAmount === 0) {
            this.status = PaymentStatus.pending;
        } else if (this.paidAmount >= this.totalAmount) {
            this.status = PaymentStatus.fullyPaid;
            this.balanceAmount = 0;
        } else {
            this.status = PaymentStatus.partiallyPaid;
        }
    }
}