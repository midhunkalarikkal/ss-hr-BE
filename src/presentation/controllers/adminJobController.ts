import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { JobRepositoryImpl } from "../../infrastructure/database/job/jobRepositoryImpl";
import {CreateJobUseCase,UpdateJobUseCase,GetJobByIdUseCase,DeleteJobUseCase,GetAllJobsUseCase} from "../../application/use-cases/jobUseCases";
import { CreateJobZodSchema, UpdateJobZodSchema, GetJobByIdZodSchema, DeleteJobZodSchema,GetAllJobsZodSchema} from "../../infrastructure/zod/job.zod";

const jobRepositoryImpl = new JobRepositoryImpl();
const createJobUseCase = new CreateJobUseCase(jobRepositoryImpl);
const updateJobUseCase = new UpdateJobUseCase(jobRepositoryImpl);
const getJobByIdUseCase = new GetJobByIdUseCase(jobRepositoryImpl);
const deleteJobUseCase = new DeleteJobUseCase(jobRepositoryImpl);
const getAllJobsUseCase = new GetAllJobsUseCase(jobRepositoryImpl);

export class AdminJobController {
  constructor(
    private createJobUseCase: CreateJobUseCase,
    private updateJobUseCase: UpdateJobUseCase,
    private getJobByIdUseCase: GetJobByIdUseCase,
    private deleteJobUseCase: DeleteJobUseCase,
    private getAllJobsUseCase: GetAllJobsUseCase
  ) {
    this.createJob = this.createJob.bind(this);
    this.updateJob = this.updateJob.bind(this);
    this.getJobById = this.getJobById.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.getAllJobs = this.getAllJobs.bind(this);
  }

  async getAllJobs(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = GetAllJobsZodSchema.parse(req.query);
      const result = await this.getAllJobsUseCase.execute(validatedData);
      res.status(200).json(result);
    } catch (error) {
      console.log("Get all jobs error:", error);
      HandleError.handle(error, res);
    }
  }

  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = CreateJobZodSchema.parse(req.body);
      const result = await this.createJobUseCase.execute(validatedData);
      res.status(201).json(result);
    } catch (error) {
      console.log("Create job error:", error);
      HandleError.handle(error, res);
    }
  }

  async updateJob(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = UpdateJobZodSchema.parse({
        _id: id,
        ...req.body
      });
      
      const result = await this.updateJobUseCase.execute({
        _id: new Types.ObjectId(validatedData._id),
        companyName: validatedData.companyName,
        designation: validatedData.designation,
        vacancy: validatedData.vacancy
      });
      
      res.status(200).json(result);
    } catch (error) {
      console.log("Update job error:", error);
      HandleError.handle(error, res);
    }
  }

  async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = GetJobByIdZodSchema.parse({ jobId: id });
      
      const result = await this.getJobByIdUseCase.execute({
        jobId: new Types.ObjectId(validatedData.jobId)
      });
      
      res.status(200).json(result);
    } catch (error) {
      console.log("Get job error:", error);
      HandleError.handle(error, res);
    }
  }

  async deleteJob(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = DeleteJobZodSchema.parse({ jobId: id });
      
      const result = await this.deleteJobUseCase.execute({
        jobId: new Types.ObjectId(validatedData.jobId)
      });
      
      res.status(200).json(result);
    } catch (error) {
      console.log("Delete job error:", error);
      HandleError.handle(error, res);
    }
  }
}

const adminJobController = new AdminJobController(
  createJobUseCase,
  updateJobUseCase,
  getJobByIdUseCase,
  deleteJobUseCase,
  getAllJobsUseCase
);

export { adminJobController };