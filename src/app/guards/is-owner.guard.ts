import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AlertType } from '../enums/alert-type.enum';
import { Alert } from '../classes/alert';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsOwnerGuard implements  CanActivate{
  constructor(private authService:AuthService, private router:Router, private alertService:AlertService){}
  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean>{
    return this.authService.currentUser.pipe(
      take(1),
      map((currentUser)=>!!currentUser && currentUser.id === next.params.userId),
      tap(isOwner=>{
        if(!isOwner){
          this.alertService.alerts.next(new Alert('You can only Edit Your Profile',AlertType.Danger));
          this.router.navigate(['/login'], {queryParams:{returnUrl:state.url}})
        }
      }
    )
    )}
}
