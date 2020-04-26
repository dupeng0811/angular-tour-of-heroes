import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  constructor(private heroService: HeroService) { }
  private searchTerms = new Subject<string>();
  ngOnInit() {
    this.heroes$ = this.searchTerms.pipe(
    debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term)),
  );
  }

  search(term: string) {
    this.searchTerms.next(term);
  }
}
