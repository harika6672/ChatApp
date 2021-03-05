import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators }  from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enums/alert-type.enum';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{
  public signupForm:FormGroup;
  private subscriptions:Subscription[]=[]
  constructor(private fb:FormBuilder,
             private alertService:AlertService, 
             private auth:AuthService,
             private loadingService:LoadingService,
             private router:Router) { }

  ngOnInit() {
    this.createForm();
  }
  private createForm():void{
    this.signupForm=this.fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      email:['',[Validators.email, Validators.required]],
      password:['',[Validators.required, Validators.minLength(8)]]
    })
  }

  public submit():void{

    if(this.signupForm.valid){
      this.loadingService.isLoading.next(true);
      const {firstName, lastName, email, password}=this.signupForm.value;
      // console.log(`This is my email ${email} and password is ${password}`);
      console.log("before auth")
      this.auth.signup(firstName, lastName, email, password);
       console.log("After auth")
       }   
        else{
          const failedSignupAlert=new Alert('Please fill all the fields',AlertType.Danger);
          this.alertService.alerts.next(failedSignupAlert);
        }
      
  }
}
  

