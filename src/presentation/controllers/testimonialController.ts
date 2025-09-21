import { Types } from 'mongoose';
import { Request, Response } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import {
    CreateTestimonialUseCase,
    UpdateTestimonialUseCase,
    DeleteTestimonialUseCase,
    GetTestimonialByIdUseCase,
    GetAllTestimonialsUseCase,
    GetTestimonialStatsUseCase
} from '../../application/adminUse-cases/adminTestimonialUseCases';
import { S3KeyGenerator } from "../../infrastructure/helper/generateS3key";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { RandomStringGenerator } from "../../infrastructure/helper/generateRandomString";
import { FileDeleteService, FileUploadService } from "../../infrastructure/service/fileUpload";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { TestimonialRepositoryImpl } from "../../infrastructure/database/testimonial/testimonialRepositoryImpl";

const s3Client = new S3Client();
const randomStringGenerator = new RandomStringGenerator();
const fileDeleteService = new FileDeleteService(s3Client);
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();
const s3KeyGenerator = new S3KeyGenerator(randomStringGenerator);
const testimonialRepositoryImpl = new TestimonialRepositoryImpl();
const fileUploadService = new FileUploadService(s3Client, s3KeyGenerator);
const signedUrlService = new SignedUrlService(aws_s3Config.bucketName, signedUrlRepositoryImpl);

const getTestimonialStatsUseCase = new GetTestimonialStatsUseCase(testimonialRepositoryImpl);
const deleteTestimonialUseCase = new DeleteTestimonialUseCase(testimonialRepositoryImpl, fileDeleteService);
const getTestimonialByIdUseCase = new GetTestimonialByIdUseCase(testimonialRepositoryImpl, signedUrlService);
const getAllTestimonialsUseCase = new GetAllTestimonialsUseCase(testimonialRepositoryImpl, signedUrlService);
const updateTestimonialUseCase = new UpdateTestimonialUseCase(testimonialRepositoryImpl, fileUploadService, fileDeleteService);
const createTestimonialUseCase = new CreateTestimonialUseCase(testimonialRepositoryImpl, fileUploadService, signedUrlService);

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
            const { clientName, designation, testimonial } = req.body;
            const result = await this.createTestimonialUseCase.execute({
                clientName,
                designation,
                testimonial,
                clientPhoto: req.file
            });
            return res.status(201).json(result);
        } catch (error) {
            console.log("createTestimonial error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updateTestimonial(req: Request, res: Response) {
        try {
            const { clientName, designation, isVisible, testimonial } = req.body;
            const testimonialId = new Types.ObjectId(req.params.id);
            const result = await this.updateTestimonialUseCase.execute({
                _id: testimonialId,
                clientName,
                designation,
                isVisible,
                testimonial,
                clientPhoto: req.file
            });
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