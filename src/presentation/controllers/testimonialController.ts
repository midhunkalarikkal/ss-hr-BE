import { Request, Response } from "express";
import { Types } from 'mongoose';
import { HandleError } from "../../infrastructure/error/error";
import { TestimonialRepositoryImpl } from "../../infrastructure/database/testimonial/testimonialRepositoryImpl";
import {
  CreateTestimonialUseCase,
  UpdateTestimonialUseCase,
  DeleteTestimonialUseCase,
  GetTestimonialByIdUseCase,
  GetAllTestimonialsUseCase,
  GetTestimonialStatsUseCase
} from '../../application/use-cases/testimonialUseCases';

const testimonialRepositoryImpl = new TestimonialRepositoryImpl();
const createTestimonialUseCase = new CreateTestimonialUseCase(testimonialRepositoryImpl);
const updateTestimonialUseCase = new UpdateTestimonialUseCase(testimonialRepositoryImpl);
const deleteTestimonialUseCase = new DeleteTestimonialUseCase(testimonialRepositoryImpl);
const getTestimonialByIdUseCase = new GetTestimonialByIdUseCase(testimonialRepositoryImpl);
const getAllTestimonialsUseCase = new GetAllTestimonialsUseCase(testimonialRepositoryImpl);
const getTestimonialStatsUseCase = new GetTestimonialStatsUseCase(testimonialRepositoryImpl);

export class TestimonialController {
    constructor(
        private createTestimonialUseCase: CreateTestimonialUseCase,
        private updateTestimonialUseCase: UpdateTestimonialUseCase,
        private deleteTestimonialUseCase: DeleteTestimonialUseCase,
        private getTestimonialByIdUseCase: GetTestimonialByIdUseCase,
        private getAllTestimonialsUseCase: GetAllTestimonialsUseCase,
        private getTestimonialStatsUseCase: GetTestimonialStatsUseCase
    ) {
        this.createTestimonial = this.createTestimonial.bind(this);
        this.updateTestimonial = this.updateTestimonial.bind(this);
        this.deleteTestimonial = this.deleteTestimonial.bind(this);
        this.getTestimonialById = this.getTestimonialById.bind(this);
        this.getAllTestimonials = this.getAllTestimonials.bind(this);
        this.getTestimonialStats = this.getTestimonialStats.bind(this);
    }

    async createTestimonial(req: Request, res: Response) {
        try {
            const result = await this.createTestimonialUseCase.execute(req.body);
            return res.status(201).json(result);
        } catch (error) {
            console.log("createTestimonial error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updateTestimonial(req: Request, res: Response) {
        try {
            const testimonialId = new Types.ObjectId(req.params.id);
            const result = await this.updateTestimonialUseCase.execute({ _id: testimonialId, ...req.body });
            return res.status(200).json(result);
        } catch (error) {
            console.log("updateTestimonial error : ", error);
            HandleError.handle(error, res);
        }
    }

    async deleteTestimonial(req: Request, res: Response) {
        try {
            const testimonialId = new Types.ObjectId(req.params.id);
            const result = await this.deleteTestimonialUseCase.execute({ testimonialId });
            return res.status(200).json(result);
        } catch (error) {
            console.log("deleteTestimonial error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getTestimonialById(req: Request, res: Response) {
        try {
            const testimonialId = new Types.ObjectId(req.params.id);
            const result = await this.getTestimonialByIdUseCase.execute({ testimonialId });
            return res.status(200).json(result);
        } catch (error) {
            console.log("getTestimonialById error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getAllTestimonials(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.getAllTestimonialsUseCase.execute({ page, limit });
            return res.status(200).json(result);
        } catch (error) {
            console.log("getAllTestimonials error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getTestimonialStats(req: Request, res: Response) {
        try {
            const result = await this.getTestimonialStatsUseCase.execute();
            return res.status(200).json(result);
        } catch (error) {
            console.log("getTestimonialStats error : ", error);
            HandleError.handle(error, res);
        }
    }
}

const testimonialController = new TestimonialController(
    createTestimonialUseCase,
    updateTestimonialUseCase,
    deleteTestimonialUseCase,
    getTestimonialByIdUseCase,
    getAllTestimonialsUseCase,
    getTestimonialStatsUseCase
);

export { testimonialController };