import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Injectable()
export class AlbumService{
    public url: string;

    constructor( private _http: Http){
        this.url = GLOBAL.url;
    }

    public addAlbum(token, album: Album){
        let params = JSON.stringify(album);
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });

        return this._http.post(this.url + 'album', params, {headers: headers})
                    .pipe(map(res => res.json()));
    }

    public getAlbums(token, artistId = null){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });
        let options = new RequestOptions({headers: headers});
        if(!artistId){
            return this._http.get(this.url + 'albums', options).pipe(map(res => res.json()));
        }else{
            return this._http.get(this.url + 'albums/' + artistId, options).pipe(map(res => res.json()));
        }
    }

    public getAlbum(token, albumId){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url + 'album/' + albumId, options)
                            .pipe(map(res => res.json()));
    }

    public updateAlbum(token, albumId, album: Album){
        let params = JSON.stringify(album);
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });

        return this._http.put(this.url + 'album/' + albumId, params, {headers: headers})
                    .pipe(map(res => res.json()));
    }
    
    public deleteAlbum(token, albumId){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });
        let options = new RequestOptions({headers: headers});

        return this._http.delete(this.url + 'album/' + albumId, options).pipe(map(res => res.json()));
    }
}