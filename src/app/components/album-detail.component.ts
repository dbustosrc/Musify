import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Song } from '../models/song';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
import { SongService } from '../services/song.service';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, ArtistService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public songs: Song[];
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
        private _albumService: AlbumService,
        private _songService: SongService
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

                        //Get albums songs
                        this._songService.getSongs(this.token, response.albumId).subscribe(
                            response => {
                                if(!response.songs){
                                    this.albumDetailMessage = "No se pudo recuperar los albums del artista";
                                }else{
                                    this.songs = response.songs;
                                }
                            }, error => {
                                var errorMessage = <any>error;
                                if(errorMessage != null){
                                var body = JSON.parse(error._body);
                                this.albumDetailMessage = body.message;
                                }
                            }
                        )
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

    public onDeleteConfirm(songId){
        this.deleteConfirm = songId
    }

    public onCancelDelete(){
        this.deleteConfirm = null;
    }

    public onDeleteSong(songId){
        this._songService.deleteSong(this.token, songId).subscribe(
            (response) => {
                if(!response){
                    this.albumDetailMessage = 'No se pudo obtener la canción para ser eliminada';
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

    public playSong(song){
        let songPlayer = JSON.stringify(song);
        let filePath = this.url + 'get-file-song/' + song.file;
        let imagePath = this.url + 'get-image-album/' + song.album.image;

        localStorage.setItem('currentSong', songPlayer);
        
        document.getElementById('mp3-source').setAttribute("src", filePath);
        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();

        document.getElementById('play-title-song').innerHTML = song.name;
        document.getElementById('play-artist-song').innerHTML = song.album.artist.name;
        document.getElementById('play-album-image').setAttribute("src", imagePath);
    }
}