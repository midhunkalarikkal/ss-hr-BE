import { Types } from "mongoose";
import { Job } from "../entities/job";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";

export type CreateJobProps = {
  companyName: string;
  designation: string;
  vacancy: number;
};

export type AdminFetchAllJobs = Array<Pick<Job, "_id" | "companyName" | "designation" | "vacancy" | "createdAt" | "updatedAt">>;

export interface IJobRepository {
  createJob(job: CreateJobProps): Promise<Job>;
  
  findJobById(jobId: Types.ObjectId): Promise<Job | null>;
  
  findAllJobs({page,limit}: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllJobs>>;
  
  updateJob(job: Job): Promise<Job | null>;
  
  deleteJob(jobId: Types.ObjectId): Promise<boolean>;
  
  findJobsByCompanyName(companyName: string): Promise<Job[]>;
}