import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { AlbumtService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, UploadService, AlbumtService]
})

export class AlbumEditComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token: string;
    public url: string;
    public albumEditMessage: string;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumtService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar álbum';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 0, '', '');
        this.is_edit = true;
    }

    public ngOnInit(){
        //Get album from id
        this.getAlbum();
    }

    public onSubmit(){
        this._route.params.forEach((params: Params) => {
            let albumId = params['id'];

            this._albumService.updateAlbum(this.token, albumId, this.album).subscribe(response =>{
                console.log(response);
                if(!response.albumUpdated){
                    this.albumEditMessage = 'No se ha podido editar el álbum';
                }else{
                    if(this.filesToUpload)
                    {
                        this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + albumId, [], this.filesToUpload, this.token, 'image')
                        .then((result) => {
                            this._router.navigate(['/artist', response.albumUpdated.artist]);
                        }, (error) => {
                            var errorMessage = <any>error;
                            if(errorMessage != null){
                            var body = JSON.parse(error._body);
                            this.albumEditMessage = body.message;
                            }
                        });
                    }else{
                        this.album = response.albumUpdated;
                        this.albumEditMessage = 'Se han actualizado los datos del álbum';
                        this._router.navigate(['/artist/', this.album.artist]);
                    }
                }
            }, error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.albumEditMessage = body.message;
                }
            });
        });
    }

    public getAlbum(){
        this._route.params.forEach((params: Params) => {
            let albumId = params['id'];
            
            this._albumService.getAlbum(this.token, albumId).subscribe(
                response => {
                    console.log(response);
                    if(!response.albumFound){
                        this._router.navigate(['/artist/', this.album.artist]);
                    }else{
                        this.album = response.albumFound;
                    }
                }, error => {
                    var errorMessage = <any>error;
                    if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    this.albumEditMessage = body.message;
                    }
                }
            )
        });
    }

    public fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }
}