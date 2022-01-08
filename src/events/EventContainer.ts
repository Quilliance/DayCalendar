import {DayCalendarEvent} from "./DayCalendarEvent";
import {Moment} from "moment";

/** data service provider for all items displayed in the tile calendar */
export class EventContainer {
  constructor(private _allEvents: DayCalendarEvent[]) {
    // sort all items
    this.sortChronologically();
  }
  /** sorts all items in this */
  protected sortChronologically() {
    this.events.sort((left, right) => {
      return left.getStartTimestamp() - right.getStartTimestamp();
    });
  }

  /** @brief returns a sub-container between in the time range
   *
   * @param startMoment the start of the range
   * @param endMoment the end of the range
   */
  getEventsForTimeRange (startMoment: Moment, endMoment: Moment) {
    // iterate over the events
    const inRangeEvents = this.events.filter((testEvent) => {
      // does it end before the range starts?
      if (testEvent.ifBefore(startMoment)) {
        return false; // filter
      }
      // does is start after the end of the range
      if (testEvent.isAfter(endMoment)) {
        return false; // filter
      }

      // if we get here, keep the event
      return true;
    });
    return inRangeEvents;
  };

  protected get events(): DayCalendarEvent[] {
    return this._allEvents;
  }
}
