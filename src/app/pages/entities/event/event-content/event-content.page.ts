import { EventService } from 'src/app/pages/entities/event/event.service';
import { Event } from './../event.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-event-content',
  templateUrl: './event-content.page.html',
  styleUrls: ['./event-content.page.scss'],
})
export class EventContentPage implements OnInit {
  event: Event = {};

  constructor(    
    private navController: NavController,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController) 
    { }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.event = response.data;
      console.log(this.event);
    });
  }

}
