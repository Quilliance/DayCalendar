import {calendarData} from "./DayCalendarDummyData";
import {Component} from "react";
import * as React from "react";
import * as d3 from 'd3';
import $ from 'jquery';
import {EventContainer} from "./events/EventContainer";
import {DayCalendarScope} from "./scope/DayCalendarScope";
import {DayCalendarEvent} from "./events/DayCalendarEvent";
import {DrawDimensions} from "./draw/DrawDimensions";
import {CalendarPage} from "./draw/CalendarPage";
import {DrawContext} from "./draw/DrawContext";
import moment, {Moment} from "moment";


export class DayCalendar extends Component<any, any>{
  /** the container for events */
  private _container = new EventContainer(calendarData.events);
  /** the active scope */
  private _activeCalendarScope = new DayCalendarScope();
  /** the events on active display */
  private _displayEvents: DayCalendarEvent[] = [];

  /** the basic svg element */
  private svg: any;
  /** the defs of the svg */
  private defs: any;
  /** all dimensions of the drawing */
  private dimensions = new DrawDimensions();
  /** the core group */
  private coreGroup: any;
  /** the current state of display */
  private displayMode = 'single';

  /** returns the display date
   * The first date of the cope
   */
  protected get displayDate(): Moment {
    return this._activeCalendarScope.start;
  }

  /** constructor with properties */
  constructor(
    props: Readonly<any> | any
  ) {
    super(props);
    // filter the display events
    this._displayEvents = this.container.getEventsForTimeRange(
      this.activeCalendarScope.start, this.activeCalendarScope.end
    )
  }
  /** @brief select handler for scope button */
  scopeButtonSelectHandler(scope: string) {
    console.log(this.container);
  }
  /** creates the header button row */
  constructHeader() {
    return (
      <div className="header">
        <button type={'button'} className={'scope-button'}>
          <span className={'icon-icon_back'}/>
        </button>
        <div>
          <span className="date">26/08/2021</span>
        </div>
        <button type={'button'} className={'scope-button'}>
          <span className={'icon-icon_forward'}/>
        </button>
      </div>
    )
  }

  /** constructs an empty view */
  constructEmptyView() {
    return (<div className="calendar-tile">) + (</div>)
  }
  /** prepares a iew for today */
  constructTodayView() {
    return (
      <div className="calendar-tile">
        { this.constructHeader() }
        <div id="tile-calendar-draw-viewport" className="draw-viewport"></div>
      </div>
    )
  }

  render() {
    switch (this.activeCalendarScope.specifier) {
      case 'today':
        return this.constructTodayView();
    }
    return this.constructEmptyView();
  }
  // any additional drawing
  componentDidMount() {
    const viewportElement = $('#tile-calendar-draw-viewport');
    const width = viewportElement.width();
    const height = viewportElement.height();

    if (width === undefined || height === undefined) {
      throw new Error('cannot get width or height of container element');
    }
    this.dimensions.width = width as number;
    this.dimensions.height = height as number;

    // add svg
    const svg = d3.select(viewportElement[0])
        .append('svg');
    // set dimensions
    svg.attr('width', this.dimensions.width + 'px').attr('height', this.dimensions.height + 'px');
    this.svg = svg;

    // check which display mode we are in
    switch (this.displayMode) {
      case 'single':
        this.drawSingleDayDisplay();
        break;
    }
  }
  /** creates the svg with the core group */
  private createDrawingAndCoreGroup() {
    const svg = this.svg;
    // the defs
    const defs = svg.append('defs');
    this.defs = defs;
    // create the core group
    this.coreGroup = svg.append('g')
        .attr('transform', `translate(${this.dimensions.padding} ${this.dimensions.padding})`)
        .attr('class', 'core-group');
  }
  /** draw for single day display */
  drawSingleDayDisplay() {
    this.createDrawingAndCoreGroup();
    // create the calendar page
    const singleCalendarPage = new CalendarPage(this.displayDate);
    singleCalendarPage.parentGroup = this.coreGroup;
    singleCalendarPage.events = this._displayEvents;
    // draw the page into the core group
    singleCalendarPage.draw(new DrawContext(this.dimensions, this.defs));
  }

  protected get container(): EventContainer {
    return this._container;
  }

  protected get activeCalendarScope(): DayCalendarScope {
    return this._activeCalendarScope;
  }
}
