// src/infrastructure/dtos/job.dto.ts
import { Types } from "mongoose";
import { Job } from "../../domain/entities/job";

// Request DTOs
export interface CreateJobRequest {
  companyName: string;
  designation: string;
  vacancy: number;
}

export interface UpdateJobRequest {
  _id: Types.ObjectId;
  companyName?: string;
  designation?: string;
  vacancy?: number;
}

export interface GetJobByIdRequest {
  jobId: Types.ObjectId;
}

export interface DeleteJobRequest {
  jobId: Types.ObjectId;
}

// Response DTOs
export interface CreateJobResponse {
  success: boolean;
  message: string;
  job: {
    _id: Types.ObjectId;
    companyName: string;
    designation: string;
    vacancy: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateJobResponse {
  success: boolean;
  message: string;
  job: Job;
}

export interface GetJobResponse {
  success: boolean;
  message: string;
  job: Job;
}

export interface DeleteJobResponse {
  success: boolean;
  message: string;
}

export type AdminFetchAllJobs = Array<
  Pick<Job, "_id" | "companyName" | "designation" | "vacancy" | "createdAt" | "updatedAt">
>;