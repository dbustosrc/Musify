import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Injectable()
export class SongService{
    public url: string;

    constructor( private _http: Http){
        this.url = GLOBAL.url;
    }

    public addSong(token, song: Song){
        let params = JSON.stringify(song);
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });

        return this._http.post(this.url + 'song', params, {headers: headers})
                    .pipe(map(res => res.json()));
    }

    public getSongs(token, albumId = null){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });
        let options = new RequestOptions({headers: headers});
        if(!albumId){
            return this._http.get(this.url + 'songs', options).pipe(map(res => res.json()));
        }else{
            return this._http.get(this.url + 'songs/' + albumId, options).pipe(map(res => res.json()));
        }
    }

    public getSong(token, songId){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url + 'song/' + songId, options)
                            .pipe(map(res => res.json()));
    }

    public updateSong(token, songId, song: Song){
        let params = JSON.stringify(song);
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });

        return this._http.put(this.url + 'song/' + songId, params, {headers: headers})
                    .pipe(map(res => res.json()));
    }
    
    public deleteSong(token, songId){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });
        let options = new RequestOptions({headers: headers});

        return this._http.delete(this.url + 'song/' + songId, options).pipe(map(res => res.json()));
    }
}