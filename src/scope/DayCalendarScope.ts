import moment, {Moment} from "moment";
/** a calendar scope with start and end date
 * Today scope by default
 */
export class DayCalendarScope {
  /** the specifier */
  specifier = 'today';
  /** the start moment */
  start = moment().startOf('day');
  /** the end moment */
  end = moment(this.start).endOf('day');
  /** returns the time range */
  get range(): Moment[] {
    return [this.start, this.end];
  }
}
