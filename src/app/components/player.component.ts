import { Component, OnInit } from '@angular/core';

import { GLOBAL } from '../services/global';
import { Song } from '../models/song';

@Component({
    selector: 'player',
    templateUrl: '../views/player.html'
})

export class PlayerComponent implements OnInit{
    public url: string;
    public song;

    constructor() {
        this.url = GLOBAL.url;
        this.song = new Song(0, '', 0, '', '');
    }

    public ngOnInit(){
        let song = JSON.parse(localStorage.getItem('currentSong'));
        if(song){
            this.song = song;
        }else{
            this.song = new Song(0, '', 0, '', '');
        }
    }
}