import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { rejects } from 'assert';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService : AuthenticationService,
    private router : Router
  ) { }

  ngOnInit() {
    this.initSigninForm();
  }

  initSigninForm(){
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmitSigninForm(){
    const email = this.signinForm.get('email').value;
    const password = this.signinForm.get('password').value;
    /*if(password === passwordConfirm){ //Si on crée un autre champ pour retaper le mot de passe
    }*/
    this.authenticationService.signInUser(email, password).then(
      (data) => {
        this.router.navigate(['/admin', 'dashboard']); // interpétré de la manière suivante : /admin/dashboard 
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    )
  }
}
