import { IJob, JobModel } from "./jobModel";
import { Job } from "../../../domain/entities/job";
import { UserFetchAllJobs, UserFetchJobDetailsResponse } from "../../dtos/userJob.dtos";
import { ApiPaginationRequest, ApiResponse } from "../../dtos/common.dts";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { AdminCreateNewJob, AdminFetchAllJobs, AdminFetchJobDetailsResponse } from "../../dtos/adminJob.dtos";
import { Types } from "mongoose";

export class JobRepositoryImpl implements IJobRepository {

  private mapToEntity(job: IJob): Job {
    return new Job(
      job._id,
      job.companyName,
      job.industry,
      job.designation,
      job.vacancy,
      job.salary,
      job.benifits,
      job.skills,
      job.jobDescription,
      job.nationality,
      job.createdAt,
      job.updatedAt,
    );
  }

  async createJob(payload: AdminCreateNewJob): Promise<Job | null> {
    try {
      const newJob = await JobModel.create(payload);
      return newJob ? this.mapToEntity(newJob) : null;
    } catch (error) {
      throw new Error("Unable to create job, please try again.");
    }
  }

  async findAllJobs({ page, limit }: ApiPaginationRequest, admin: boolean): Promise<ApiResponse<AdminFetchAllJobs | UserFetchAllJobs>> {
    try {
      const adminGetAllJobsProject = {
        _id: 1, companyName: 1,
        industry: 1,
        vacancy: 1,
        designation: 1,
        salary: 1,
        createdAt: 1
      };

      const userGetAllJobsProject = {
        _id: 1,
        industry: 1,
        vacancy: 1,
        designation: 1,
        salary: 1,
        createdAt: 1
      };

      const project = admin ? adminGetAllJobsProject : userGetAllJobsProject;
      const skip = (page - 1) * limit;
      const [jobs, totalCount] = await Promise.all([
        JobModel.find({}, project).skip(skip).limit(limit).lean(),
        JobModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: jobs.map(job => ({
          _id: job._id,
          companyName: job.companyName || null,
          industry: job.industry,
          designation: job.designation,
          salary: job.salary,
          vacancy: job.vacancy,
          createdAt: job.createdAt,
        })),
        totalPages,
        currentPage: page,
        totalCount
      };
    } catch (error) {
      throw new Error("Failed to fetch jobs from database.");
    }
  }


  async findJobById(jobId: Types.ObjectId, admin: boolean): Promise<AdminFetchJobDetailsResponse | UserFetchJobDetailsResponse | null> {
    try {
      const adminGetAllJobsProject = {
        _id: 1,
        companyName: 1,
        industry: 1,
        designation: 1,
        vacancy: 1,
        salary: 1,
        benifits: 1,
        skills: 1,
        jobDescription: 1,
        nationality: 1,
        createdAt: 1
      };

      const userGetAllJobsProject = {
        _id: 1,
        industry: 1,
        designation: 1,
        vacancy: 1,
        salary: 1,
        benifits: 1,
        skills: 1,
        jobDescription: 1,
        nationality: 1,
        createdAt: 1
      };
      const project = admin ? adminGetAllJobsProject : userGetAllJobsProject;
      const job = await JobModel.findById(jobId, project);
      return job ? this.mapToEntity(job) : null;
    } catch (error) {
      throw new Error("Job not found.");
    }
  }


  async updateJob(jobId: Types.ObjectId, updatedData: AdminCreateNewJob): Promise<Job | null> {
    try {
      const updatedJob = await JobModel.findByIdAndUpdate({ _id: jobId }, updatedData, { new: true });
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

  // async getTotalCount(): Promise<number> {
  //   try {
  //     return await JobModel.countDocuments({});
  //   } catch (error) {
  //     throw new Error("Failed to get total job count.");
  //   }
  // }

  // async findJobsByCompanyName(companyName: string): Promise<Job[]> {
  //   try {
  //     const jobs = await JobModel.find({ companyName });
  //     return jobs.map(job => this.mapToEntity(job));
  //   } catch (error) {
  //     throw new Error("Unable to find jobs by company name.");
  //   }
  // }
}