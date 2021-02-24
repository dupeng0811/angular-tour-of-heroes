import { Injectable } from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {Observable, of } from 'rxjs';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private herosUrl = 'api/heroes';
  private httpOptions: any = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  constructor(private messageService: MessageService, private http: HttpClient) { }
  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.herosUrl);
  }

  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.herosUrl}/${id}`;
    this.messageService.add(`HeroService: feteced hero id=${id}`);
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`ftched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`)));
  }
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.meaning}`);
      return of(result as T);
    };
  }

  updateHero(hero: Hero) {
    return this.http.put(this.herosUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updateed hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.herosUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => {
        this.log(`add hero w/ id=${newHero.id}`);
      }),
        catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number) : Observable<Hero> {
    const id = typeof  hero === 'number' ? hero : hero.id;
    const url = `${this.herosUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.herosUrl}/?name=${term}`).pipe(
      tap(x => x.length ? this.log(`found heroes matching "${term}"`) : this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
