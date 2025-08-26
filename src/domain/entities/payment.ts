import { Types } from "mongoose";

export enum PaymentFor {
    jobRecruitment = "jobrecruitment",
    tourPackage = "tourpackage"
}

export class Payment {
    constructor(
        public _id: Types.ObjectId,
        public transactionId: string,
        public userId: string,
        public amountPayable: number,
        public amountPaid: number,
        public amountBalance: number,
        public paymentFor: PaymentFor,
        public paymentStatus: "Pending" | "Completed" | "Failed" | "Pending",
        public screenshot: string,
        public upiId: string,
        public remarks: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}