import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from "rxjs";
import { tap } from 'rxjs/operators'
import { ActionItem } from "../data/user-activity-data";
import { UserActivityService } from "./user-activity.service";
import { UserActivityData } from "../data/user-activity-data";
import { catchError, finalize, map, take } from "rxjs/operators";

export class UserActionsDataSource implements DataSource<ActionItem> {

    private actionItemsSubject = new BehaviorSubject<ActionItem[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private userActivityService: UserActivityData) {

    }

    loadActionItems(userID: string): Observable<ActionItem[]> {
        this.loadingSubject.next(true)

        const subject = new Subject<ActionItem[]>()
        this.userActivityService.getUserActions(userID).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(actionItems => {
            console.log('[datasource: user-actions] loaded ', actionItems)
            this.actionItemsSubject.next(actionItems)
            subject.next(actionItems)
        })

        return subject.asObservable().pipe(take(1))
    }

    loadSortedActionItems(userID: string, asc: string): Observable<ActionItem[]> {
        this.loadingSubject.next(true)

        const subject = new Subject<ActionItem[]>()
        this.userActivityService.getUserActions(userID).pipe(
            map(actions => { 
                return actions.sort((a, b) => { 
                    if (a.propertyKey < b.propertyKey) {
                        return asc === 'asc' ? -1 : 1
                    } else if (a.propertyKey > b.propertyKey) {
                        return asc === 'asc' ? 1 : -1
                    } else {
                        return 0
                    }
                }) 
            }),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(actionItems => {
            console.log('[datasource: user-actions] loaded ', actionItems.length, ' action items')
            this.actionItemsSubject.next(actionItems)
            subject.next(actionItems)
        })

        return subject.asObservable().pipe(take(1))
    }

    connect(collectionViewer: CollectionViewer): Observable<ActionItem[]> {
        console.log('[datasource: user-actions] connect');    
        return this.actionItemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        console.log('[datasource: user-actions] disconnect');
        this.actionItemsSubject.complete();
        this.loadingSubject.complete();
    }

}