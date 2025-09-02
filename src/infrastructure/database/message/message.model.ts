import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
    _id: Types.ObjectId,
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    text: string,
    image: string,
    createdAt: Date,
    updatedAt: Date,
};

const messageSchema = new Schema<IMessage>({
    senderId: { 
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender Id is required"]
    },
    receiverId: { 
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Receiver Id is required"]
    },
    text: { 
        type: String,
        minlength: [1, "Text need atleast 1 character"],
        maxlength: [500, "Text maximum allowed length is 500"],
        match: [/^[\p{L}\p{N}\p{P}\p{Zs}]+$/u, "Invalid characters in message"] 
    },
    image: {
        type: String
    }
},{
    timestamps: true
});

export const MessageModel = mongoose.model<IMessage>('Message',messageSchema)