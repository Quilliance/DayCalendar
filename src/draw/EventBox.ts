/** The area in the tile which displays a single event in the calendar
 *
 * Draws the area rect to symbolize the time covered by the event.
 * Also contains the label of the event title.
 */
export class EventBox {
  /** returns the width of the box */
  get width(): number {
    return this.rect.attr('width');
  }
  /** sets the width */
  set width(value) {
    this.rect.attr('width', value);
  }
  /** constructor with initial fields
   *
   */
  constructor(
    public rect: any
  ){}

}