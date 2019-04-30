import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, UploadService, SongService]
})

export class SongEditComponent implements OnInit{
    public titulo: string;
    public song: Song;
    public identity;
    public token: string;
    public url: string;
    public songEditMessage: string;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(0, '', 0, '', '');
        this.is_edit = true;
    }

    public ngOnInit(){
        //Get song from id
        this.getSong();
    }

    public onSubmit(){
        this._route.params.forEach((params: Params) => {
            let songId = params['id'];

            this._songService.updateSong(this.token, songId, this.song).subscribe(response =>{
                console.log(response);
                if(!response.songUpdated){
                    this.songEditMessage = 'No se ha podido editar la canción';
                }else{
                    if(this.filesToUpload)
                    {
                        this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + songId, [], this.filesToUpload, this.token, 'file')
                        .then((result) => {
                            this._router.navigate(['/album', response.songUpdated.album]);
                        }, (error) => {
                            var errorMessage = <any>error;
                            if(errorMessage != null){
                            var body = JSON.parse(error._body);
                            this.songEditMessage = body.message;
                            }
                        });
                    }else{
                        this.song = response.songUpdated;
                        this.songEditMessage = 'Se han actualizado los datos de la canción';
                        this._router.navigate(['/album/', this.song.album]);
                    }
                }
            }, error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.songEditMessage = body.message;
                }
            });
        });
    }

    public getSong(){
        this._route.params.forEach((params: Params) => {
            let songId = params['id'];
            
            this._songService.getSong(this.token, songId).subscribe(
                response => {
                    if(!response.songFound){
                        this._router.navigate(['/album/', this.song.album]);
                    }else{
                        this.song = response.songFound;
                    }
                }, error => {
                    var errorMessage = <any>error;
                    if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    this.songEditMessage = body.message;
                    }
                }
            )
        });
    }

    public fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}