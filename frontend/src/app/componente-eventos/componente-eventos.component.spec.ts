import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEventosComponent } from './componente-eventos.component';

describe('ComponenteEventosComponent', () => {
  let component: ComponenteEventosComponent;
  let fixture: ComponentFixture<ComponenteEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEventosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComponenteEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
