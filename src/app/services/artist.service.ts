import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService{
    public url: string;

    constructor( private _http: Http){
        this.url = GLOBAL.url;
    }

    public addArtist(token, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });

        return this._http.post(this.url + 'artist', params, {headers: headers})
                    .pipe(map(res => res.json()));
    }

    public getArtists(token, page){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });
        let options = new RequestOptions({headers: headers});

        return this._http.get(this.url + 'artists/' + page, options).pipe(map(res => res.json()));
    }

    public getArtist(token, artistId){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url + 'artist/' + artistId, options)
                            .pipe(map(res => res.json()));
    }

    public updateArtist(token, artistId, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });

        return this._http.put(this.url + 'artist/' + artistId, params, {headers: headers})
                    .pipe(map(res => res.json()));
    }
    
    public deleteArtist(token, artistId){
        let headers = new Headers({
            'Content-Type' : 'application/json',
            'Authorization' : token
        });
        let options = new RequestOptions({headers: headers});

        return this._http.delete(this.url + 'artist/' + artistId, options).pipe(map(res => res.json()));
    }
}