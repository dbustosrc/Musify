import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumDetailComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token: string;
    public url: string;
    public albumDetailMessage: string;
    public deleteConfirm: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.titulo = 'Detalle del álbum';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    public ngOnInit(){
        //Get artist from id
        this.getAlbum();
    }

    public getAlbum(){
        this._route.params.forEach((params: Params) => {
            let albumId = params['id'];
            
            this._albumService.getAlbum(this.token, albumId).subscribe(
                response => {
                    
                    if(!response.albumFound){
                        this._router.navigate(['/artist', response.albumFound.artist]);
                    }else{
                        this.album = response.albumFound;
                        this._artistService.getArtist(this.token, response.albumFound.artist._id).subscribe(
                            responseArtist => {
                                if(responseArtist.artistFound){
                                    this.artist = responseArtist.artistFound;
                                }
                            }, errorArtist => {
                                var errorMessage = <any>errorArtist;
                                if(errorMessage != null){
                                var body = JSON.parse(errorArtist._body);
                                this.albumDetailMessage = body.message;
                                }
                            }
                        );

                        //Get albums artist
                        /*this._albumService.getAlbums(this.token, response.artistFound._id).subscribe(
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
                        )*/
                    }
                }, error => {
                    var errorMessage = <any>error;
                    if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    this.albumDetailMessage = body.message;
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
                    this.albumDetailMessage = 'No se pudo obtener el álbum para ser eliminado';
                }else{
                    this.getAlbum();
                }
            }, (error) =>{
                var errorMessage = <any>error;
                if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.albumDetailMessage = body.message;
                }
            })
    }
}