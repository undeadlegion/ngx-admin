import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ThemeModule } from '../../@theme/theme.module'

import { ProfilesComponent } from './profiles.component'
import { ECommerceUserActivityComponent } from './user-activity/user-activity.component'

@NgModule({
	imports: [
		CommonModule,
		ThemeModule,
	],
	declarations: [
		ProfilesComponent,
		ECommerceUserActivityComponent,
	],
})
export class ProfilesModule { }
