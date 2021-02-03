import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Timeline } from './timeline';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private resourceUrl = ApiService.API_URL + '/timeline';

  constructor(protected http: HttpClient) {}

  create(timeline: Timeline): Observable<HttpResponse<Timeline>> {
    return this.http.post<Timeline>(this.resourceUrl, timeline, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Timeline[]>> {
    const options = createRequestOption(req);
    return this.http.get<Timeline[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }


  getAllTimeline(id : string):Observable<Timeline[]>{

    return this.http.get<Timeline[]>(`${this.resourceUrl}/${id}`);
  }
  
}
