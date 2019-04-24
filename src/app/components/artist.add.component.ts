import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token: string;
    public url: string;
    public artistAddMessage: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Añádir artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
    }

    public ngOnInit(){
        console.log('Añadir artista');
    }

    public onSubmit(){
        this._artistService.addArtist(this.token, this.artist).subscribe(response =>{
            if(!response.artist){
                this.artistAddMessage = 'No se ha podido añadir el artista';
            }else{
                this.artist = response.artist;
                //this._router.navigate(['/edit-artist'], response.artist._id);
            }
        }, error => {
            var errorMessage = <any>error;
            if(errorMessage != null){
            var body = JSON.parse(error._body);
            this.artistAddMessage = body.message;
            }
        });

    }
}