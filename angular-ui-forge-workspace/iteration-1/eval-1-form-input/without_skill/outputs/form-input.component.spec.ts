import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInputComponent } from './form-input.component';
import { By } from '@angular/platform-browser';

describe('FormInputComponent', () => {
  let component: FormInputComponent;
  let fixture: ComponentFixture<FormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default state', () => {
    expect(component.type).toBe('text');
    expect(component.state).toBe('default');
    expect(component.disabled).toBe(false);
    expect(component.required).toBe(false);
  });

  it('should generate unique IDs for label association', () => {
    expect(component.inputId).toMatch(/^ui-form-input-\d+$/);
    const input = fixture.debugElement.query(By.css('input'));
    const label = fixture.debugElement.query(By.css('label'));
    expect(input.nativeElement.id).toBe(component.inputId);
    expect(label.nativeElement.getAttribute('for')).toBe(component.inputId);
  });

  it('should float the label when the input has a value', () => {
    component.value = 'test';
    fixture.detectChanges();
    expect(component.hasValue).toBe(true);
    expect(component.hostClass).toContain('ui-form-input--filled');
  });

  it('should set aria-invalid when in error state', () => {
    component.state = 'error';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
  });

  it('should display error message in error state', () => {
    component.state = 'error';
    component.errorMessage = 'This field is required';
    fixture.detectChanges();
    const desc = fixture.debugElement.query(By.css('.ui-form-input__description'));
    expect(desc.nativeElement.textContent.trim()).toBe('This field is required');
    expect(desc.nativeElement.getAttribute('role')).toBe('alert');
  });

  it('should display success message in success state', () => {
    component.state = 'success';
    component.successMessage = 'Looks good!';
    fixture.detectChanges();
    const desc = fixture.debugElement.query(By.css('.ui-form-input__description'));
    expect(desc.nativeElement.textContent.trim()).toBe('Looks good!');
  });

  it('should display help text when no validation state', () => {
    component.helpText = 'Enter your email address';
    fixture.detectChanges();
    const desc = fixture.debugElement.query(By.css('.ui-form-input__description'));
    expect(desc.nativeElement.textContent.trim()).toBe('Enter your email address');
  });

  it('should set aria-describedby when description is present', () => {
    component.helpText = 'Some help';
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-describedby')).toBe(component.descriptionId);
  });

  it('should set disabled state', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBe(true);
    expect(component.hostClass).toContain('ui-form-input--disabled');
  });

  it('should set required attribute and show asterisk', () => {
    component.required = true;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.required).toBe(true);
    const asterisk = fixture.debugElement.query(By.css('.ui-form-input__required'));
    expect(asterisk).toBeTruthy();
  });

  it('should emit valueChange on input', () => {
    const spy = jest.spyOn(component.valueChange, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'hello';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalledWith('hello');
  });

  it('should emit focused and blurred events', () => {
    const focusSpy = jest.spyOn(component.focused, 'emit');
    const blurSpy = jest.spyOn(component.blurred, 'emit');

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new FocusEvent('focus'));
    expect(focusSpy).toHaveBeenCalled();
    expect(component.isFocused).toBe(true);

    input.nativeElement.dispatchEvent(new FocusEvent('blur'));
    expect(blurSpy).toHaveBeenCalled();
    expect(component.isFocused).toBe(false);
  });

  it('should support number type with min/max/step', () => {
    component.type = 'number';
    component.min = 0;
    component.max = 100;
    component.step = 5;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.type).toBe('number');
    expect(input.nativeElement.getAttribute('min')).toBe('0');
    expect(input.nativeElement.getAttribute('max')).toBe('100');
    expect(input.nativeElement.getAttribute('step')).toBe('5');
  });

  it('should resolve inputmode based on type', () => {
    component.type = 'email';
    expect(component.resolvedInputMode).toBe('email');

    component.type = 'tel';
    expect(component.resolvedInputMode).toBe('tel');

    component.type = 'number';
    expect(component.resolvedInputMode).toBe('decimal');

    component.type = 'text';
    expect(component.resolvedInputMode).toBeUndefined();
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should handle null value', () => {
      component.writeValue(null as unknown as string);
      expect(component.value).toBe('');
    });

    it('should register onChange callback', () => {
      const fn = jest.fn();
      component.registerOnChange(fn);
      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.value = 'new';
      input.nativeElement.dispatchEvent(new Event('input'));
      expect(fn).toHaveBeenCalledWith('new');
    });

    it('should register onTouched callback', () => {
      const fn = jest.fn();
      component.registerOnTouched(fn);
      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.dispatchEvent(new FocusEvent('blur'));
      expect(fn).toHaveBeenCalled();
    });

    it('should set disabled state via CVA', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });
  });
});
