import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }


  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.crearForm();
    this.uiSubscription = this.store.select('ui').subscribe(ui => this.loading = ui.isLoading);
  }

  crearForm() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  crearUsuario() {

    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());
    // loading de sweet alert
    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    const { nombre, correo, password } = this.form.value

    this.authService.crearUsuario(nombre, correo, password).then(
      credenciales => {
        // Swal.close();
        this.store.dispatch(ui.stopLoading());

        this.router.navigateByUrl('/')

      }
    ).catch(error => {
      this.store.dispatch(ui.stopLoading());

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message
      });
    });

  }

}
