import { Component, OnInit } from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heros: Hero[];
  constructor(private heroService: HeroService, private messageService: MessageService) {
  }
  getHeroes(): void {
    this.heroService.getHeros().subscribe(heros => this.heros = heros);
  }

  ngOnInit() {
    this.getHeroes();
  }
}
