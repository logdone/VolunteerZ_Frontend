import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { ExtendedUser } from './extended-user.model';

@Injectable({ providedIn: 'root' })
export class ExtendedUserService {
  private resourceUrl = ApiService.API_URL + '/extended-users';

  constructor(protected http: HttpClient) {}

  create(extendedUser: ExtendedUser): Observable<HttpResponse<ExtendedUser>> {
    return this.http.post<ExtendedUser>(this.resourceUrl, extendedUser, { observe: 'response' });
  }

  update(extendedUser: ExtendedUser): Observable<HttpResponse<ExtendedUser>> {
    return this.http.put(this.resourceUrl, extendedUser, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ExtendedUser>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ExtendedUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<ExtendedUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
