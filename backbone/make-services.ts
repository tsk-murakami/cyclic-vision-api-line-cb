

import LineService  from "../services/line-message"
import GoogleVisionService from "../services/google-vision"
import { IServices } from "../services/services";
import { ServiceNames } from "../services/service-names"

import { IConfig } from "./make-config";

export async function makeServices( config: IConfig ): Promise<IServices> {
    const lineMessage = new LineService(config.line)
    const googleVision = await GoogleVisionService.from_json(config.google)
    const services: IServices = {
        [ServiceNames.googleVision]: googleVision,
        [ServiceNames.lineMessage]: lineMessage,
    }
    for(const s of Object.values(services) ) s.inject(services)
    
    return services
}