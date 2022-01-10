import {CalendarDrawable} from "./CalendarDrawable";
import {DayCalendarEvent} from "../events/DayCalendarEvent";
import {DrawContext} from "./DrawContext";
import * as d3 from 'd3';
import {Moment} from "moment";
import {PageColumn} from "./PageColumn";

/** a single calendar page */
export class CalendarPage implements CalendarDrawable {
  /** the events on this page */
  private _events: DayCalendarEvent[] = [];
  /** the svg group holding this page */
  private _parentGroup: any;
  /** the columns in this page */
  private _columns: PageColumn[] = [new PageColumn()];

  /** the background rect */
  private background: any;

  /** constructor with the events */
  constructor(private _date: Moment) {
  }

  draw(context: DrawContext): any {
    const calendarPageGroup = this.parentGroup.append('g')
      .attr('class', 'calendar-page');
    // draw the gray background
    const background = calendarPageGroup.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', context.dimensions.contentWidth)
      .attr('height', context.dimensions.contentHeight)
      .attr('class', 'calendar-page-background');

    // create the timescale
    const timeScale = d3.scaleTime()
      .domain(this.scaleRange)
      .range([0, context.dimensions.contentHeight]); // vertical scale

    // create the axis
    const axis = d3.axisLeft(timeScale);
    const axisGroup = calendarPageGroup.append('g')
      .attr('transform', `translate(${context.dimensions.axisOffset} 0)`)
      .call(axis);
    // remove the long line
    axisGroup.select('.domain').remove();
    // make the tick lines longer
    axisGroup.selectAll('g.tick line')
      .attr('x2', context.dimensions.contentWidth - context.dimensions.axisOffset)
      .style("stroke-dasharray", ("3, 3"))
      .attr('stroke', null)
      .attr('class', 'axis-guideline');

    // the column domain
    let columnIndex = 0;
    const columnDomain = this.columns.map((column) => {
      return columnIndex++ + '';
    });
    const columnScale = d3.scaleBand()
      .domain(columnDomain)
      .range([context.dimensions.axisOffset, context.dimensions.contentWidth])

    const columnsGroup = calendarPageGroup.append('g')
      .attr('class', 'columns');

    /*
    The columns are drawn in reverse order: So the right most column is the last in the view hierarchy.
    For those event boxes whose content (text) is wider than its box, the size expands to full width when hovering over the event in order to show the full content (text).
    In this case, the expanded box will be higher in the view hierarchy than columns which it overlaps: It will show on top of the other columns.
     */
    for (let columnIndex = this.columns.length - 1; columnIndex >= 0; columnIndex--) {
      const column = this.columns[columnIndex];

      column.drawInParentGroup(columnsGroup, timeScale, columnScale, columnIndex, context);
    }
  }

  /** returns the start and end range of the scale */
  protected get scaleRange(): Date[] {
    return [
      this._date.hour(7).startOf('hour').toDate(),
      this._date.hour(18).endOf('hour').toDate(),
    ]
  }

  public get events(): DayCalendarEvent[] {
    return this._events;
  }
  set events(events: DayCalendarEvent[]) {
    this._events = events;
    // re-set the columns
    const columns = [new PageColumn()];
    // iterate over the events
    for (const tileCalendarEvent of events) {
      // add the event to the column cascade
      this.addEventToColumns(tileCalendarEvent, columns, 0);
    }
    // sort the column
    columns.sort((left, right) => {
      // we want the column with the most time to appear first (DESC sorting)
      return -(left.durationInHours - right.durationInHours);
    });
    // set local field
    this.columns = columns;
  }

  /** recursive member to add events */
  protected addEventToColumns(eventToAdd: DayCalendarEvent, columns: PageColumn[], activeColumnIndex: number) {
    let activeColumn: PageColumn;
    if (activeColumnIndex >= columns.length) {
      // create a new column
      const newColumn = new PageColumn();
      columns.push(newColumn);
      activeColumn = newColumn;
    } else {
      // take the column from the array
      activeColumn = columns[activeColumnIndex];
    }
    // check if the event collides with other events in the column
    if (activeColumn.sortedEventCollidesWithEventsInColumn(eventToAdd)) {
      // try to add to this next column
      this.addEventToColumns(eventToAdd, columns, activeColumnIndex + 1);
    } else {
      // no collision - simply add the column
      activeColumn.addEvent(eventToAdd);
    }
  }

  protected get columns(): PageColumn[] {
    return this._columns;
  }

  protected set columns(value: PageColumn[]) {
    this._columns = value;
  }

  get parentGroup(): any {
    return this._parentGroup;
  }

  set parentGroup(value: any) {
    this._parentGroup = value;
  }
}
