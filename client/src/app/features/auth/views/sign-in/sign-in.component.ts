import { AuthService } from './../../auth.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sign-in-veiw',
  templateUrl: './sign-in.component.html',
  host: {
    'class': 'flex flex-col'
  }
})
export class SignInComponent {

  signInForm = this.formBuilder.group({
    email: ['email@email.com', Validators.email],
    password: ['password', Validators.required],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService
  ) { }

  ngOnInit (): void {
  }

  onSubmit () {
    const { email, password } = this.signInForm.value
    this.authService.signIn(email, password).subscribe(console.log)
  }

}
