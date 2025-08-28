import { Types } from "mongoose";

export class Application {
    constructor(
        public _id: Types.ObjectId,
        public userId: string,
        public jobId: string,
        public resume: string, // file in aws_s3
        public applicationStatus: boolean,
        public createdAt: string,
        public updatedAt: string,
    ) { }
}




