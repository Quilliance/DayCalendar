import moment, {Moment} from "moment";
import {DayCalendarEvent} from "../events/DayCalendarEvent";
import {DrawContext} from "./DrawContext";
import * as d3 from 'd3';
import {EventLabel} from "./EventLabel";
import {EventBox} from "./EventBox";

/** a single column inside a page
 *
 * PageColumns are used to display events which happen at the same time on a single page.
 */
export class PageColumn {
  /** the last end moment */
  private _lastEnd: Moment = moment();
  /** the events in this column */
  private _events: DayCalendarEvent[] = [];
  /** the parent render group of this */
  private _renderGroup: any;
  /** constructor */
  constructor() {
  }
  /** returns true if there are events */
  get hasEvents(): boolean {
    return this._events.length > 0;
  }

  /** returns the total timestamp of the column in hours
   * Returns the duration from the start of the first event to the end of the last event in hours.
   * Can be used to compare how two columns are populated.
   */
  get durationInHours(): number {
    if (this.hasEvents) {
      // get the first event
      const firstEvent = this.events[0];
      const lastEvent = this.events[this.events.length - 1];
      // the duration
      return lastEvent.end.diff(firstEvent.start, 'hours');
    } else {
      return 0; // no duration
    }
  }

  /** returns true if the given event collides with an event inside the column
   *
   * @param eventToTest the event to test for collision
   *
   * Make sure that the events tested and added to the column are in chronological order.
   */
  sortedEventCollidesWithEventsInColumn(eventToTest: DayCalendarEvent): boolean {
    // check if there are any events in this
    if (this.hasEvents) {
      // check if the start of the test event is before the last end timestamp of the column
      return eventToTest.start.isBefore(this.lastEnd);
    } else {
      return false; // no collision (no events)
    }
  }

  /** draws this in the given parent group */
  drawInParentGroup(parentGroup: any, timeScale: any, columnBandsScale: any, columnIndex: number, drawContext: DrawContext) {
    // create a column group
    const columnGroup = parentGroup.append('g')
      .attr('class', `column column-${columnIndex} events`);

    // get the column index as string
    const indexString = columnIndex + '';
    // create a group for each event
    const eventGroups = columnGroup.selectAll('g.event')
      .data(this.events)
      .enter()
      .append('g')
      .attr('class', 'event')
      .attr('transform', (event: DayCalendarEvent) => {
        const xTransform = columnBandsScale(indexString);
        const yTransform = timeScale(event.start);
        return `translate(${xTransform} ${yTransform})`;
      })
      .on('mouseenter', function(mouseEvent: MouseEvent, tileCalendarEvent: DayCalendarEvent) {
        // extent the width of the box
        const labelWidth = tileCalendarEvent.display.titleLabel?.textWidth;
        // the width of the column
        const columnWidth = columnBandsScale.bandwidth();
        // check if the label is wider than column bandwidth
        if (labelWidth && labelWidth > columnWidth) {
          // remove the clip path to see the entire label
          d3.select(tileCalendarEvent.display.group)
            .attr('clip-path', '');
          // expend the width of the rect
          if (tileCalendarEvent.display.eventBox) {
            tileCalendarEvent.display.eventBox.width = labelWidth + 20;
          }
        }
      })
      .on('mouseleave', (mouseEvent: MouseEvent, tileCalendarEvent: DayCalendarEvent) => {
        // add the clip path back to the group
        d3.select(tileCalendarEvent.display.group)
          .attr('clip-path', `url(#label-${tileCalendarEvent.display.clipPathId})`);
        // re-size the box
        if (tileCalendarEvent.display.eventBox) {
          tileCalendarEvent.display.eventBox.width = columnBandsScale.bandwidth();
        }
      })
      .each((tileCalendarEvent: DayCalendarEvent, i: number, groupElements: any[]) => {
        tileCalendarEvent.display.group = groupElements[i];
      });
    
    // add the clip path to limit the text
    eventGroups.each(function(event: DayCalendarEvent, i: number, n: any) {
      // add the clip path
      drawContext.defs.append('clipPath')
        .attr('id', `label-${drawContext.clipPathCounter}`)
        .append('rect')
        .attr('x', 0).attr('y', 0) // we already transforming the group
        .attr('width', columnBandsScale.bandwidth())
        .attr('height', timeScale(event.end) - timeScale(event.start));
      // set the clip path
      d3.select(n[i])
        .attr('clip-path', `url(#label-${drawContext.clipPathCounter})`);
      // save the clip path
      event.display.clipPathId = drawContext.clipPathCounter;
      // increment the clip path counter
      drawContext.clipPathCounter++;
    });
    // add the rects
    eventGroups.append('rect')
      .attr('class', (event: DayCalendarEvent, i: number) => {
        return `event event-${i} event-${event.category}`;
      })
      .attr('x', 0).attr('y', 0) // we already transforming the parent group
      .attr('width', columnBandsScale.bandwidth())
      .attr('height', (event: DayCalendarEvent, i: number) => {
        return timeScale(event.end) - timeScale(event.start);
      })
      .each((tileCalendarEvent: DayCalendarEvent, i: number, groupElements: any[]) => {
        // @ts-ignore
        const rectSelection = d3.select(groupElements[i]);
        // creat the box and add to display
        tileCalendarEvent.display.eventBox = new EventBox(rectSelection);
      })

    // add the labels
    eventGroups.each((tileCalendarEvent: DayCalendarEvent, i: number, groupElements: any[]) => {
      // the group which contains the label
      const group = d3.select(groupElements[i]);
      // create the label
      const label = new EventLabel(tileCalendarEvent);
      // draws the label text element inside the group
      label.draw(group);
      // add to he event
      tileCalendarEvent.display.titleLabel = label;
    })
  }

  /** adds the given event to this column
   * check if the event collides with existing events in this column before adding
   */
  addEvent(event: DayCalendarEvent) {
    this.events.push(event);
    // update the end
    this._lastEnd = event.end;
  }

  protected get lastEnd(): moment.Moment {
    return this._lastEnd;
  }
  get events(): DayCalendarEvent[] {
    return this._events;
  }


  get renderGroup(): any {
    return this._renderGroup;
  }

  set renderGroup(value: any) {
    this._renderGroup = value;
  }

}
