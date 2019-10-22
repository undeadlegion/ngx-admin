import { Component, OnDestroy } from '@angular/core'
import { NbThemeService } from '@nebular/theme'
import { takeWhile } from 'rxjs/operators'

import { UserProfile, UserActivityData, ActionItem } from '../../../@core/data/user-activity-data'

@Component({
	selector: 'ngx-user-activity',
	styleUrls: ['./user-activity.component.scss'],
	templateUrl: './user-activity.component.html',
})
export class ECommerceUserActivityComponent implements OnDestroy {

	private alive = true

	userActions: ActionItem[] = []
	userProfiles: UserProfile[] = []
	userActionsMap: Map<string, ActionItem[]> = new Map<string, ActionItem[]>()
	type = 'active'
	types = ['active', 'inactive', 'all']
	currentTheme: string

	constructor(private themeService: NbThemeService,
				private userActivityService: UserActivityData) {
		this.themeService.getJsTheme()
			.pipe(takeWhile(() => this.alive))
			.subscribe(theme => {
				this.currentTheme = theme.name
		})

		this.getUserProfiles(this.type)
	}

	getUserActionsMap() {
		this.userActivityService.getUserActionsMap()
			.subscribe((map: Map<string, ActionItem[]>) => {
				console.log('Loaded ', map.size , 'actions for ', map.keys.length, ' users')
				this.userActionsMap = map
			})
	}

	getUserActions(userID: string) {
		// const userActions = this.userActionsMap.get(userID)
		this.userActivityService.getUserActions(userID)
			.subscribe((actions: ActionItem[]) => {
				console.log('User: ', userID, ' has ', actions.length, ' actions')
				this.userActions = actions
			})
	}

	getUserProfiles(type: string) {
		this.userActivityService.getUserProfiles(type)
			.subscribe((profiles: UserProfile[]) => {
				console.log('Loaded ', profiles.length , 'user profiles')
				this.userProfiles = profiles
			})
	}

	ngOnDestroy() {
		this.alive = false
	}
}
