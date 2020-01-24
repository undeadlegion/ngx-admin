import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ThemeModule } from '../../@theme/theme.module'
import { NbCardModule, NbIconModule, NbTreeGridModule } from '@nebular/theme'
import { RouterModule, Routes } from '@angular/router'

import { ProfilesComponent } from './profiles.component'
import { ECommerceUserActivityComponent } from './user-activity/user-activity.component'
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { ProfileMessagesComponent, FsIconComponent } from './profile-messages/profile-messages.component'

@NgModule({
	imports: [
		CommonModule,
		ThemeModule,
		RouterModule,
		NbCardModule,
		NbIconModule,
		NbTreeGridModule,
	],
	declarations: [
		ProfilesComponent,
		ECommerceUserActivityComponent,
		ProfileDetailComponent,
		ProfileMessagesComponent,
		FsIconComponent,
	],
})
export class ProfilesModule { }
