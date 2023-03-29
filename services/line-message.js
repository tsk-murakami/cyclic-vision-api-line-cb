
const lineSdk = require('@line/bot-sdk');

/*
interface ILineConfig {
    channelAccessToken: string;
    channelSecret: string
}
*/

class LineService {
    constructor(config /* ILineConfig*/ ){
        this.client = new lineSdk.Client(config);
        this.config = config
    }
    get middleware(){
        return lineSdk.middleware(this.config)
    }

    async handleEvent(event){
        if (event.type !== 'message' || event.message.type !== 'text') {
            return Promise.resolve(null);
        }
        
        return await this.client.replyMessage(event.replyToken, {
            type: 'text',
            text: event.message.text
        });
    }
}

module.exports = LineService