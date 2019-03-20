import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { of as observableOf, from, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { PeriodsService } from './periods.service'
import { UserProfile, UserActive, UserActivityData } from '../data/user-activity'

@Injectable()
export class UserActivityService extends UserActivityData {

	private getRandom = (roundTo: number) => Math.round(Math.random() * roundTo)
	private generateUserActivityRandomData(date) {
		return {
			date,
			pagesVisitCount: this.getRandom(1000),
			deltaUp: this.getRandom(1) % 2 === 0,
			newVisits: this.getRandom(100),
		}
	}

	data = {}

	constructor(private http: HttpClient, private periods: PeriodsService) {
		super()
		this.data = {
			week: this.getDataWeek(),
			month: this.getDataMonth(),
			year: this.getDataYear(),
			profiles: this.fetchUserProfiles(),
		}
	}

	private getDataWeek(): UserActive[] {
		return this.periods.getWeeks().map((week) => {
			return this.generateUserActivityRandomData(week)
		})
	}

	private getDataMonth(): UserActive[] {
		const currentDate = new Date()
		const days = currentDate.getDate()
		const month = this.periods.getMonths()[currentDate.getMonth()]

		return Array.from(Array(days)).map((_, index) => {
			const date = `${index + 1} ${month}`

			return this.generateUserActivityRandomData(date)
		})
	}

	private getDataYear(): UserActive[] {
		return this.periods.getYears().map((year) => {
			return this.generateUserActivityRandomData(year)
		})
	}

	private fetchUserProfiles(): Observable<UserProfile[]> {
		const url = 'https://c3yqzrjoi8.execute-api.us-east-1.amazonaws.com/dev/tools/user?userName=*'
		return this.http.get<UserProfile[]>(url)
			.pipe(
				tap(results => {
						console.log('Before: ', results)
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
						console.log('Sorted: ', results)
					}),
			)
		// fetch(url)
		// 	.then((results) => {
		// 		console.log('success!')

		// 		results.json().then((data) => {
		// 			console.log('fetched profiles: ', data)
		// 			console.log('profiles: ', userProfiles)
		// 			const userNames: string[] = userProfiles.map((profile: any): string => {
		// 				return profile.userName
		// 			})
		// 			return userProfiles
		// 		})
		// 	})
	}

	getUserActivityData(period: string): Observable<UserActive[]> {
		return observableOf(this.data[period])
	}

	getUserProfiles(): Observable<UserProfile[]> {
		return this.fetchUserProfiles()
	}
}
