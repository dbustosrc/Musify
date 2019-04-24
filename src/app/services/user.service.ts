import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()
export class UserService{
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http){
        this.url = GLOBAL.url;
    }

    public login(user_to_login, gethash = null){
        if(gethash != null){
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;

        let headers = new Headers({'Content-Type':'application/json'});
        
        return this._http.post(this.url+'loginUser', params, {headers: headers})
                            .pipe(map(res => res.json()));
    }

    public signUp(user_to_signup){
        let json = JSON.stringify(user_to_signup);
        let params = json;

        let headers = new Headers({'Content-Type':'application/json'});
        
        return this._http.post(this.url+'registerUser', params, {headers: headers})
                            .pipe(map(res => res.json()));
    }

    public updateUser(user_to_update){
        let json = JSON.stringify(user_to_update);
        let params = json;

        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': this.getToken()
        });
        
        return this._http.put(this.url+'updateUser/'+user_to_update._id, params, {headers: headers})
                            .pipe(map(res => res.json()));
    }

    public getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;
    }

    public getToken(){
        let token = localStorage.getItem('token');

        if(token != 'undefined'){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }
}