
import vision, { ImageAnnotatorClient } from '@google-cloud/vision';
import awsSdk from "aws-sdk"

import { IGoogleVision, VisionRequestData } from "./interface";

export interface IGoogleVisionFromJsonConfig {
  type: "s3"
  s3Service: {
    bucketName: string;
    jsonPath: string;
  }
}

export interface IGoogleVisionConfig {
    credentials: {
        client_email: string;
        private_key: string;
    }
    projectId: string
}

class GoogleVision implements IGoogleVision {
    client: ImageAnnotatorClient
    constructor(options: IGoogleVisionConfig){
        this.client = new vision.ImageAnnotatorClient({ credentials: options.credentials, projectId: options.projectId });
    }
    inject(services: {}): void {
        /** nothing dependencies services */
    }

    static async from_json(config: IGoogleVisionFromJsonConfig){

      const s3 = new awsSdk.S3()
      const jsonStr = await s3.getObject({
          Bucket: config.s3Service.bucketName,
          Key: config.s3Service.jsonPath,
      }).promise()
      const jsonData = JSON.parse(jsonStr.Body!.toString())
      return new GoogleVision(jsonData)
    }

    async webDetection(requestData: VisionRequestData){
        const [result] = await this.client.webDetection(requestData);
        const webDetection = result.webDetection;
        /*
        if (webDetection.fullMatchingImages.length) {
            console.log(
              `Full matches found: ${webDetection.fullMatchingImages.length}`
            );
            webDetection.fullMatchingImages.forEach(image => {
              console.log(`  URL: ${image.url}`);
              console.log(`  Score: ${image.score}`);
            });
        }
          
        if (webDetection.partialMatchingImages.length) {
            console.log(
              `Partial matches found: ${webDetection.partialMatchingImages.length}`
            );
            webDetection.partialMatchingImages.forEach(image => {
              console.log(`  URL: ${image.url}`);
              console.log(`  Score: ${image.score}`);
            });
        }
          
        if (webDetection.webEntities.length) {
            console.log(`Web entities found: ${webDetection.webEntities.length}`);
            webDetection.webEntities.forEach(webEntity => {
              console.log(`  Description: ${webEntity.description}`);
              console.log(`  Score: ${webEntity.score}`);
            });
        }
      */
    }
}

export default GoogleVision