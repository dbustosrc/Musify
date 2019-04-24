import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { identity } from 'rxjs';
import { GLOBAL } from '../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit{
    
    public titulo: string;
    public user:User;
    public identity;
    public token: string;
    public userEditMessage: string;
    public filesToUpload: Array<File>;
    public url: string;

    constructor(
        private _userService: UserService
    ){
        this.titulo = 'Perfil';
        
        //Local storage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        this.url = GLOBAL.url;
        this.user = this.identity;
    }

    public ngOnInit(){
        console.log('user-edit');
    }

    public onSubmit(){
        this._userService.updateUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.userEditMessage = 'No se ha podido actualizar el usuario';
                }else{
                    //this.user = response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    //document.getElementById("identity_name").innerHTML = this.user.name + ' ' + this.user.surname;
                    
                    if(!this.filesToUpload){
                        //Redirect
                    }else{
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload).then(
                            (result: any) =>{
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                let imagePath = this.url+'get-image-user/'+this.user.image;
                                document.getElementById("image_logged").setAttribute('src', imagePath);
                            }
                        );
                    }

                    this.userEditMessage = 'Datos actualizados';
                }
            }, error =>{
                var errorMessage = <any>error;
                if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.userEditMessage = body.message;
                }
            }
        )
    }

    public fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    public makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        var token = this.token;

        return new Promise(function(resolve, reject){
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i = 0; i < files.length; i++){
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}