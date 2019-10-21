import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ThemeModule } from '../../@theme/theme.module'
import { NbCardModule } from '@nebular/theme'
import { RouterModule, Routes } from '@angular/router'

import { ProfilesComponent } from './profiles.component'
import { ECommerceUserActivityComponent } from './user-activity/user-activity.component'
import { ProfileDetailComponent } from './profile-detail/profile-detail.component'

@NgModule({
	imports: [
		CommonModule,
		ThemeModule,
		RouterModule,
		NbCardModule,
	],
	declarations: [
		ProfilesComponent,
		ECommerceUserActivityComponent,
		ProfileDetailComponent,
	],
})
export class ProfilesModule { }
