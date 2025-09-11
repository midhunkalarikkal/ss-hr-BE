import { Job } from "../../domain/entities/job";

export type UserFetchAllJobs = Array<Pick<Job, "_id" | "salary" | "designation" | "vacancy" | "createdAt">>;

export type UserFetchJobDetailsResponse = Omit<Job, "updatedAt" | "companyName">;