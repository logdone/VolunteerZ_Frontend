import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Event } from './event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private resourceUrl = ApiService.API_URL + '/events';

  constructor(protected http: HttpClient) {}

  create(event: Event): Observable<HttpResponse<Event>> {
    return this.http.post<Event>(this.resourceUrl, event, { observe: 'response' });
  }

  update(event: Event): Observable<HttpResponse<Event>> {
    console.log("in _update service id iv"+event.comments[2].commentBody);
    return this.http.put(this.resourceUrl, event, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Event>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Event[]>> {
    const options = createRequestOption(req);
    return this.http.get<Event[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  participate(id: number , userId : string) : Observable<HttpResponse<any>> {
    console.log("in participate service id iv")
    return this.http.get<any>(`${this.resourceUrl}/participate/${id}/${userId}`, { observe: 'response' });
  }

  unparticipate(id: number , userId : string) : Observable<HttpResponse<any>> {
    console.log("in participate service id iv")
    return this.http.get<any>(`${this.resourceUrl}/unparticipate/${id}/${userId}`, { observe: 'response' });
  }

  report(id: number , userId : string) : Observable<HttpResponse<any>> {
    console.log("in participate service report")
    return this.http.get<any>(`${this.resourceUrl}/report/${id}/${userId}`, { observe: 'response' });
  }
  
}
