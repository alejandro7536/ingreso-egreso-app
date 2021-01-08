import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.crearForm();
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

    
    // loading de sweet alert
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const { nombre, correo, password } = this.form.value

    this.authService.crearUsuario(nombre, correo, password).then(
      credenciales => {
        Swal.close();
        this.router.navigateByUrl('/')
        
      }
    ).catch(error =>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message
      });
    });

  }

}
