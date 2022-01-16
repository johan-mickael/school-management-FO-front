import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from 'src/app/services/resource.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  passwordMinLength: number = 5

  form: FormGroup = this.fb.group({
    username: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]]
  })

  error: any
  message: string | null

  constructor(
    private resourceService: ResourceService,
    private readonly fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient) {
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
      const options = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        }, mode: 'no-cors',
      }
      const user = await Promise.resolve(
        new Promise<any>((resolve, reject) => {
          this.httpClient.post(environment.apiUrl + 'login', JSON.stringify(this.form.value), options).subscribe(
            (data) => {
              console.log(data)
              resolve(data)
            },
            (error) => {
              reject(error)
            })
        })
      )
      localStorage.setItem('user', user.user.email)
      localStorage.setItem('token', user.login.token)
      localStorage.setItem('role', user.user.role)
      await this.spinnerService.hide("login-spinner")
      this.router.navigate(['admin/plannings'])
    } catch (error) {
      this.message = null
      this.error = error
      this.spinnerService.hide("login-spinner")
    }
  }


}
