import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Song } from '../models/song';
import { SongService } from '../services/song.service';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit{
    public titulo: string;
    public song: Song;
    public identity;
    public token: string;
    public url: string;
    public songAddMessage: string;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _userService: UserService,
        private _songService: SongService
    ) {
        this.titulo = 'Añadir canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(0, '', 0, '', '');
    }

    public ngOnInit(){
    }

    public onSubmit(){
        this._route.params.forEach(element => {
            let albumId = element['album'];
            this.song.album = albumId;
        });
        
        this._songService.addSong(this.token, this.song).subscribe(response =>{
            if(!response.song){
                this.songAddMessage = 'No se ha podido añadir la canción';
            }else{
                this.song = response.song;
                this._router.navigate(['/edit-song', response.song._id]);
            }
        }, error => {
            var errorMessage = <any>error;
            if(errorMessage != null){
            var body = JSON.parse(error._body);
            this.songAddMessage = body.message;
            }
        });

    }
}