
import { IGoogleVision } from "./google-vision/interface";
export { IGoogleVision } from "./google-vision/interface";
import { ILineMessage } from "./line-message/interface";
export { ILineMessage } from "./line-message/interface";

import { ServiceNames } from "./service-names"

export interface IServices extends Object {
    [ServiceNames.googleVision]: IGoogleVision;
    [ServiceNames.lineMessage]: ILineMessage;
}