import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Song } from '../models/song';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService]
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
        private _userService: UserService
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
        /*this._route.params.forEach(element => {
            let artistId = element['artist'];
            this.album.artist = artistId;
        });
        
        this._albumService.addAlbum(this.token, this.album).subscribe(response =>{
            if(!response.album){
                this.albumAddMessage = 'No se ha podido añadir el álbum';
            }else{
                this.album = response.album;
                this._router.navigate(['/edit-album', response.album._id]);
            }
        }, error => {
            var errorMessage = <any>error;
            if(errorMessage != null){
            var body = JSON.parse(error._body);
            this.albumAddMessage = body.message;
            }
        });*/

    }
}