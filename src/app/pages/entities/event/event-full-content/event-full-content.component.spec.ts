import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventFullContentComponent } from './event-full-content.component';

describe('EventFullContentComponent', () => {
  let component: EventFullContentComponent;
  let fixture: ComponentFixture<EventFullContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventFullContentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFullContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
