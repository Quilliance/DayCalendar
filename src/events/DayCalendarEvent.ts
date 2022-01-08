import {Moment} from 'moment';
import {EventLabel} from "../draw/EventLabel";
import {EventDisplay} from "../draw/EventDisplay";

/** a single event */
export class DayCalendarEvent {
  constructor(
    private _category: string,
    private _start: Moment,
    private _end: Moment,
    private _title: string
  ) {}
  /** the display of this event inside the day calendar */
  display: EventDisplay = new EventDisplay();

  /** @brief returns true if the event is after the given moment
   * @param compareMoment the moment to compare
   */
  isAfter(compareMoment: Moment): boolean {
    return this.start.isAfter(compareMoment);
  }

  /** @brief returns true if this event ends before the given moment
   * @param compareMoment the moment to compare
   */
  ifBefore(compareMoment: Moment): boolean {
    return this.end.isBefore(compareMoment);
  }

  /** @brief returns true if the given the given moment falls inside this event */
  isDuring(compareMoment: Moment): boolean {
    return this.start.isBefore(compareMoment) && this.end.isAfter(compareMoment);
  }
  /** @brief returns true if this events overlaps with another event
   * @param otherEvent other event
   */
  doesOverlap(otherEvent: DayCalendarEvent): boolean {
    // does it overlap in the beginning
    const overlapsInStart = this.isDuring(otherEvent.end);
    const overlapsInEnd = this.isDuring(otherEvent.start);
    const thisEnclosesOtherEvent = this.start.isBefore(otherEvent.start) && this.end.isAfter(otherEvent.end);
    const otherEventEnclosesThis = this.start.isAfter(otherEvent.start) && this.end.isBefore(otherEvent.end);

    // if any of the flags are true, we are overlapping
    return overlapsInStart || overlapsInEnd || thisEnclosesOtherEvent || otherEventEnclosesThis;
  }

  /** returns the start as Date object */
  getStartDate(): Date {
    return this.start.toDate();
  }
  /** returns the end as Date object */
  getEndDate(): Date {
    return this.end.toDate();
  }
  /** returns the start as timestamp */
  getStartTimestamp(): number {
    return this.getStartDate().getTime();
  }
  /** returns the end as timestamp */
  getEndTimestamp(): number {
    return this.getEndDate().getTime();
  }

  get category(): string {
    return this._category;
  }

  get start(): Moment {
    return this._start;
  }

  get end(): Moment {
    return this._end;
  }

  get title(): string {
    return this._title;
  }
}
