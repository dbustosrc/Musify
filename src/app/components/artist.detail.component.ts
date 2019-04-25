import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService]
})

export class ArtistDetailComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token: string;
    public url: string;
    public artistDetailMessage: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Detalle de artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    public ngOnInit(){
        //Get artist from id
        this.getArtist();
    }

    public getArtist(){
        this._route.params.forEach((params: Params) => {
            let artistId = params['id'];
            
            this._artistService.getArtist(this.token, artistId).subscribe(
                response => {
                    if(!response.artistFound){
                        this._router.navigate(['/artists', 1]);
                    }else{
                        this.artist = response.artistFound;
                    }
                }, error => {
                    var errorMessage = <any>error;
                    if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    this.artistDetailMessage = body.message;
                    }
                }
            )
        });
    }
}