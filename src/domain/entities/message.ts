import { Types } from "mongoose";

export class Message {
    constructor(
        public _id: Types.ObjectId,
        public senderId: Types.ObjectId,
        public receiverId: Types.ObjectId,
        public text: string,
        public image: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) {

    }
}




