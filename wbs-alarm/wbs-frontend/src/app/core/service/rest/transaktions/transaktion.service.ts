import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';
import { WbsSitemapHelper } from '../sitemap/data/wbs-sitemap.helper';
import { Observable } from 'rxjs';

@Injectable()
export class TransaktionService
{
    public headers:HttpHeaders;

    constructor(public http:HttpClient,
                public sitemapHelper:WbsSitemapHelper)
    {
    }

    public postTransaktion(traegerId:number,
                           buchungen:{ von:number, nach:number, positions:Array<{ groesse:number, anzahl:number }> }):Observable<any>
    {
        this.headers = this.sitemapHelper.setAuthorization();

        return this.http.post(this.sitemapHelper.transaktionForTraeger().replace('{traegerId}', traegerId.toString()),
            {
                von:       buchungen.von,
                nach:      buchungen.nach,
                positions: buchungen.positions
            },
            {
                headers: this.headers
            });
    }

    public getTransaktionenForTraeger(traegerId:number):Observable<any>
    {
        this.headers = this.sitemapHelper.setAuthorization();

        return this.http.get(this.sitemapHelper.transaktionForTraeger().replace('{traegerId}', traegerId.toString()) + '?page=0&size=500',
            {
                headers: this.headers
            }
        );
    }
}
