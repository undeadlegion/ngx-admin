import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { UserProfile, UserActivityData, ActionItem, Message } from '../../../@core/data/user-activity-data'
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface MessageRow {
	messageType: string
  sourceID?: string
	sendDate?: string
	message?: string
	destinationID?: string
	initialDate?: string
	readDate?: string
  responseDate?: string 
	triggerType?: string
}

@Component({
  selector: 'profile-messages',
  templateUrl: './profile-messages.component.html',
  styleUrls: ['./profile-messages.component.scss']
})
export class ProfileMessagesComponent {
  customColumn = 'messageType'
  defaultColumns = [ 
    'sendDate',
    'sourceID',
    'destinationID',
    'intialDate',
    'readDate',
    'responseDate',
    'message',
    'triggerType'
  ];
  allColumns = [ this.customColumn, ...this.defaultColumns ]

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  userProfile: UserProfile
  userSentMessages: Message[]
  userReceivedMessages: Message[]

  dataSource: NbTreeGridDataSource<MessageRow>
  sentMessagesData: TreeNode<MessageRow>[]
  
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<MessageRow>,
    private userActivityService: UserActivityData,
		private route: ActivatedRoute,
		private location: Location,
  ) {
    this.getUserData()
  }

	getUserData() {
		const userName = this.route.snapshot.paramMap.get('userName')
		console.log('[profile-messages] userName: ', userName)
		this.userActivityService.getUserProfile(userName)
			.subscribe((profile: UserProfile) => {
				this.userProfile = profile
				console.log('[profile-messages] loaded profile: ', profile.userID)
				this.userActivityService.getUserSentMessages(profile.userID)
					.subscribe((messages: Message[]) => {
						this.userSentMessages = messages
            console.log('[messages-detail] loaded ', messages.length , ' sent messages')
            console.log('[messages-detail] first message ', messages[0])

            const sentMessageRows = this.userSentMessages.map((message): TreeNode<MessageRow> => { return {data: message } })

            // create table data
            this.sentMessagesData = [
              {
                data: { messageType: "Sent Messages", sendDate: "", sourceID: "", destinationID: "", initialDate: "", readDate: "", responseDate: "", message:"", triggerType: "",
                },
                children: sentMessageRows
              },
              {
                data: { messageType: "Received Messages", sendDate: "", sourceID: "", destinationID: "", initialDate: "", readDate: "", responseDate: "", message:"", triggerType: "",
                },
                children: [
                  { data: this.userSentMessages[0] }
                ] 
              }
            ]
            this.dataSource = this.dataSourceBuilder.create(this.sentMessagesData)
					})
				this.userActivityService.getUserReceivedMessages(profile.userID)
					.subscribe((messages: Message[]) => {
						this.userReceivedMessages = messages
						console.log('[profile-messages] loaded ', messages.length, ' received messages')
					})
			})

	}

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}