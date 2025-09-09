import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITestimonial extends Document {
  _id: Types.ObjectId;
  clientName: string;
  clientPhoto: string;
  designation: string;
  testimonial: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  clientName: {
    type: String,
    required: [true, "Client name is required"],
    minLength: [2, "Client name must be atleast 2 characters"],
    maxlength: [100, "Client name must be atmost 30 characters"],
    trim: true,
  },
  clientPhoto: {
    type: String,
    default: "",
    trim: true,
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    minLength: [2, "Designation must be atleast 2 characters"],
    maxlength: [50, "Designation must be atmost 50 characters"],
    trim: true,
  },
  testimonial : {
    type  : String,
    minlength : [2,"Testimonial must be atleast 2 characters"],
    maxLength : [1000,"Testimonial must be atmost 1000 characters"]
  },
  isVisible  : {
    type : Boolean,
    default : true,
  },
  },{
    timestamps : true
  });

  export const TestimonialModel = mongoose.model<ITestimonial>("Testimonial",TestimonialSchema);
