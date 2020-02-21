import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { of as observableOf, from, Observable } from 'rxjs'
import { tap, filter, map } from 'rxjs/operators'
import { PeriodsService } from './periods.service'
import { UserProfile, ActionItem, Message, UserActivityData } from '../data/user-activity-data'
import * as Moment from 'moment'

@Injectable()
export class UserActivityService extends UserActivityData {
	data = {}

	constructor(private http: HttpClient, private periods: PeriodsService) {
		super()
	}

	getUserProfile(userName: string): Observable<UserProfile> {
		const url = 'https://dev.api.avaactions.com/server_service/tools/user'
		const params = new HttpParams()
			.set('userName', userName)
		return this.http.get<UserProfile>(url, { params })
			.pipe(
				tap(data => {
					console.info('[user-activity-service] getUserProfile: ', data)
					return data
				})
			)
	}

	getUserProfiles(type: string): Observable<UserProfile[]> {
		const inactiveDate = Moment().startOf('week').startOf('day').subtract(1, 'week').format()

		const url = 'https://dev.api.avaactions.com/server_service/tools/user'
		const params = new HttpParams()
			.set('userName', '*')
		return this.http.get<UserProfile[]>(url, { params })
			.pipe(
				map(data => {
					const sorted = data.sort((a: UserProfile, b: UserProfile) => {
							if (a.firstName < b.firstName) {
								return -1
							} else if (a.firstName > b.firstName) {
								return 1
							} else if (a.lastName < b.lastName) {
								return -1
							} else if (a.lastName > b.lastName) {
								return 1
							} else {
								return 0
							}
						})
					console.info('[user-activity-service] getUserProfiles sorted: ', sorted)
					return sorted
				}),
				map(data => {
					const filtered = data.filter(profile => {
						if (type === 'all') {
							return true
						} else if (type === 'active') {
							return profile.lastActive >= inactiveDate
						} else if (type === 'inactive') {
							return profile.lastActive < inactiveDate
						}
					})
					console.info('[user-activity-service] getUserProfiles filtered: ', filtered)
					return filtered
				})
			)
	}

	getUserActionsMap(): Observable<Map<string, ActionItem[]>> {
		const url = 'https://dev.api.avaactions.com/server_service/tools/goals'
		const params = new HttpParams()
			.set('userID', '*')
			.set('start', '2020-01-01')

		return this.http.get<ActionItem[]>(url, { params })
			.pipe(
				map(data => {
					const userActions = new Map<string, ActionItem[]>()
					for (const action of data['Items']) {
						const userID = action.userID
						let actions = userActions.get(userID)
						actions = actions ? [action].concat(actions) : [action]
						userActions.set(userID, actions)
					}
					console.info('[user-activity-service] getUserActionsMap: ', userActions)
					return userActions
				}),
			)
	}

	getUserActions(userID: string): Observable<ActionItem[]> {
		const url = 'https://dev.api.avaactions.com/server_service/tools/goals'
		const params = new HttpParams()
			.set('userID', '*')
			.set('start', '2020-01-01')

		return this.http.get<ActionItem[]>(url, { params })
			.pipe(
				map(data => {
					console.info('[user-activity-service] getUserActions: ', data['actions'])
					return data['actions']
				}),
			)

	}

	getUserSentMessages(userID: string): Observable<Message[]> {
		const url = 'https://dev.api.avaactions.com/server_service/tools/messages'
		const params = new HttpParams()
			.set('userID', userID)
			.set('requestType', 'loadSentMessages')

		return this.http.get<Message[]>(url, { params })
			.pipe(
				map(data => {
					console.info('[user-activity-service] getUserSentMessages', data['messages'])
					return data['messages']
				}),
			)
	}

	getUserReceivedMessages(userID: string): Observable<Message[]> {
		const url = 'https://dev.api.avaactions.com/server_service/tools/messages'
		const params = new HttpParams()
			.set('userID', userID)
			.set('requestType', 'loadReceivedMessages')

		return this.http.get<Message[]>(url, { params })
			.pipe(
				map(data => {
					console.info('[user-activity-service] getUserReceivedMessages', data['messages'])
					return data['messages']
				}),
			)
	}
}
