import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { LoadedActionItems, UserActionsDataSource } from '../../../@core/services/user-actions.datasource';
import { UserActivityData, ActionItem } from '../../../@core/data/user-activity-data';
import { UserProfile } from '../../../@core/data/user-activity-data';
import { MatPaginator, MatSort } from '@angular/material';
import { delay, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.scss']
})
export class ProfileActionsComponent implements AfterViewInit, OnInit {
  dataSource: UserActionsDataSource;
  displayColumns = ['date', 'actions']
  userProfile: UserProfile
  rowCount: number
  minStartDate: moment.Moment
  maxStartDate: moment.Moment
  minEndDate: moment.Moment
  maxEndDate: moment.Moment
  startDateControl: FormControl
  endDateControl: FormControl
  selectedScopeControl: FormControl
  numberControl: FormControl

  scopes = [
    { value: 'date', viewValue: 'Day'},
    { value: 'week', viewValue: 'Week'},
    { value: 'month', viewValue: 'Month'},
  ]

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator
  @ViewChild(MatSort, {static: false}) sort: MatSort

  constructor(
    private route: ActivatedRoute,
    private userActivityService: UserActivityData) {
  }

  ngOnInit() {
    console.log('[profile-actions] ngOnInit')
    this.userProfile = this.route.snapshot.data['userProfile']
    console.log('[profile-actions] resolved userProfile: ', this.userProfile) 

    this.dataSource = new UserActionsDataSource(this.userActivityService)
    this.startDateControl = new FormControl(moment())
    this.endDateControl = new FormControl(moment())
    this.selectedScopeControl = new FormControl('date')
    this.numberControl = new FormControl(moment().date())
    this.minStartDate = moment('2020-01-01')
    this.maxStartDate = moment().add(1, 'months').endOf('month')
    this.minEndDate = moment('2020-01-01')
    this.maxEndDate = moment().add(1, 'months').endOf('month')
  }

  ngAfterViewInit() {
    console.log('[profile-actions] ngAfterViewInit')
    this.sort.sortChange.pipe(
      tap(() => {
        console.log('[profile-actions] loading sorted actions')
        this.loadUserActions().subscribe()
      })
    ).subscribe()

    this.paginator.page.pipe(
      startWith(null),
      delay(0),
      tap(() => {
        console.log('[profile-actions] loading page ', this.paginator.pageIndex)
        this.loadUserActions().subscribe()
      })
    ).subscribe()

    this.selectedScopeControl.valueChanges.pipe(
      tap(() => {
        console.log('[profile-actions] selected scope changed: ', this.selectedScopeControl.value)
        const number = this.numberFrom(this.selectedScopeControl.value)
        const startDate = this.startDateFrom(this.selectedScopeControl.value)
        const endDate = this.endDateFrom(this.selectedScopeControl.value)

        this.numberControl.setValue(number, {emitEvent: false})
        this.startDateControl.setValue(startDate, {emitEvent: false})
        this.endDateControl.setValue(endDate, {emitEvent: false})
        this.loadUserActions().subscribe()
      })
    ).subscribe()

    this.numberControl.valueChanges.pipe(
      tap(() => {
        console.log('[profile-actions] number changed: ', this.numberControl.value)
        const number = this.selectedScopeControl.value === 'month' ? this.numberControl.value - 1 : this.numberControl.value
        const startDate = this.startDateFrom(
          this.selectedScopeControl.value,
          undefined,
          number)
        const endDate = this.endDateFrom(
          this.selectedScopeControl.value,
          undefined,
          number)

        this.startDateControl.setValue(startDate, {emitEvent: false})
        this.endDateControl.setValue(endDate, {emitEvent: false})
        this.loadUserActions().subscribe()
      })
    ).subscribe()

    this.startDateControl.valueChanges.pipe(
      tap(() => {
        console.log('[profile-actions] start date changed: ', this.startDateControl.value)
        const number = this.numberFrom(
          this.selectedScopeControl.value,
          this.startDateControl.value)
        const endDate = this.endDateFrom(
          this.selectedScopeControl.value,
          this.startDateControl.value,
          number)

        this.numberControl.setValue(number, {emitEvent: false})
        this.endDateControl.setValue(endDate, {emitEvent: false})
        this.loadUserActions().subscribe()
      })
    ).subscribe()

    this.endDateControl.valueChanges.pipe(
      tap(() => {
        const number = this.numberFrom(
          this.selectedScopeControl.value,
          undefined,
          this.endDateControl.value)
        const startDate = this.startDateFrom(
          this.selectedScopeControl.value,
          this.endDateControl.value,
          number)

        this.numberControl.setValue(number, {emitEvent: false})
        this.startDateControl.setValue(startDate, {emitEvent: false})
        this.loadUserActions().subscribe()
      })
    ).subscribe()
  }

  numberFrom(scope: string, start?: moment.Moment, end?: moment.Moment): number {
    let date = start && moment(start) || end && moment(end) || moment()
    if (end != undefined) {
      date.add(-1, 'day')
    }

    const number = date.get(scope as moment.unitOfTime.All)
    switch (scope) {
      case 'date':
        return number
      case 'week':
        return number
      case 'month':
        return number + 1
      default:
        return -1
    }
  }

  startDateFrom(scope: string, date?: moment.Moment, number?: number): moment.Moment {
    let startDate = moment(date) || moment()
    startDate = startDate.startOf(scope as moment.unitOfTime.StartOf)
    if (number != undefined) {
      startDate = startDate.set(scope as moment.unitOfTime.All, number)
    }

    switch (scope) {
      case 'date':
        return startDate
      case 'week':
        return startDate.add(1, 'day')
      case 'month':
        return startDate
      default:
        return moment()
    }
  }

  endDateFrom(scope: string, date?: moment.Moment, number?: number): moment.Moment {
    let endDate = moment(date) || moment()
    if (number != undefined) {
      endDate = endDate.set(scope as moment.unitOfTime.All, number)
    }
    endDate = endDate.endOf(scope as moment.unitOfTime.StartOf)

    switch (scope) {
      case 'date':
        return endDate
      case 'week':
        return endDate.add(1, 'day')
      case 'month':
        return endDate
      default:
        return moment()
    }
  }

  filterStartDate = (date: moment.Moment): boolean => {
    const scope = this.selectedScopeControl.value
    switch (scope) {
      case 'date':
        return true
      case 'week':
        return date.day() === 1
      case 'month':
        return date.date() === 1
      default:
        return false
    }
  }

  filterEndDate = (date: moment.Moment): boolean => {
    const scope = this.selectedScopeControl.value
    switch (scope) {
      case 'date':
        return true
      case 'week':
        return date.day() === 0
      case 'month':
        return date.date() === date.daysInMonth()
      default:
        return false
    }
  }

  loadUserActions(): Observable<LoadedActionItems> {
    console.log('[profile-actions] loadUserActions')
    return this.dataSource.loadSortedActionItems(
      this.userProfile.userID,
      this.startDateControl.value,
      this.endDateControl.value,
      'day',
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    ).pipe(
      tap(loaded => {
        console.log('[profile-actions] loaded ', loaded.items.length, '/', loaded.totalItems, ' total action items')
        this.rowCount = loaded.totalItems
      })
    )
  }

  onRowClicked(row: any) {
    console.log(' row clicked: ' + JSON.stringify(row, null, 2))
  }
}
