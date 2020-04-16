import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output, ViewChild
} from '@angular/core';
import { Language } from 'angular-l10n';
import { LoginService } from '../../core/service/rest/login/login.service';
import {
    ActivatedRoute,
    Data,
    Router
} from '@angular/router';
import {AlertService, TerraAlertComponent} from '@plentymarkets/terra-components';
import { GlobalRegistryService } from '../../core/global-registry/global-registry.service';
import { TransaktionService } from '../../core/service/rest/transaktions/transaktion.service';
import {merge, Observable, of} from 'rxjs';
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError, map, startWith, switchMap} from "rxjs/operators";

export interface BuchungsuebersichtRow
{
     name:any;
     von:any;
     nach:any;
     date:any;
     anzahl:any;
}

@Component({
    selector: 'start',
    templateUrl: './start.component.html',
    styleUrls:   ['./start.component.scss'],
})
export class StartComponent implements OnInit
{
    @Language()
    public lang:string;

    @Input()
    public myTitle:string;

    @Output()
    public userIsLoggedIn:EventEmitter<boolean> = new EventEmitter();

    public routeData$:Observable<Data>;

    private tableData:Array<BuchungsuebersichtRow> = [];

    public displayedColumns:Array<string> = ['von', 'nach', 'date', 'name', 'anzahl'];
    public dataSource:MatTableDataSource<BuchungsuebersichtRow> = new MatTableDataSource<BuchungsuebersichtRow>(this.tableData);

    @ViewChild(MatPaginator, {static: false})
    public paginator:MatPaginator;

    @ViewChild(MatSort, {static: false})
    public sort:MatSort;

    constructor(public router:Router,
                public alert:AlertService,
                public route:ActivatedRoute,
                public globalRegistry:GlobalRegistryService,
                public transaktionsService:TransaktionService,
                private http:HttpClient)
    {
    }

    public ngOnInit():void
    {
        this.routeData$ = this.route.data;

        this.route.data.subscribe((data:any) =>
        {
            let traegerId = data.user._embedded.traeger[0].id;

            this.transaktionsService.getTransaktionenForTraeger(traegerId).subscribe((result:any) =>
            {
                result._embedded.elemente.forEach((element:any) =>
                {
                    let anzahl:number = 0;

                    element._embedded.positionen.forEach((position:any) =>
                    {
                        anzahl += position.anzahl
                    });

                    this.tableData.push({
                        date: element.datum,
                        nach: element._embedded.nach[0].name,
                        name: element._embedded.benutzer[0].username,
                        von: element._embedded.von[0].name,
                        anzahl: anzahl
                    });
                    this.dataSource.paginator = this.paginator;
                    this.dataSource._updateChangeSubscription();
                })
            });

        })
    }
}
