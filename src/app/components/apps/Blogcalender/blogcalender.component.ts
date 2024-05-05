import {Component, ViewEncapsulation, ViewChild, TemplateRef, OnInit} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { BlogEventService } from '../../../shared/services/blog/blogEvent.service';
import {Router, Routes} from '@angular/router';


export interface BlogEvent {
  id?: string; // Optional for when creating a new event
  title: string;
  description: string;
  eventType: BlogEventType[];
  startDate: Date;
  endDate: Date;
  participants?: string[]; // Array of user IDs who are participating
  image?: string; // URL to an image for the event
  // ... add any other properties as needed
}
export enum BlogEventType {
  STORY_SHARING=0,
  CHALLENGE=1,
  COMPETITION=2
}
const colors: any = {
  red: {
    primary: '#ff7675',
    secondary: '#fab1a0'
  },
  green:{
    primary: '#00b894',
    secondary: '#55efc4'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calender',
  templateUrl: './blogcalender.component.html',
  styleUrls: ['./blogcalender.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogcalenderComponent implements OnInit {
  ngOnInit(): void {
    this.fetchBlogEvents();
  }
  @ViewChild('modalContent',{static: false})

  modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [

    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];

  fetchBlogEvents(): void {
    this.blogEventService.getBlogEvents().subscribe((events: BlogEvent[]) => {
      this.events = events.map((event: BlogEvent) => {
        let colorevent: any;

        switch (event.eventType.toString()) {
          case BlogEventType[BlogEventType.STORY_SHARING]:
            colorevent = colors.red;

            break;
          case BlogEventType[BlogEventType.CHALLENGE]:
            colorevent = colors.blue;
            //console.log('CHALLENGE');
            //console.log(colorevent);
            break;
          case BlogEventType[BlogEventType.COMPETITION]:
            colorevent = colors.green;
            //console.log(colorevent);
            //console.log('COMPETITION');
            break;
          default:
            colorevent = colors.yellow;
            break;
        }
        //console.log(colorevent);
        return {
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          title: event.title,
          id:event.id,
          color: colorevent,
          // Set other properties as needed
        } as CalendarEvent;
      });
    });
  }

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal,private blogEventService: BlogEventService,private router: Router) { }
  redirectToProductDetails(eventId: string) {

   //console.log(eventId);
    this.router.navigate(['/blog/product-details'], { queryParams: { eventId: eventId } });
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
  }
}
