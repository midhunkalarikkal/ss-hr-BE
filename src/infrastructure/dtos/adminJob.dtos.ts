import { Job } from "../../domain/entities/job";

export type AdminCreateNewJob = Pick<Job, "companyName" | "designation" | "industry" | "jobDescription" | "benifits" | "salary" | "skills" | "nationality" | "vacancy">;

export type AdminFetchAllJobs = Array<Pick<Job, "_id" | "companyName" | "salary" | "designation" | "vacancy" | "createdAt">>;

export type AdminFetchJobDetailsResponse = Omit<Job, "updatedAt">;

export interface AdminUpdateJob {
    jobId: Job["_id"];
    updatedData: AdminCreateNewJob;
}