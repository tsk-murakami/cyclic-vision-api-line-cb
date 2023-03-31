
import lineSdk from '@line/bot-sdk';
import { Middleware } from "@line/bot-sdk/dist/middleware"

import { IService } from "../service-commoon"
import { IGoogleVision } from "../google-vision/interface"
import { ServiceNames } from "../service-names"

export type VisionRequestData = string | Buffer

export interface IDependenciesServices {
    [ServiceNames.googleVision]: IGoogleVision
}

export interface ILineMessage extends IService<IDependenciesServices> {
    handleEvent(event: lineSdk.WebhookEvent): Promise<any>;
    middleware: Middleware
}