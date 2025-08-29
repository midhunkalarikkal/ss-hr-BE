import { Types } from "mongoose";
import { Job } from "../../domain/entities/job";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { JobRepositoryImpl } from "../../infrastructure/database/job/jobRepositoryImpl";
import { CreateJobRequest, CreateJobResponse, UpdateJobRequest, UpdateJobResponse,GetJobByIdRequest,GetJobResponse,DeleteJobRequest,DeleteJobResponse } from "../../infrastructure/dtos/job.dto";

export class CreateJobUseCase {
  constructor(private jobRepository: JobRepositoryImpl) {}

  async execute(data: CreateJobRequest): Promise<CreateJobResponse> {
    try {
      const { companyName, designation, vacancy } = data;

      if (!companyName || !designation || vacancy < 1) {
        throw new Error("All fields are required and vacancy must be at least 1");
      }

      const job = await this.jobRepository.createJob({
        companyName,
        designation,
        vacancy
      });

      return {
        success: true,
        message: "Job created successfully",
        job: {
          _id: job._id,
          companyName: job.companyName,
          designation: job.designation,
          vacancy: job.vacancy,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        }
      };
    } catch (error) {
      throw handleUseCaseError(error || "Unexpected error in CreateJobUseCase");
    }
  }
}

export class UpdateJobUseCase {
  constructor(private jobRepository: JobRepositoryImpl) {}

  async execute(data: UpdateJobRequest): Promise<UpdateJobResponse> {
    try {
      const { _id, companyName, designation, vacancy } = data;

      if (!_id) {
        throw new Error("Job ID is required");
      }

      const existingJob = await this.jobRepository.findJobById(_id);
      if (!existingJob) {
        throw new Error("Job not found");
      }

      if (companyName !== undefined) existingJob.companyName = companyName;
      if (designation !== undefined) existingJob.designation = designation;
      if (vacancy !== undefined) {
        if (vacancy < 1) throw new Error("Vacancy must be at least 1");
        existingJob.vacancy = vacancy;
      }

      const updatedJob = await this.jobRepository.updateJob(existingJob);
      if (!updatedJob) {
        throw new Error("Failed to update job");
      }

      return {
        success: true,
        message: "Job updated successfully",
        job: updatedJob
      };
    } catch (error) {
      throw handleUseCaseError(error || "Unexpected error in UpdateJobUseCase");
    }
  }
}

export class GetJobByIdUseCase {
  constructor(private jobRepository: JobRepositoryImpl) {}

  async execute(data: GetJobByIdRequest): Promise<GetJobResponse> {
    try {
      const { jobId } = data;

      if (!jobId) {
        throw new Error("Job ID is required");
      }

      const job = await this.jobRepository.findJobById(jobId);
      if (!job) {
        throw new Error("Job not found");
      }

      return {
        success: true,
        message: "Job retrieved successfully",
        job
      };
    } catch (error) {
      throw handleUseCaseError(error || "Unexpected error in GetJobByIdUseCase");
    }
  }
}

export class DeleteJobUseCase {
  constructor(private jobRepository: JobRepositoryImpl) {}

  async execute(data: DeleteJobRequest): Promise<DeleteJobResponse> {
    try {
      const { jobId } = data;

      if (!jobId) {
        throw new Error("Job ID is required");
      }

      const existingJob = await this.jobRepository.findJobById(jobId);
      if (!existingJob) {
        throw new Error("Job not found");
      }

      const deleted = await this.jobRepository.deleteJob(jobId);
      if (!deleted) {
        throw new Error("Failed to delete job");
      }

      return {
        success: true,
        message: "Job deleted successfully"
      };
    } catch (error) {
      throw handleUseCaseError(error || "Unexpected error in DeleteJobUseCase");
    }
  }
}