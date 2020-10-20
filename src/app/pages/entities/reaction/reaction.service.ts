import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Reaction } from './reaction.model';

@Injectable({ providedIn: 'root'})
export class ReactionService {
    private resourceUrl = ApiService.API_URL + '/reactions';

    constructor(protected http: HttpClient) { }

    create(reaction: Reaction): Observable<HttpResponse<Reaction>> {
        return this.http.post<Reaction>(this.resourceUrl, reaction, { observe: 'response'});
    }

    update(reaction: Reaction): Observable<HttpResponse<Reaction>> {
        return this.http.put(this.resourceUrl, reaction, { observe: 'response'});
    }

    find(id: number): Observable<HttpResponse<Reaction>> {
        return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    query(req?: any): Observable<HttpResponse<Reaction[]>> {
        const options = createRequestOption(req);
        return this.http.get<Reaction[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }
}
