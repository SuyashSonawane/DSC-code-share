import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantPushPage } from './instant-push.page';

describe('InstantPushPage', () => {
  let component: InstantPushPage;
  let fixture: ComponentFixture<InstantPushPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantPushPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantPushPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
