
import { IService } from "../service-commoon"

export type VisionRequestData = string | Buffer

export interface IGoogleVision extends IService<{}> {
    webDetection(data: VisionRequestData): Promise<any>
}