import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserActionsDataSource } from '../../../@core/services/user-actions.datasource';
import { UserActivityService } from '../../../@core/services/user-activity.service';
import { UserActivityData } from '../../../@core/data/user-activity-data';
import { UserProfile } from '../../../@core/data/user-activity-data';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.scss']
})
export class ProfileActionsComponent implements AfterContentInit, OnInit {
  dataSource: UserActionsDataSource;
  displayColumns = ['date', 'actions']
  userProfile: UserProfile
  rowCount: number

  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator

  constructor(
    private route: ActivatedRoute,
    private userActivityService: UserActivityData) {
  }

  ngOnInit() {
    this.userProfile = this.route.snapshot.data['userProfile']
    this.dataSource = new UserActionsDataSource(this.userActivityService)
    this.dataSource.loadActionItems(this.userProfile.userID).subscribe(
      items => { this.rowCount = items.length }
    )

    console.log('[profile-actions] userProfile: ', this.userProfile) 
  }

  ngAfterContentInit() {
    console.log('[profile-actions] ngAfterContentInit')
    console.log('[profile-actions] paginator', this.paginator)
  }

  onRowClicked(row: any) {
    console.log(' row clicked: ' + row)
  }
}
