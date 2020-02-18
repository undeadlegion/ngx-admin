import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth'
import { NbSecurityModule, NbRoleProvider } from '@nebular/security'
import { of as observableOf } from 'rxjs'

import { throwIfAlreadyLoaded } from './module-import-guard';
import { AnalyticsService } from './utils';
import { UserData } from './data/users';
import { UserService } from './mock/users.service';
import { MockDataModule } from './mock/mock-data.module';

import { UserActivityData } from './data/user-activity-data'

import { UserActivityService } from './services/user-activity.service'
import { PeriodsService } from './services/periods.service'
import { UserProfileResolver } from './services/user-profile.resolver'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { RequestCacheInterceptor } from './services/request-cache.interceptor'
import { RequestCacheService } from './services/request-cache.service'

const socialLinks = [
  {
    url: 'https://github.com/akveo/nebular',
    target: '_blank',
    icon: 'github',
  },
  {
    url: 'https://www.facebook.com/akveo/',
    target: '_blank',
    icon: 'facebook',
  },
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'twitter',
  },
];

const DATA_SERVICE_PROVIDERS = [
  { provide: UserData, useClass: UserService },
  { provide: UserActivityData, useClass: UserActivityService },
  { provide: UserProfileResolver, useClass: UserProfileResolver },
  { provide: RequestCacheService, useClass: RequestCacheService },
];

const INTERCEPTOR_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: RequestCacheInterceptor, multi: true },
];

export class NbSimpleRoleProvider extends NbRoleProvider {
	getRole() {
		// here you could provide any role based on any auth flow
		return observableOf('guest')
	}
}

export const NB_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers,
  ...DATA_SERVICE_PROVIDERS,
  ...INTERCEPTOR_PROVIDERS,
  ...NbAuthModule.forRoot({
    strategies: [
      NbDummyAuthStrategy.setup({
        name: 'email',
        delay: 3000,
      }),
    ],
    forms: {
      login: {
        socialLinks: socialLinks,
      },
      register: {
        socialLinks: socialLinks,
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  PeriodsService,
];

@NgModule({
	imports: [
		CommonModule,
	],
	exports: [
		NbAuthModule,
	],
	declarations: [],
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		throwIfAlreadyLoaded(parentModule, 'CoreModule')
	}

	static forRoot(): ModuleWithProviders {
		return <ModuleWithProviders>{
			ngModule: CoreModule,
			providers: [
				...NB_CORE_PROVIDERS,
			],
		}
	}
}
