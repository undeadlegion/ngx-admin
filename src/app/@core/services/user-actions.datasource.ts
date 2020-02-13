import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subject } from "rxjs";
import { tap } from 'rxjs/operators'
import { ActionItem } from "../data/user-activity-data";
import { UserActivityService } from "./user-activity.service";
import { UserActivityData } from "../data/user-activity-data";
import { catchError, finalize, take } from "rxjs/operators";

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
            console.log('[DataSource] loaded ', actionItems)
            this.actionItemsSubject.next(actionItems)
            subject.next(actionItems)
        })

        return subject.asObservable().pipe(take(1))
    }

    connect(collectionViewer: CollectionViewer): Observable<ActionItem[]> {
        console.log('[DataSource] connected to action items subject');
        return this.actionItemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.actionItemsSubject.complete();
        this.loadingSubject.complete();
    }

}