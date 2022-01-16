import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResourceService } from '../../../services/resource.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  passwordMinLength: number = 5

  form: FormGroup = this.fb.group({
    username: ['guest@email.com', [Validators.email, Validators.required]],
    password: ['guest', [Validators.required, Validators.minLength(this.passwordMinLength)]]
  })

  error: any
  message: string

  constructor(
    private resourceService: ResourceService,
    private readonly fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.message = params['message']
    });
    this.form.valueChanges.subscribe(lastValue => this.error = null)
  }

  async submitForm() {
    try {
      await this.spinnerService.show("login-spinner")
      const user = await Promise.resolve(
        this.resourceService.getPromise(this.resourceService.postData('login', this.form.value))
      )
      localStorage.setItem('user', user.user.email)
      localStorage.setItem('token', user.login.token)
      await this.spinnerService.hide("login-spinner")
      this.router.navigate(['admin/plannings'])
    } catch (error) {
      this.error = error
      this.spinnerService.hide("login-spinner")
    }
  }


}
