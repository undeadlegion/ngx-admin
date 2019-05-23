import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'

import { PagesComponent } from './pages.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ProfilesComponent } from './profiles/profiles.component'
import { ProfileDetailComponent } from './profiles/profile-detail/profile-detail.component'

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
			path: 'profiles/:userName',
			component: ProfileDetailComponent,
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
