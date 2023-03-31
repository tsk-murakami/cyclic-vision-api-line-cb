
import { ILineConfig }  from "../services/line-message"
import { IGoogleVisionFromJsonConfig } from "../services/google-vision"

export interface IConfig {
    line: ILineConfig
    google: IGoogleVisionFromJsonConfig
}

export function makeConfig(): IConfig {
    const lineConfig: ILineConfig = {
        channelAccessToken: process.env.LINE_ACCESS_TOKEN || "",
        channelSecret: process.env.LINE_CHANNEL_SECRET || ""
    }
    const googleConfig: IGoogleVisionFromJsonConfig = {
        type: "s3",
        s3Service: {
            bucketName: process.env.CYCLIC_BUCKET_NAME || "",
            jsonPath: process.env.GOOGLE_CERTIFICATE_JSON || "",
        }
    }
    return {
        line: lineConfig, google: googleConfig
    }
}