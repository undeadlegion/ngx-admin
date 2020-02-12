import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ThemeModule } from '../../@theme/theme.module'
import { MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule } from '@angular/material'
import { NbCardModule, NbIconModule, NbTreeGridModule } from '@nebular/theme'
import { RouterModule, Routes } from '@angular/router'

import { ProfilesComponent } from './profiles.component'
import { ECommerceUserActivityComponent } from './user-activity/user-activity.component'
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { ProfileMessagesComponent, FsIconComponent } from './profile-messages/profile-messages.component';
import { ProfileActionsComponent } from './profile-actions/profile-actions.component';

@NgModule({
	imports: [
		CommonModule,
		ThemeModule,
		RouterModule,
		MatTableModule,
		NbCardModule,
		NbIconModule,
		NbTreeGridModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		MatSortModule,
	],
	declarations: [
		ProfilesComponent,
		ECommerceUserActivityComponent,
		ProfileDetailComponent,
		ProfileMessagesComponent,
		FsIconComponent,
		ProfileActionsComponent,
	],
})
export class ProfilesModule { }
