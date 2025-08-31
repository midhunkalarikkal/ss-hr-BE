import { Types } from "mongoose";

export class WebsiteFooter {
    constructor(
        public _id: Types.ObjectId,
        public address: string,
        public googleMapLocationUAE: string,
        public phoneIN: string,
        public phoneUAE: string,
        public facebookURL: string,
        public instagramURL: string,
        public linkedinURL: string,
        public xURL: string,
        public threadsURL: string,
        public comapnyEmail: string,
        public indianOfficeTiming: string,
        public uaeOfficeTiming: string,
    ) {

    }
}