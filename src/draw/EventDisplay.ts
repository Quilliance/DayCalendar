import {EventBox} from "./EventBox";
import {EventLabel} from "./EventLabel";

/** abstraction of the view item showing all information on an event
 *
 */
export class EventDisplay {
  /** the svg group to display the entire thing */
  group?: any;
  /** the box in the timetable */
  eventBox?: EventBox;
  /** the label for the event title */
  titleLabel?: EventLabel;
  /** the id of the slip path */
  clipPathId?: number;
}