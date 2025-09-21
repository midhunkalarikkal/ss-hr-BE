import {
  CreateTestimonialRequest,
  CreateTestimonialResponse,
  UpdateTestimonialRequest,
  UpdateTestimonialResponse,
  DeleteTestimonialRequest,
  GetTestimonialByIdRequest,
  GetTestimonialByIdResponse,
} from "../../infrastructure/dtos/testimonial.dto";
import { Testimonial } from "../../domain/entities/testimonial";
import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { FileDeleteService, FileUploadService } from "../../infrastructure/service/fileUpload";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { validateFile } from "../../infrastructure/validator/imageFileValidator";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { TestimonialRepositoryImpl } from "../../infrastructure/database/testimonial/testimonialRepositoryImpl";


export class CreateTestimonialUseCase {
  constructor(
    private testimonialRepository: TestimonialRepositoryImpl,
    private fileUploadService: FileUploadService,
    private signedUrlService: SignedUrlService
  ) { }

  async execute(data: CreateTestimonialRequest): Promise<CreateTestimonialResponse> {
    try {
      const { clientName, clientPhoto, designation, testimonial } = data;

      const isValidFile = validateFile(clientPhoto);
      if (!isValidFile) throw new Error("Invalid profile image file");

      let clientProfileImage: string = "";
      if(clientPhoto) { 
        clientProfileImage = await this.fileUploadService.uploadFile({
          folder: "ss-hr-testimonial",
          userId: "user",
          file: clientPhoto,
        });
      }

      const createdTestimonial = await this.testimonialRepository.createTestimonial({
        clientName,
        clientPhoto: clientProfileImage,
        designation,
        testimonial,
      });

      if(!createdTestimonial) throw new Error("Testimonial adding failed");

      const signedUrl = await this.signedUrlService.generateSignedUrl(
                createdTestimonial.clientPhoto
            );

      return {
        success: true,
        message: "Testimonial created successfully",
        testimonial: {
          _id: createdTestimonial._id,
          clientName: createdTestimonial.clientName,
          clientPhoto: signedUrl,
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
  constructor(
    private testimonialRepository: TestimonialRepositoryImpl,
    private fileUploadService: FileUploadService,
    private fileDeleteService: FileDeleteService
  ) {}

  async execute(data: UpdateTestimonialRequest): Promise<UpdateTestimonialResponse> {
    try {
      const { _id, clientName, clientPhoto, designation, isVisible, testimonial } = data;

      const existingTestimonial = await this.testimonialRepository.findTestimonialById(_id);
      if (!existingTestimonial) throw new Error("Testimonial not found");

      if (clientPhoto) {
        if (existingTestimonial.clientPhoto) {
          const response = await this.fileDeleteService.deleteFile(existingTestimonial.clientPhoto);
          if (!response) throw new Error("Old profile image deletion failed");
        }

        const isValidFile = validateFile(clientPhoto);
        if (!isValidFile) throw new Error("Invalid profile image file");

        existingTestimonial.clientPhoto = await this.fileUploadService.uploadFile({
          folder: "ss-hr-testimonial",
          userId: "user",
          file: clientPhoto,
        });
      }

      existingTestimonial.clientName = clientName || existingTestimonial.clientName;
      existingTestimonial.designation = designation || existingTestimonial.designation;
      existingTestimonial.isVisible = isVisible ?? existingTestimonial.isVisible;
      existingTestimonial.testimonial = testimonial || existingTestimonial.testimonial;

      const result = await this.testimonialRepository.updateTestimonial(existingTestimonial);
      if (!result) throw new Error("Failed to update testimonial");

      return {
        success: true,
        message: "Testimonial updated successfully",
      };
    } catch (error) {
      console.log("UpdateTestimonialUseCase error :", error);
      throw handleUseCaseError(error || "Failed to update testimonial");
    }
  }
}


export class DeleteTestimonialUseCase {
  constructor(
    private testimonialRepository: TestimonialRepositoryImpl,
    private fileDeleteService: FileDeleteService
  ) { }

  async execute(data: DeleteTestimonialRequest): Promise<ApiResponse> {
    try {
      const { testimonialId } = data;

      const existingTestimonial = await this.testimonialRepository.findTestimonialById(testimonialId);
      if (!existingTestimonial) throw new Error("Testimonial not found");

      if(existingTestimonial.clientPhoto) {
         const response = await this.fileDeleteService.deleteFile(existingTestimonial.clientPhoto);
          if (!response) throw new Error("Old textimonial profile image failed");
      }

      const deleted = await this.testimonialRepository.deleteTestimonial(testimonialId);
      if (!deleted) throw new Error("Failed to delete testimonial");

      return { success: true, message: "Testimonial deleted successfully" };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to delete testimonial");
    }
  }
}

export class GetTestimonialByIdUseCase {
  constructor(
    private testimonialRepository: TestimonialRepositoryImpl,
    private signedUrlService: SignedUrlService
  ) { }

  async execute(data: GetTestimonialByIdRequest): Promise<GetTestimonialByIdResponse> {
    try {
      const { testimonialId } = data;

      const testimonial = await this.testimonialRepository.findTestimonialById(testimonialId);
      if (!testimonial) throw new Error("Testimonial not found");

      const signedUrl = await this.signedUrlService.generateSignedUrl(
                testimonial.clientPhoto
            );

      return {
        success: true,
        message: "Testimonial retrieved successfully",
        testimonial: {
          _id: testimonial._id,
          clientName: testimonial.clientName,
          clientPhoto: signedUrl,
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
  constructor(
    private testimonialRepository: TestimonialRepositoryImpl,
    private signedUrlService: SignedUrlService
  ) { }

  async execute(data: { page: number; limit: number }) {
    try {
      const result = await this.testimonialRepository.findAllTestimonials(data);

      const updatedResult = await Promise.all(
        result.data?.map(async (testimonial) => {
          let updateProfileImage = testimonial.clientPhoto;

          if (testimonial.clientPhoto) {
            updateProfileImage = await this.signedUrlService.generateSignedUrl(
              testimonial.clientPhoto
            );
          }

          return {
            ...testimonial,
            clientPhoto: updateProfileImage,
          };
        }) ?? []
      );

      return {
        success: true,
        message: "Testimonials retrieved successfully",
        data: updatedResult ?? [],
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get testimonials");
    }
  }
}

export class GetTestimonialStatsUseCase {
  constructor(private testimonialRepository: TestimonialRepositoryImpl) { }

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
