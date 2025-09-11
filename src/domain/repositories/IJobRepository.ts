
import { Types } from "mongoose";
import { Job } from "../entities/job";
import { UserFetchAllJobs, UserFetchJobDetailsResponse } from "../../infrastructure/dtos/userJob.dtos";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";
import { AdminCreateNewJob, AdminFetchAllJobs, AdminFetchJobDetailsResponse } from "../../infrastructure/dtos/adminJob.dtos";

export interface IJobRepository {
  createJob(payload: AdminCreateNewJob): Promise<Job | null>;

  findAllJobs({page,limit}: ApiPaginationRequest, admin: boolean): Promise<ApiResponse<AdminFetchAllJobs | UserFetchAllJobs>>;
  
  findJobById(jobId: Types.ObjectId, admin: boolean): Promise<AdminFetchJobDetailsResponse | UserFetchJobDetailsResponse | null>;
  
  updateJob(jobId: Types.ObjectId, updatedData: AdminCreateNewJob): Promise<Job | null>;
  
  deleteJob(jobId: Types.ObjectId): Promise<boolean>;

  // getTotalCount(): Promise<number>;
  
  // findJobsByCompanyName(companyName: string): Promise<Job[]>;
}