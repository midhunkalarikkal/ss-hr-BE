import z from "zod";
import { objectIdField, stringField } from "./common.zod";

export const commonParamsZodSchema = z.object({
    toUserId: objectIdField("selected user id")
});

export const sendMessageRequestZodSchema = z.object({
    text: stringField("Message text",1,500,/^[^\s]+(?:[\s\S]*[^\s]+)?$/,"Invalid message. It should not be empty or only spaces and must be between 1 and 500 characters."),
})