import {DrawContext} from "./DrawContext";

/** interface for everything that can be drawn */
export interface CalendarDrawable {
  /** draws the instance */
  draw(context: DrawContext): any;
}
