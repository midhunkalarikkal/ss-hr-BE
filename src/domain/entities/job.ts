import { Types } from "mongoose";

export class Job {
    constructor(
        public _id: Types.ObjectId,
        public companyName: string,
        public industry: string,
        public designation: string,
        public vacancy: number,
        public salary: number,
        public benifits: string,
        public skills: string,
        public jobDescription: string,
        public nationality: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}




