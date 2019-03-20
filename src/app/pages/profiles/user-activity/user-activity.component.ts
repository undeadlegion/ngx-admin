import { Component, OnDestroy } from '@angular/core'
import { NbThemeService } from '@nebular/theme'
import { takeWhile } from 'rxjs/operators'

import { UserProfile, UserActivityData, UserActive } from '../../../@core/data/user-activity'

@Component({
	selector: 'ngx-user-activity',
	styleUrls: ['./user-activity.component.scss'],
	templateUrl: './user-activity.component.html',
})
export class ECommerceUserActivityComponent implements OnDestroy {

	private alive = true

	userActivity: UserActive[] = []
	userProfiles: UserProfile[] = []
	type = 'month'
	types = ['week', 'month', 'year']
	currentTheme: string

	constructor(private themeService: NbThemeService,
				private userActivityService: UserActivityData) {
		this.themeService.getJsTheme()
			.pipe(takeWhile(() => this.alive))
			.subscribe(theme => {
				this.currentTheme = theme.name
		})

		this.getUserActivity(this.type)
		this.getUserProfiles()
	}

	getUserActivity(period: string) {
		this.userActivityService.getUserActivityData(period)
			.pipe(takeWhile(() => this.alive))
			.subscribe(userActivityData => {
				this.userActivity = userActivityData
			})
	}


	getUserProfiles() {
		this.userActivityService.getUserProfiles()
			.subscribe((profiles: UserProfile[]) => {
				console.log('Loaded ', profiles.length ,'user profiles')
				this.userProfiles = profiles
			})
	}

	ngOnDestroy() {
		this.alive = false
	}
}
