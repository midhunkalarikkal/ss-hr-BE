import { Request, Response } from "express";
import { Types } from "mongoose";
import { HandleError } from "../../infrastructure/error/error";
import { CreateJobZodSchema, UpdateJobZodSchema, GetJobByIdZodSchema, DeleteJobZodSchema } from "../../infrastructure/zod/job.zod";
import {CreateJobUseCase,UpdateJobUseCase,GetJobByIdUseCase,DeleteJobUseCase} from "../../application/use-cases/jobUseCases";
import { JobRepositoryImpl } from "../../infrastructure/database/job/jobRepositoryImpl";

const jobRepositoryImpl = new JobRepositoryImpl();
const createJobUseCase = new CreateJobUseCase(jobRepositoryImpl);
const updateJobUseCase = new UpdateJobUseCase(jobRepositoryImpl);
const getJobByIdUseCase = new GetJobByIdUseCase(jobRepositoryImpl);
const deleteJobUseCase = new DeleteJobUseCase(jobRepositoryImpl);

export class JobController {
  constructor(
    private createJobUseCase: CreateJobUseCase,
    private updateJobUseCase: UpdateJobUseCase,
    private getJobByIdUseCase: GetJobByIdUseCase,
    private deleteJobUseCase: DeleteJobUseCase
  ) {
    this.createJob = this.createJob.bind(this);
    this.updateJob = this.updateJob.bind(this);
    this.getJobById = this.getJobById.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
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

const jobController = new JobController(
  createJobUseCase,
  updateJobUseCase,
  getJobByIdUseCase,
  deleteJobUseCase
);

export { jobController };