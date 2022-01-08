import moment from 'moment';
import {DayCalendarEvent} from "./events/DayCalendarEvent";
const now = moment();

export const calendarData = {
  events: [
    new DayCalendarEvent('meeting', moment(now).hour(9).startOf('hour'), moment(now).hour(10).startOf('hour'), 'Customer Meeting'),
    new DayCalendarEvent('event', moment(now).hour(11).startOf('hour'), moment(now).hour(15).startOf('hour'), 'Vendor Presentation With a long text'),
    new DayCalendarEvent('meeting', moment(now).hour(13).startOf('hour'), moment(now).hour(14).startOf('hour'), 'Review Structure'),
    new DayCalendarEvent('meeting', moment(now).hour(13).startOf('hour'), moment(now).hour(15).startOf('hour'), 'Cake!'),
    new DayCalendarEvent('meeting', moment(now).hour(16).startOf('hour'), moment(now).hour(17).startOf('hour'), 'Weekly Status Meeting'),
    new DayCalendarEvent('event', moment(now).hour(9).startOf('hour').subtract(1, 'day'), moment(now).hour(12).startOf('hour').subtract(1, 'day'), 'Cyber Security Awareness')
  ]
};
