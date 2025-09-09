import { Types } from "mongoose";
import { Testimonial } from "../../domain/entities/testimonial";
import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { TestimonialRepositoryImpl } from "../../infrastructure/database/testimonial/testimonialRepositoryImpl";
import {
  CreateTestimonialRequest,
  CreateTestimonialResponse,
  UpdateTestimonialRequest,
  UpdateTestimonialResponse,
  DeleteTestimonialRequest,
  GetTestimonialByIdRequest,
  GetTestimonialByIdResponse,
} from "../../infrastructure/dtos/testimonial.dto";

export class CreateTestimonialUseCase {
  constructor(private testimonialRepository: TestimonialRepositoryImpl) {}

  async execute(data: CreateTestimonialRequest): Promise<CreateTestimonialResponse> {
    try {
      const { clientName, clientPhoto, designation, testimonial } = data;

      const createdTestimonial = await this.testimonialRepository.createTestimonial({
        clientName,
        clientPhoto: clientPhoto || "",
        designation,
        testimonial,
      });

      return {
        success: true,
        message: "Testimonial created successfully",
        testimonial: {
          _id: createdTestimonial._id,
          clientName: createdTestimonial.clientName,
          clientPhoto: createdTestimonial.clientPhoto,
          designation: createdTestimonial.designation,
          testimonial: createdTestimonial.testimonial,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to create testimonial");
    }
  }
}

export class UpdateTestimonialUseCase {
  constructor(private testimonialRepository: TestimonialRepositoryImpl) {}

  async execute(data: UpdateTestimonialRequest): Promise<UpdateTestimonialResponse> {
    try {
      const { _id, ...updateData } = data;

      const existingTestimonial = await this.testimonialRepository.findTestimonialById(_id);
      if (!existingTestimonial) throw new Error("Testimonial not found");

      const updatedTestimonial = new Testimonial(
        existingTestimonial._id,
        updateData.clientName ?? existingTestimonial.clientName,
        updateData.clientPhoto ?? existingTestimonial.clientPhoto,
        updateData.designation ?? existingTestimonial.designation,
        updateData.testimonial ?? existingTestimonial.testimonial,
        updateData.isVisible ?? existingTestimonial.isVisible,
        existingTestimonial.createdAt,
        existingTestimonial.updatedAt
      );

      const result = await this.testimonialRepository.updateTestimonial(updatedTestimonial);
      if (!result) throw new Error("Failed to update testimonial");

      return {
        success: true,
        message: "Testimonial updated successfully",
        testimonial: {
          _id: result._id,
          clientName: result.clientName,
          clientPhoto: result.clientPhoto,
          designation: result.designation,
          testimonial: result.testimonial,
          isVisible: result.isVisible,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to update testimonial");
    }
  }
}

export class DeleteTestimonialUseCase {
  constructor(private testimonialRepository: TestimonialRepositoryImpl) {}

  async execute(data: DeleteTestimonialRequest): Promise<ApiResponse> {
    try {
      const { testimonialId } = data;

      const existingTestimonial = await this.testimonialRepository.findTestimonialById(testimonialId);
      if (!existingTestimonial) throw new Error("Testimonial not found");

      const deleted = await this.testimonialRepository.deleteTestimonial(testimonialId);
      if (!deleted) throw new Error("Failed to delete testimonial");

      return { success: true, message: "Testimonial deleted successfully" };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to delete testimonial");
    }
  }
}

export class GetTestimonialByIdUseCase {
  constructor(private testimonialRepository: TestimonialRepositoryImpl) {}

  async execute(data: GetTestimonialByIdRequest): Promise<GetTestimonialByIdResponse> {
    try {
      const { testimonialId } = data;

      const testimonial = await this.testimonialRepository.findTestimonialById(testimonialId);
      if (!testimonial) throw new Error("Testimonial not found");

      return {
        success: true,
        message: "Testimonial retrieved successfully",
        testimonial: {
          _id: testimonial._id,
          clientName: testimonial.clientName,
          clientPhoto: testimonial.clientPhoto,
          designation: testimonial.designation,
          testimonial: testimonial.testimonial,
          isVisible: testimonial.isVisible,
          createdAt: testimonial.createdAt,
          updatedAt: testimonial.updatedAt,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get testimonial");
    }
  }
}

export class GetAllTestimonialsUseCase {
  constructor(private testimonialRepository: TestimonialRepositoryImpl) {}

  async execute(data: { page: number; limit: number }) {
    try {
      const result = await this.testimonialRepository.findAllTestimonials(data);
      return {
        success: true,
        message: "Testimonials retrieved successfully",
        ...result,
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get testimonials");
    }
  }
}

export class GetTestimonialStatsUseCase {
  constructor(private testimonialRepository: TestimonialRepositoryImpl) {}

  async execute() {
    try {
      const totalTestimonials = await this.testimonialRepository.getTotalCount();
      return {
        success: true,
        message: "Testimonial stats retrieved successfully",
        stats: { totalTestimonials },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get testimonial stats");
    }
  }
}
