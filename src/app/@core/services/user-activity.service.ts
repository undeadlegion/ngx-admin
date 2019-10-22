import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { of as observableOf, from, Observable } from 'rxjs'
import { tap, filter, map } from 'rxjs/operators'
import { PeriodsService } from './periods.service'
import { UserProfile, ActionItem, UserActivityData } from '../data/user-activity'
import * as Moment from 'moment'

@Injectable()
export class UserActivityService extends UserActivityData {
	data = {}

	constructor(private http: HttpClient, private periods: PeriodsService) {
		super()
	}

	private fetchUserProfiles(): Observable<UserProfile[]> {
		console.log('FETCH user profiles')
		const url = 'https://dev.api.avaactions.com/profiles_service/tools/user?userName=*'
		return this.http.get<UserProfile[]>(url)
			.pipe(
				tap(results => {
						// console.log('Before: ', results)
						results.sort((a: UserProfile, b: UserProfile) => {
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
						// console.log('Sorted: ', results)
					}),
			)
	}
	private fetchUserProfile(userName): Observable<UserProfile> {
		console.log('FETCH user profiles')
		const url = 'https://dev.api.avaactions.com/profiles_service/tools/user?userName=' + userName
		return this.http.get<UserProfile>(url)
	}

	getUserProfile(userName: string): Observable<UserProfile> {
		return this.fetchUserProfile(userName)
	}

	getUserProfiles(type: string): Observable<UserProfile[]> {
		console.log('getUserProfiles for: ', type)
		const inactiveDate = Moment().startOf('week').startOf('day').subtract(1, 'week').format()
		return this.fetchUserProfiles()
			.pipe(
				map(results => {
					return results.filter(profile => {
						if (type === 'all') {
							return true
						} else if (type === 'active') {
							return profile.lastActive >= inactiveDate
						} else if (type === 'inactive') {
							return profile.lastActive < inactiveDate
						}
					})
				}),
			)
	}

	getUserActionsMap(): Observable<Map<string, ActionItem[]>> {
		const url = 'https://dev.api.avaactions.com/goals_service/tools/goals?userID=*'
		return this.http.get<ActionItem[]>(url)
			.pipe(
				map(data => {
					console.log('getUserActions data: ', data)
					const userActions = new Map<string, ActionItem[]>()
					for (const action of data['Items']) {
						const userID = action.userID
						let actions = userActions.get(userID)
						actions = actions ? [action].concat(actions) : [action]
						userActions.set(userID, actions)
					}
					console.log('getUserActions results: ', userActions)

					return userActions
				}),
			)
	}

	getUserActions(userID: string): Observable<ActionItem[]> {
		const url = 'https://dev.api.avaactions.com/goals_service/tools/goals?userID=' + userID
		return this.http.get<ActionItem[]>(url)
			.pipe(
				map(data => {
					console.log('getUserActions results: ', data['actions'].length)
					return data['actions']
				}),
			)

	}


}
