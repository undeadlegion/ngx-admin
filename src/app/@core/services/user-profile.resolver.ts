import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UserProfile, UserActivityData } from '../data/user-activity-data'
import { Observable } from 'rxjs';

@Injectable()
export class UserProfileResolver implements Resolve<UserProfile> {
    constructor(private userActivityService:UserActivityData) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserProfile> {
        const userName = route.paramMap.get('userName')
        return this.userActivityService.getUserProfile(userName)
    }
}

