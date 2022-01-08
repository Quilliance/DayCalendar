import {DayCalendarEvent} from "../events/DayCalendarEvent";

/** the label of an event */
export class EventLabel {
  /** constructor with the text and x/y position
   *
   * @param _event the event whose heading is displayed in the label
   */
  constructor(
    private _event: DayCalendarEvent
  ) {}

  /** returns the width covered by this text element */
  get textWidth(): number {
    // check if the text element exists
    if (this.textElement) {
      const boundingBox = this.textElement.node().getBoundingClientRect();
      return boundingBox.width;
    } else {
      return 0;
    }
  }

  /** the text element */
  private textElement: any;

  /** the vertical text offset */
  protected get verticalTextOffset(): number {
    return 20;
  }
  /** the horizontal text offset */
  protected get horizontalTextOffset(): number {
    return 10;
  }

  /** draws this label in the given group
   *
   * @param group the svg group containing this label
   */
  draw(group: any) {
    // adds the label to the group
    this.textElement = group.append('text')
      .attr('x', 0).attr('y', 0) // the containing group is transformed already
      .attr('dy', this.verticalTextOffset)
      .attr('dx', this.horizontalTextOffset)
      .text(this._event.title)
      .attr('class', 'label');
  }
}
