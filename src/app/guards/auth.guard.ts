import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AlertType } from '../enums/alert-type.enum';
import { Alert } from '../classes/alert';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  constructor(private router:Router,
              private authService:AuthService,
              private alertService:AlertService){}
       
              canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
               
                 if(JSON.parse(localStorage.getItem('user'))){
                 
                  return true;
              
                 }else{
                  
                  this.alertService.alerts.next(new Alert('Please Login First, to access the page', AlertType.Danger));
                  this.router.navigate(['/login'], {queryParams:{returnUrl:state.url}});
                 }
              }
            }
  // canActivate(
  //   next:ActivatedRouteSnapshot,
  //   state:RouterStateSnapshot
  // ):Observable<boolean> | boolean{
  //   return this.authService.currentUser.pipe(
  //     take(1),
  //     map((currentUser)=> !!currentUser),
  //     tap((loggedIn)=>{
  //     if(!loggedIn){
  //       this.alertService.alerts.next(new Alert('Please Login First, to access the page', AlertType.Danger));
  //       this.router.navigate(['/login'], {queryParams:{returnUrl:state.url}});
  //     }
  //   })
  //   )

// }
