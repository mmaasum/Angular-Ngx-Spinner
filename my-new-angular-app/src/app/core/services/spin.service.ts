
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Spin } from 'src/app/shared/models/spin.module';
@Injectable()
export class SpinnService {

	baseURL: string;
	wheelID: number;
	constructor(public http: HttpClient) {
		this.wheelID = 1;
		this.baseURL = 'http://dev-games-backend.advbet.com/v1/ab-roulette/' + this.wheelID;
	}
	/**
	 * to check the history of the spins use this
	 *  function.
	 * @param limit 
	 */
	getLastNfinishedSpins(limit: number): Observable<any> {
		return this.http.get(this.baseURL + `/history?limit=${limit}`).pipe(
			retry(1),
			catchError(this.errorHandler)
		);
	}

	/**
	 * to display top of the ui load the previous completed spines. 
	 * default limit is 200.
	 * @param limit 
	 */
	getLastNspinstatistics(limit: number): Observable<any> {
		return this.http.get(this.baseURL + `/stats?limit=${limit}`).pipe(
			retry(1),
			catchError(this.errorHandler)
		);
	}

	/**
	 * initially load the the setting 
	 * configuration.
	 */
	getWheelConfiguration(): Observable<any> {
		return this.http.get(this.baseURL + `/configuration`).pipe(
			retry(1),
			catchError(this.errorHandler)
		);
	}

	/**
	 * using the game id display the particular 
	 * spin.
	 * @param id 
	 */
	getSpinbyId(id: number): Observable<any> {
		return this.http.get(this.baseURL + `/game/${id}`).pipe(
			retry(1),
			catchError(this.errorHandler)
		);
	}

	/**
	 * Once current spine is completed automatically 
	 * fetch the next spin.
	 */
	getNextSpin(): Observable<Spin> {
		return this.http.get<Spin>(this.baseURL + `/nextGame`).pipe(
			retry(1),
			catchError(this.errorHandler)
		);
	}

	/**
	 * get the particular spine using the 
	 * unique id.
	 * @param uuid 
	 */
	getSpinbyUUID(uuid: string): Observable<any> {
		return this.http.get(this.baseURL + `/game/${uuid}`).pipe(
			retry(1),
			catchError(this.errorHandler)
		);
	}

	/**
	 * To see the list of upcoming spins user 
	 * will invoke this api.
	 */
	getListofUpcomingSpins(): Observable<any> {
		return this.http.get(this.baseURL + `/scheduledGames`).pipe(
			retry(1),
			catchError(this.errorHandler)
		);
	}
	
	/**
	 * handle the error for this service. 
	 * take the error response as parameter.
	 * @param error 
	 */
	errorHandler(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Client Side Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Server Side Error: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

}