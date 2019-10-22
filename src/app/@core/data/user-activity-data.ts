import { Observable } from 'rxjs'

export interface UserProfile {
	userID: string
	endpointID: string
	topicID: string
	modifiedDate: string
	startDate: string
	firstName: string
	lastName: string
	userName: string
	points: UserPoints
	lastActive: string

	// reminders
	// picture
	// tags
}

export interface UserPoints {
	xp: number
	ions: number
	ionCapacity: number
	chargeLevel: number
	chargeRate: number
	chargeCapacity: number
	streak: number
	wins: number
	mapID: string
}

export interface ActionItem {
	userID: string
	propertyKey: string
	commitDate: string
	modifiedDate: string
	completionDate: string
	scope: string
	first: Objective
	second: Objective
	third: Objective
}

export interface Objective {
	completed: boolean
	text: string
	editDate: string
	completionDate: string
}

export abstract class UserActivityData {
	abstract getUserProfile(userID: string): Observable<UserProfile>
	abstract getUserProfiles(filter: string): Observable<UserProfile[]>
	abstract getUserActionsMap(): Observable<Map<string, ActionItem[]>>
	abstract getUserActions(userID: string): Observable<ActionItem[]>
}
