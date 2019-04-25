import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token: string;
    public url: string;
    public artistEditMessage: string;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.is_edit = true;
    }

    public ngOnInit(){
        //Get artist from id
        this.getArtist();
    }

    public onSubmit(){
        this._route.params.forEach((params: Params) => {
            let artistId = params['id'];
            this._artistService.updateArtist(this.token, artistId, this.artist).subscribe(response =>{
                if(!response.artistUpdated){
                    this.artistEditMessage = 'No se ha podido editar el artista';
                }else{
                    if(this.filesToUpload)
                    {
                        this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + artistId, [], this.filesToUpload, this.token, 'image')
                        .then((result) => {
                            this._router.navigate(['/artists', 1]);
                        }, (error) => {
                            var errorMessage = <any>error;
                            if(errorMessage != null){
                            var body = JSON.parse(error._body);
                            this.artistEditMessage = body.message;
                            }
                        });
                    }else{
                        this.artist = response.artistUpdated;
                        this.artistEditMessage = 'Se han actualizado los datos del artista';
                        this._router.navigate(['/artists', 1]);
                    }
                }
            }, error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.artistEditMessage = body.message;
                }
            });
        });
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
                    this.artistEditMessage = body.message;
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