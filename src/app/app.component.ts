import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'Musify';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public signUpMessage;
  public url: string;

  constructor(
    private _userService:UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
    //Get user identification data
    this._userService.login(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          this.errorMessage = "El usuario no está corréctamente identificado";
        }else{
          //Create local storage user sign-in element 
          localStorage.setItem('identity', JSON.stringify(identity));

          //Get user token
          this._userService.login(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;
      
              if(this.token.lenght <= 0){
                alert("El token no se ha generado");
              }else{
                //Create local storage token element 
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
      
            }, error => {
              var errorMessage = <any>error;
              if(errorMessage != null){
                var body = JSON.parse(error._body)
                this.errorMessage = body.message;
              }
            }
          )
        }

      }, error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body)
          this.errorMessage = body.message;
        }
      }
    )
  }

  public logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');

    this.identity = null;
    this.token = null;

    this._router.navigate(['/']);
  }

  public onSubmitRegister(){
    this._userService.signUp(this.user_register).subscribe(
      response =>{
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.signUpMessage = 'Error al registrarse';
        }else{
          this.signUpMessage = 'Se ha registrado el usuario, ahora puede iniciar sesión';
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      }, error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.signUpMessage = body.message;
        }
      }
    )
  }
}
