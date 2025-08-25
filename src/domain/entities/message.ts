import { Types } from "mongoose";

export class Message {
    constructor(
        public _id: Types.ObjectId,
        public senderId: string,
        public receiverId: string,
        public text: string,
        public image: string,
        public createdAt: string,
        public updatedAt: string,
    ) {

    }
}




