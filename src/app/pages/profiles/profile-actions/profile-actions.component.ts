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

  scopes = [
    { value: 'day', viewValue: 'Day'},
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
    this.selectedScopeControl = new FormControl('day')
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

    this.startDateControl.valueChanges.pipe(
      tap(() => {
        console.log('[profile-actions] start date changed: ', this.startDateControl.value)
        this.loadUserActions().subscribe()
      })
    ).subscribe()

    this.endDateControl.valueChanges.pipe(
      tap(() => {
        console.log('[profile-actions] end date changed: ', this.endDateControl.value)
        this.loadUserActions().subscribe()
      })
    ).subscribe()

    this.selectedScopeControl.valueChanges.pipe(
      tap(() => {
        console.log('[profile-actions] selected scope changed: ', this.selectedScopeControl.value)
        this.loadUserActions().subscribe()
      })
    ).subscribe()
  }

  loadUserActions(): Observable<LoadedActionItems> {
    console.log('[profile-actions] loadUserActions')
    return this.dataSource.loadSortedActionItems(
      this.userProfile.userID,
      this.startDateControl.value,
      this.endDateControl.value,
      this.selectedScopeControl.value,
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
