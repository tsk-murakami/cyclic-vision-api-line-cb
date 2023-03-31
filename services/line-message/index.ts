
import lineSdk from '@line/bot-sdk';
import { ServiceNames } from "../service-names"
import { ILineMessage, IDependenciesServices } from "./interface";
import { IGoogleVision } from "../google-vision/interface"

export interface ILineConfig {
    channelAccessToken: string;
    channelSecret: string
}

class LineService implements ILineMessage {

    client: lineSdk.Client
    config: ILineConfig

    _googleVision: IGoogleVision

    constructor(config: ILineConfig){
        this.client = new lineSdk.Client(config);
        this.config = config
    }
    get middleware(){
        return lineSdk.middleware(this.config)
    }

    inject(services: IDependenciesServices){
        this._googleVision = services.googleVision
    }

    async handleEvent(event: lineSdk.WebhookEvent){
        if (event.type !== 'message' || event.message.type !== 'text') {
            return Promise.resolve(null);
        }
        
        return await this.client.replyMessage(event.replyToken, {
            type: 'text',
            text: event.message.text
        });
    }
}

export default LineService