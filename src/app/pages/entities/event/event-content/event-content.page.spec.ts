import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventContentPage } from './event-content.page';

describe('EventContentPage', () => {
  let component: EventContentPage;
  let fixture: ComponentFixture<EventContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventContentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
