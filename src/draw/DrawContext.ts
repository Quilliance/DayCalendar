import {DrawDimensions} from "./DrawDimensions";

/** context for drawing a CalendarDrawable */
export class DrawContext {
  /** the serial counter of the clip path */
  clipPathCounter = 0;
  constructor(
    public dimensions: DrawDimensions,
    public defs: any
  ) {
  }
}
