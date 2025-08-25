import { Types } from "mongoose";


export class Job {
    constructor(
        public _id: Types.ObjectId,
        public companyName: string,
        public designation: string,
        public vacancy: number,
        public createdAt: string,
        public updatedAt: string,
    ) {

    }
}




