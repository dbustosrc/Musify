import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { UserService } from '../services/user.service';

@Component({
    selector: 'home',
    templateUrl: '../views/home.html',
    providers: []
})

export class HomeComponent implements OnInit{
    public titulo: string;
    public identity;
    public token: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
        this.titulo = '';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    public ngOnInit(){
        console.log('home');
    }
}