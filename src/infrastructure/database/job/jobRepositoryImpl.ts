// src/infrastructure/database/job/jobRepositoryImpl.ts

import { Types } from "mongoose";
import { IJob, JobModel } from "./jobModel";
import { Job } from "../../../domain/entities/job";
import { ApiPaginationRequest, ApiResponse } from "../../dtos/common.dts";
import { AdminFetchAllJobs, CreateJobProps, IJobRepository, GetAllJobsParams } from "../../../domain/repositories/IJobRepository";

export class JobRepositoryImpl implements IJobRepository {

  private mapToEntity(job: IJob): Job {
    return new Job(
      job._id,
      job.companyName,
      job.designation,
      job.vacancy,
      job.createdAt.toISOString(),
      job.updatedAt.toISOString(),
    );
  }

  async createJob(job: CreateJobProps): Promise<Job> {
    try {
      const createdJob = await JobModel.create(job);
      return this.mapToEntity(createdJob);
    } catch (error) {
      throw new Error("Unable to create job, please try again.");
    }
  }

  async findJobById(jobId: Types.ObjectId): Promise<Job | null> {
    try {
      const job = await JobModel.findById(jobId);
      return job ? this.mapToEntity(job) : null;
    } catch (error) {
      throw new Error("Job not found.");
    }
  }

  async findAllJobs({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllJobs>> {
    try {
      const skip = (page - 1) * limit;
      const [jobs, totalCount] = await Promise.all([
        JobModel.find({}, {
          _id: 1,
          companyName: 1,
          designation: 1,
          vacancy: 1,
          createdAt: 1,
          updatedAt: 1
        }).skip(skip).limit(limit).lean(),
        JobModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: jobs.map(job => ({
          _id: job._id,
          companyName: job.companyName,
          designation: job.designation,
          vacancy: job.vacancy,
          createdAt: job.createdAt.toISOString(),
          updatedAt: job.updatedAt.toISOString(),
        })),
        totalPages,
        currentPage: page,
        totalCount
      };
    } catch (error) {
      throw new Error("Failed to fetch jobs from database.");
    }
  }

  async getAllJobs(params: GetAllJobsParams): Promise<Job[]> {
    try {
      const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
      const sortObj: { [key: string]: 1 | -1 } = { [params.sortBy]: sortOrder };

      const jobs = await JobModel.find({})
        .sort(sortObj)
        .skip(params.skip)
        .limit(params.limit);

      return jobs.map(job => this.mapToEntity(job));
    } catch (error) {
      throw new Error("Failed to fetch jobs from database.");
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      return await JobModel.countDocuments({});
    } catch (error) {
      throw new Error("Failed to get total job count.");
    }
  }

  async updateJob(job: Job): Promise<Job | null> {
    try {
      const updatedJob = await JobModel.findByIdAndUpdate(job._id, {
        companyName: job.companyName,
        designation: job.designation,
        vacancy: job.vacancy,
      }, { new: true });
      return updatedJob ? this.mapToEntity(updatedJob) : null;
    } catch (error) {
      throw new Error("Unable to update job.");
    }
  }

  async deleteJob(jobId: Types.ObjectId): Promise<boolean> {
    try {
      const result = await JobModel.findByIdAndDelete(jobId);
      return !!result;
    } catch (error) {
      throw new Error("Unable to delete job.");
    }
  }

  async findJobsByCompanyName(companyName: string): Promise<Job[]> {
    try {
      const jobs = await JobModel.find({ companyName });
      return jobs.map(job => this.mapToEntity(job));
    } catch (error) {
      throw new Error("Unable to find jobs by company name.");
    }
  }
}