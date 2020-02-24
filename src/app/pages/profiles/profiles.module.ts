import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ThemeModule } from '../../@theme/theme.module'
import {
	MatCardModule,
	MatDatepickerModule,
	MatFormFieldModule,
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSelectModule,
	MatSortModule,
	MatTableModule,
} from '@angular/material'
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { NbCardModule, NbDatepickerModule, NbIconModule, NbTreeGridModule } from '@nebular/theme'
import { RouterModule } from '@angular/router'

import { ProfilesComponent } from './profiles.component'
import { ECommerceUserActivityComponent } from './user-activity/user-activity.component'
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { ProfileMessagesComponent, FsIconComponent } from './profile-messages/profile-messages.component';
import { ProfileActionsComponent } from './profile-actions/profile-actions.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatCardModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatMomentDateModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatSortModule,
		MatTableModule,
		NbCardModule,
		NbDatepickerModule,
		NbIconModule,
		NbTreeGridModule,
		ReactiveFormsModule,
		RouterModule,
		ThemeModule,
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
