import { Types } from "mongoose";

export class Review {
    constructor(
        public _id: Types.ObjectId,
        public userId: string,
        public username: string,
        public job: string,
        public text: string,
        public createdAt: string,
        public updatedAt: string,
    ) { }
}