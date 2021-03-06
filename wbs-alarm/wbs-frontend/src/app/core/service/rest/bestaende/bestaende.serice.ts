import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';
import { WbsSitemapHelper } from '../sitemap/data/wbs-sitemap.helper';
import { Observable } from 'rxjs';

@Injectable()
export class BestaendeService
{
    public headers:HttpHeaders;

    constructor(public http:HttpClient,
                public sitemapHelper:WbsSitemapHelper)
    {

    }


    public getBestaendeFuerZielort(zielortId:number):Observable<any>
    {
        this.headers = this.sitemapHelper.setAuthorization();

        let url:string = this.sitemapHelper.bestandList().replace('{zielortId}', zielortId.toString());

        return this.http.get(url, {
            headers: this.headers
        });
    }

    public erfasseBestaendeFuerZielort(groesseId:number, anzahl:number, zielortId:number):Observable<any>
    {
        this.headers = this.sitemapHelper.setAuthorization();

        let url:string = this.sitemapHelper.bestandList().replace('{zielortId}', zielortId.toString());

        return this.http.post(url,
            {
                anzahl:    anzahl,
                groesseId: groesseId
            },
            {
                headers: this.headers,
                observe: 'response'
            });

    }

    public aendereBestand(neuerBestand:number, bestandId:number):Observable<any>
    {
        this.headers = this.sitemapHelper.setAuthorization();

        let url:string = this.sitemapHelper.bestand().replace('{id}', bestandId.toString());

        return this.http.put(url, {anzahl: neuerBestand}, {headers: this.headers});
    }

    public loescheBestand(bestandId:number):Observable<any>
    {
        this.headers = this.sitemapHelper.setAuthorization();

        let url:string = this.sitemapHelper.bestand().replace('{id}', bestandId.toString());

        return this.http.delete(url, {headers: this.headers});
    }
}
