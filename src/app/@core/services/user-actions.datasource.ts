import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from "rxjs";
import { tap } from 'rxjs/operators'
import { ActionItem } from "../data/user-activity-data";
import { UserActivityService } from "./user-activity.service";
import { UserActivityData } from "../data/user-activity-data";
import { catchError, finalize, map, take } from "rxjs/operators";
import { throwIfAlreadyLoaded } from '../module-import-guard';

export interface LoadedActionItems {
    items: ActionItem[]
    pageIndex: number
    pageSize: number
    totalItems: number
}

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

    loadSortedActionItems(userID: string, sortDirection: string, pageIndex: number, pageSize: number): Observable<LoadedActionItems> {
        this.loadingSubject.next(true)

        const subject = new Subject<LoadedActionItems>()
        this.userActivityService.getUserActions(userID).pipe(
            map((items: ActionItem[]) => {
                return items.sort((a, b) => { 
                    if (a.propertyKey < b.propertyKey) {
                        return sortDirection === 'asc' ? -1 : 1
                    } else if (a.propertyKey > b.propertyKey) {
                        return sortDirection === 'asc' ? 1 : -1
                    } else {
                        return 0
                    }
                })
            }),
            map((items: ActionItem[]) => {
                const loaded: LoadedActionItems = {
                    items: items,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    totalItems: items.length
                }
                return loaded
            }),            
            map((loaded: LoadedActionItems) => {
                const startIndex = pageIndex * pageSize
                const endIndex = startIndex + pageSize
                loaded.items = loaded.items.slice(startIndex, endIndex)
                return loaded
            }),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((loaded: LoadedActionItems) => {
            console.log('[datasource: user-actions] loaded ', loaded.items.length, ' action items')
            this.actionItemsSubject.next(loaded.items)
            subject.next(loaded)
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