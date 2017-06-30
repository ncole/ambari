/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http; //www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, Input, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup} from '@angular/forms';
import {ComponentActionsService} from '@app/services/component-actions.service';
import {FilteringService} from '@app/services/filtering.service';
import {MenuButtonComponent, menuButtonComponentOptions} from '@app/components/menu-button/menu-button.component';

@Component(Object.assign({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterButtonComponent),
      multi: true
    }
  ]
}, menuButtonComponentOptions, {
  selector: 'filter-button',
}))
export class FilterButtonComponent extends MenuButtonComponent implements ControlValueAccessor {

  constructor(protected actions: ComponentActionsService, private filtering: FilteringService) {
    super(actions);
  }

  ngAfterViewInit() {
    const callback = this.customOnChange ?
      (value => this.customOnChange(value)) : (() => this.filtering.filteringSubject.next(null));
    this.form.controls[this.filterName].valueChanges.subscribe(callback);
  }

  @Input()
  filterName: string;

  @Input()
  customOnChange: (value: any) => void;

  @Input()
  form: FormGroup;

  private onChange: (fn: any) => void;

  readonly isFilter = true;

  get filterInstance(): any {
    return this.filtering.filters[this.filterName];
  }

  get value(): any {
    return this.filterInstance.selectedValue;
  }

  set value(newValue: any) {
    if (this.filtering.valueHasChanged(this.filterInstance.selectedValue, newValue)) {
      this.filterInstance.selectedValue = newValue;
      this.onChange(newValue);
    }
  }

  writeValue(options: any) {
    const value = options && options.value;
    if (this.filtering.valueHasChanged(this.filterInstance.selectedValue, value)) {
      this.filterInstance.selectedValue = value;
      this.filterInstance.selectedLabel = options.label;
    }
  }

  registerOnChange(callback: any): void {
    this.onChange = callback;
  }

  registerOnTouched() {
  }

}