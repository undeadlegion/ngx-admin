import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserActionsDataSource } from '../../../@core/services/user-actions.datasource';
import { UserActivityService } from '../../../@core/services/user-activity.service';
import { UserActivityData, ActionItem } from '../../../@core/data/user-activity-data';
import { UserProfile } from '../../../@core/data/user-activity-data';
import { MatPaginator, MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    this.loadUserActions('desc').subscribe(items => this.rowCount = items.length)
  }

  ngAfterViewInit() {
    console.log('[profile-actions] ngAfterViewInit')
    this.sort.sortChange.pipe(
      tap(() => console.log('[profile-actions] loading sorted actions')),
      tap(() => this.loadUserActions(this.sort.direction))
    ).subscribe()
  }

  loadUserActions(asc: string): Observable<ActionItem[]> {
    console.log('[profile-actions] loadUserActions: ', asc)
    return this.dataSource.loadSortedActionItems(this.userProfile.userID, asc)
  }

  onRowClicked(row: any) {
    console.log(' row clicked: ' + row)
  }
}
