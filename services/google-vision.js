
const vision = require('@google-cloud/vision');

/*
interface IOptions {
    credentials: {
        client_email: string;
        private_key: string;
    }
    projectId: string
}
*/

class GoogleVision {
    constructor(options){
        this.client = new vision.ImageAnnotatorClient(options);
    }
    async webDetection(requestData){
        const [result] = await this.client.webDetection(requestData);
        const webDetection = result.webDetection;
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
    }
}

module.exports = GoogleVision