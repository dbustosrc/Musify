import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { Album } from '../models/album';
import { AlbumService } from '../services/album.service';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token: string;
    public url: string;
    public albumAddMessage: string;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _userService: UserService,
        private _albumService: AlbumService
    ) {
        this.titulo = 'Añadir álbum';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 0, '', '');
    }

    public ngOnInit(){
    }

    public onSubmit(){
        this._route.params.forEach(element => {
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
        });

    }
}