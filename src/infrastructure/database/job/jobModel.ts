import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IJob extends Document {
  _id: Types.ObjectId;
  companyName: string;
  designation: string;
  vacancy: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    minlength: [2, "Company name must be at least 2 characters"],
    maxlength: [100, "Company name must be at most 100 characters"],
    trim: true,
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    minlength: [2, "Designation must be at least 2 characters"],
    maxlength: [100, "Designation must be at most 100 characters"],
    trim: true,
  },
  vacancy: {
    type: Number,
    required: [true, "Vacancy count is required"],
    min: [1, "Vacancy must be at least 1"],
    max: [1000, "Vacancy cannot exceed 1000"],
  },
}, {
  timestamps: true
});

export const JobModel = mongoose.model<IJob>('Job', JobSchema);