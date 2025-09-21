import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { AdminFetchAllTestimonials } from "../../domain/repositories/ITestimonialRepository";
import { TestimonialRepositoryImpl } from "../../infrastructure/database/testimonial/testimonialRepositoryImpl";

export class UseGetTestimonialsUseCase {
    constructor(
        private testimonialRepositoryImpl: TestimonialRepositoryImpl,
        private signedUrlService: SignedUrlService
    ) { }

    async execute(): Promise<ApiResponse<AdminFetchAllTestimonials>> {
        try {
            const result = await this.testimonialRepositoryImpl.findAllTestimonials({ page: 1, limit: 20 });

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