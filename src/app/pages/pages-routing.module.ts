import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'

import { PagesComponent } from './pages.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ProfilesComponent } from './profiles/profiles.component'
import { ProfileDetailComponent } from './profiles/profile-detail/profile-detail.component'
import { ProfileMessagesComponent } from './profiles/profile-messages/profile-messages.component'
import { ProfileActionsComponent } from './profiles/profile-actions/profile-actions.component'

import { UserProfileResolver } from '../@core/services/user-profile.resolver'
import { ActionsComponent } from './actions/actions/actions.component'

const routes: Routes = [{
	path: '',
	component: PagesComponent,
	children: [
		{
			path: 'dashboard',
			component: DashboardComponent,
		},
		{
			path: 'profiles',
			component: ProfilesComponent,
		},
		{
			path: 'actions',
			component: ActionsComponent
		},
		{
			path: 'profiles/:userName',
			component: ProfileDetailComponent,
		},
		{
			path: 'profiles/:userName/messages',
			component: ProfileMessagesComponent,
		},
		{
			path: 'profiles/:userName/actions',
			component: ProfileActionsComponent,
			resolve: {
				userProfile: UserProfileResolver
			}
		},
		{
			path: '',
			redirectTo: 'dashboard',
			pathMatch: 'full',
		},
	],
}]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule {
}
