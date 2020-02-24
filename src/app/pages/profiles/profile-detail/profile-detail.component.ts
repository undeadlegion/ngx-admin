import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { UserProfile, UserActivityData, ActionItem, Message } from '../../../@core/data/user-activity-data'
import * as moment from 'moment'

@Component({
	selector: 'profile-detail',
	templateUrl: './profile-detail.component.html',
	styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent implements OnInit {

	userName: String
	userProfile: UserProfile
	userActions: ActionItem[]
	userSentMessages: Message[]
	userReceivedMessages: Message[]
	userMetrics = {}

	constructor(
		private userActivityService: UserActivityData,
		private route: ActivatedRoute,
		private location: Location,
	) { }

	ngOnInit() {
		this.getUserData()
	}

	getUserData() {
		const userName = this.route.snapshot.paramMap.get('userName')
		this.userName = userName
		console.log('[profile-detail] userName: ', userName)
		this.userActivityService.getUserProfile(userName)
			.subscribe((profile: UserProfile) => {
				this.userProfile = profile
				console.log('[profile-detail] loaded profile: ', profile.userID)
				const startOfWeek = moment().startOf('week')
				const today = moment()
				this.userActivityService.getUserActions(profile.userID, startOfWeek, today)
					.subscribe((actions: ActionItem[]) => {
						this.userActions = actions
						this.calculateMetrics()
						console.log('[profile-detail] loaded ', actions.length , 'actions ')
					})
				this.userActivityService.getUserSentMessages(profile.userID)
					.subscribe((messages: Message[]) => {
						this.userSentMessages = messages
						console.log('[profile-detail] loaded ', messages.length , ' sent messages')
					})
				this.userActivityService.getUserReceivedMessages(profile.userID)
					.subscribe((messages: Message[]) => {
						this.userReceivedMessages = messages
						console.log('[profile-detail] loaded ', messages.length, ' received messages')
					})
			})

	}

	calculateMetrics() {
		// dates for action filters
		const dayStart = moment().startOf('day')

		const weekStart = moment().day(0)
		const weekString = weekStart.toISOString().slice(0, 10) + '-D'

		const monthStart = moment().date(1)
		const monthString = monthStart.toISOString().slice(0, 10) + '-D'

		const month = moment().month()
		const dayOfMonth = moment().date()
		const totalDaysInMonth = monthStart.daysInMonth()

		const startDate = moment(this.userProfile.startDate).startOf('day').fromNow()

		// metrics for the week
		const actionsInWeek = this.userActions.filter((item) => item.propertyKey >= weekString)
		const dayOfWeek = moment().day() + 1

		const committedDaysInWeek = actionsInWeek.filter((action) => action.commitDate !== 'NULL').length
		const completedDaysInWeek = actionsInWeek.filter((action) => action.completionDate !== 'NULL').length

		// const averageCommitTimeInWeek = this.averageTime(actionsInWeek.map((action) => action.commitDate))
		// const averageCompletionTimeInWeek = this.averageTime(actionsInWeek.map((action) => action.completionDate))

		// metrics for the month
		const actionsInMonth = this.userActions.filter((item) => item.propertyKey >= monthString)
		const committedDaysInMonth = actionsInMonth.filter((action) => action.commitDate !== 'NULL').length
		const completedDaysInMonth = actionsInMonth.filter((action) => action.completionDate !== 'NULL').length
		
		// const averageCommitTimeInMonth = this.averageTime(actionsInMonth.map((action) => action.commitDate))
		// const averageCompletionTimeInMonth = this.averageTime(actionsInMonth.map((action) => action.completionDate))

		this.userMetrics['committedDaysInWeek'] = committedDaysInWeek
		this.userMetrics['committedDaysInMonth'] = committedDaysInMonth
		this.userMetrics['completedDaysInWeek'] = completedDaysInWeek
		this.userMetrics['completedDaysInMonth'] = completedDaysInMonth

	}

}
