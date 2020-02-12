import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { ActionItem } from "../data/user-activity-data";
import { UserActivityService } from "./user-activity.service";
import { UserActivityData } from "../data/user-activity-data";
import { catchError, finalize } from "rxjs/operators";

export class UserActionsDataSource implements DataSource<ActionItem> {

    private actionItemsSubject = new BehaviorSubject<ActionItem[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private userActivityService: UserActivityData) {

    }

    loadActionItems(userID: string) {
        this.loadingSubject.next(true)

        this.userActivityService.getUserActions(userID).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(actionItems => {
            console.log('[DataSource] loaded ', actionItems)
            this.actionItemsSubject.next(actionItems)
        })
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