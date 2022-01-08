
/** static struct of drawing measures */
export class DrawDimensions {
  /** the overall width */
  width: number = 0;
  /** the overall height */
  height: number = 0;
  /** the padding for the content */
  padding: number = 10;
  /** the left offset of the axis */
  axisOffset: number = 40;
  /** the content width */
  get contentWidth(): number {
    return this.width - 2 * this.padding;
  }
  /** the content height */
  get contentHeight(): number {
    return this.height - 2 * this.padding;
  }
}
