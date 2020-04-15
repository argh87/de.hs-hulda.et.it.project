import {
    Component,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    ActivatedRoute,
    Data
} from '@angular/router';
import { Observable } from 'rxjs';
import {
    TerraOverlayButtonInterface,
    TerraSelectBoxValueInterface
} from '@plentymarkets/terra-components';
import { GroesseService } from '../../../../core/service/rest/groesse/groesse.service';
import { CategoryService } from '../../../../core/service/rest/categories/category.service';
import { SystemGlobalSettingsService } from '../../system-global-settings.service';
import { isNullOrUndefined } from 'util';
import { BestaendeService } from '../../../../core/service/rest/bestaende/bestaende.serice';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {BestandDialogComponent} from "./dialog/bestand-dialog.component";

export interface BestandRow {
    kategorie:any;
    groesse:any;
    anzahl:number;
    bestand:any;
}

@Component({
    selector: 'system-bestaende',
    templateUrl: './system-bestaende.component.html',
    styleUrls:   ['./system-bestaende.component.scss']
})
export class SystemBestaendeComponent implements OnInit
{
    public routeData$:Observable<Data>;

    public _kategorien:Array<TerraSelectBoxValueInterface> = [{caption: 'Bitte wählen', value: null}];
    public _groessen:Array<TerraSelectBoxValueInterface> = [{caption: 'Bitte wählen', value: null}];

    public _kategorie:any;
    public _groesse:any;

    public _anzahl:number;

    public _bestandAendernAnzahl:number;
    public _bestandAendernBestand:number;

    public primaryButtonInterface:TerraOverlayButtonInterface;

    @Input()
    public zielortId:number;

    @Input()
    public gesperrt:boolean = false;

    @ViewChild('bearbeitenOverlay', {static:false})
    public bearbeitenOverlay:any;

    private tableData:Array<BestandRow> = [];

    public displayedColumns:Array<string> = ['select', 'kategorie', 'größe', 'anzahl'];
    public dataSource:MatTableDataSource<BestandRow> = new MatTableDataSource<BestandRow>(this.tableData);
    public selection:SelectionModel<BestandRow> = new SelectionModel<BestandRow>(false, []);

    constructor(public route:ActivatedRoute,
                public groessenService:GroesseService,
                public categoryService:CategoryService,
                public dialog:MatDialog,
                public bestandService:BestaendeService,
                public systemGlobalSettingsService:SystemGlobalSettingsService)
    {
    }

    public ngOnInit():void
    {
        let tragerId:number = this.systemGlobalSettingsService.getTraegerId();

        this.routeData$ = this.route.data;

        this.route.data.subscribe((data:any) =>
        {
            data.bestaende._embedded.elemente.forEach((element:any) =>
            {
                this.addRowToTable(
                    {
                        kategorie: element._embedded.kategorie[0],
                        groesse: element._embedded.groesse[0],
                        anzahl: element.anzahl,
                        bestand: element.id
                    });
            })
        });


        this.categoryService.getCategories(tragerId).subscribe((result:any) =>
        {
            result._embedded.elemente.forEach((kategorie) =>
            {
                this._kategorien.push(
                    {
                        caption: kategorie.name,
                        value: kategorie
                    }
                )
            });
        });
    }

    public addRowToTable(bestand:BestandRow):void
    {
        this.tableData.push(
            {
                kategorie: bestand.kategorie,
                groesse: bestand.groesse,
                anzahl: bestand.anzahl,
                bestand: bestand.bestand
            }
        );

        this.dataSource._updateChangeSubscription();
    }

    public addBestand():void
    {
        this.bestandService.erfasseBestaendeFuerZielort(this._groesse.id, this._anzahl, this.zielortId).subscribe((result:any) =>
        {
            this.addRowToTable({
                kategorie: this._kategorie,
                groesse: this._groesse,
                anzahl: this._anzahl,
                bestand: result.headers.get('Location').split('/wbs/bestand/')[1]
            })

            // this.alert.addAlert(
            //     {
            //         msg: 'Der Bestand wurde erfolgreich erfasst',
            //         type: AlertType.success,
            //         dismissOnTimeout: 0
            //     }
            // )
        },
            (error:any) =>
            {
                // this.alert.addAlert(
                //     {
                //         msg: 'Der Bestand konnte nicht erfasst werden: ' + error,
                //         type: AlertType.error,
                //         dismissOnTimeout: 0
                //     }
                // )
            })


    }

    public ladeGroessen():void
    {
        if(!isNullOrUndefined(this._kategorie))
        {
            this._groessen = [];

            this.groessenService.getGroessenForKategorie(this._kategorie.id).subscribe((result:any) =>
            {
                result._embedded.elemente.forEach((groesse:any) =>
                {
                    this._groessen.push(
                        {
                            caption: groesse.name,
                            value: groesse
                        }
                    )
                })
            })
        }
    }

    public aendereBestand():void
    {
        const editDialog:MatDialogRef<BestandDialogComponent> = this.dialog.open(BestandDialogComponent, {autoFocus:true});
        this._bestandAendernAnzahl = this.selection.selected[0].anzahl;

        this._bestandAendernBestand = this.selection.selected[0].bestand;

        editDialog.afterClosed().subscribe((neuerBestand:number) =>
        {
            if(neuerBestand > 0)
            {
                this.saveChangesToBestand(neuerBestand);

                this.selection.selected[0].anzahl = neuerBestand;
                this.dataSource._updateChangeSubscription();
            }
        });
    }

    public saveChangesToBestand(neuerBestand:number):void
    {
        this.bestandService.aendereBestand(neuerBestand, this._bestandAendernBestand).subscribe((result:any) =>
        {
            // this.alert.addAlert(
            //     {
            //         msg: 'Der Bestand wurde erfolgreich geändert',
            //         type: AlertType.success,
            //         dismissOnTimeout: 0
            //     }
            // )
        },
            (error:any) =>
            {
                // this.alert.addAlert(
                //     {
                //         msg: 'Der Bestand wurde nicht erfolgreich geändert: ' + error,
                //         type: AlertType.error,
                //         dismissOnTimeout: 0
                //     }
                // )
            })
    }

    public loescheBestand():void
    {
        let loeschBestand:BestandRow = this.selection.selected[0];

        this.bestandService.loescheBestand(loeschBestand.bestand).subscribe(
            (result:any) =>
        {
            // this.alert.addAlert({
            //     msg: 'Der Bestand wurde gelöscht',
            //     type: AlertType.success,
            //     dismissOnTimeout: 0
            // })

            let idx:number = this.tableData.indexOf(loeschBestand);

            this.tableData.splice(idx, 1);
            this.dataSource._updateChangeSubscription();
        },
            (error:any) =>
            {
                // this.alert.addAlert({
                //     msg: 'Der Bestand wurde nicht gelöscht',
                //     type: AlertType.error,
                //     dismissOnTimeout: 0
                // })
            });
    }
}