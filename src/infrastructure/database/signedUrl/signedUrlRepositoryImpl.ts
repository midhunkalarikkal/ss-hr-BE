import { ISignedUrlCache, SignedUrlCacheModel } from "./signedUrlMode";
import { SignedUrlCache } from "../../../domain/entities/signedUrlCache";
import { ISignedUrlRepository } from "../../../domain/repositories/ISignedUrlRepository";

export class SignedUrlRepositoryImpl implements ISignedUrlRepository {

    private mapToEntity(singedUrl: ISignedUrlCache): SignedUrlCache {
        return new SignedUrlCache(
            singedUrl.key,
            singedUrl.url,
            singedUrl.expiresAt,
        )
    }

    async findOneSignedUrl(key: string): Promise<SignedUrlCache | null> {
        try {
            const singedUrl = await SignedUrlCacheModel.findOne({ key });
            return singedUrl ? this.mapToEntity(singedUrl) : null;
        } catch (error) {
            throw new Error("Unable to find signed url, please try again after a few minutes.");
        }
    }

    async findOneSignedUrlAndUpdate(key: string, signedUrl: string, expiresAt: Date): Promise<SignedUrlCache> {
        try {
            const updatedSignedUrl = await SignedUrlCacheModel.findOneAndUpdate(
                { key },
                { key, url: signedUrl, expiresAt },
                { upsert: true, new: true }
            );
            return this.mapToEntity(updatedSignedUrl)
        } catch (error) {
            throw new Error("Unable to updated url, please try again after a few minutes.");
        }
    }
}