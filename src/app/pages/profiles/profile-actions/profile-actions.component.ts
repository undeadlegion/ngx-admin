import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserActionsDataSource } from '../../../@core/services/user-actions.datasource';
import { UserActivityService } from '../../../@core/services/user-activity.service';
import { UserActivityData } from '../../../@core/data/user-activity-data';
import { UserProfile } from '../../../@core/data/user-activity-data';

@Component({
  selector: 'profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.scss']
})
export class ProfileActionsComponent implements OnInit {
  dataSource: UserActionsDataSource;
  displayColumns = ['date', 'actions']
  userProfile: UserProfile

  constructor(
    private route: ActivatedRoute,
    private userActivityService: UserActivityData) {
  }

  ngOnInit() {
    this.userProfile = this.route.snapshot.data['userProfile']
    this.dataSource = new UserActionsDataSource(this.userActivityService)
    this.dataSource.loadActionItems(this.userProfile.userID)

    console.log('[profile-actions] userProfile: ', this.userProfile) 
  }

  onRowClicked(row: any) {
    console.log(' row clicked: ' + row)
  }
}
