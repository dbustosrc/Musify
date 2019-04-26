import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { AlbumtService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumtService]
})

export class ArtistDetailComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public albums: Album[];
    public identity;
    public token: string;
    public url: string;
    public artistDetailMessage: string;
    public deleteConfirm: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumtService
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

                        //Get albums artist
                        this._albumService.getAlbums(this.token, response.artistFound._id).subscribe(
                            response => {
                                if(!response.albums){
                                    this.artistDetailMessage = "No se pudo recuperar los albums del artista";
                                }else{
                                    this.albums = response.albums;
                                }
                            }, error => {
                                var errorMessage = <any>error;
                                if(errorMessage != null){
                                var body = JSON.parse(error._body);
                                this.artistDetailMessage = body.message;
                                }
                            }
                        )
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

    public onDeleteConfirm(albumId){
        this.deleteConfirm = albumId
    }

    public onCancelDelete(){
        this.deleteConfirm = null;
    }

    public onDeleteAlbum(albumId){
        this._albumService.deleteAlbum(this.token, albumId).subscribe(
            (response) => {
                if(!response){
                    this.artistDetailMessage = 'No se pudo obtener el álbum para ser eliminado';
                }else{
                    this.getArtist();
                }
            }, (error) =>{
                var errorMessage = <any>error;
                if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.artistDetailMessage = body.message;
                }
            })
    }
}