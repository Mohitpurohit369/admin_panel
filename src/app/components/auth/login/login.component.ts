import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatchValidator } from '../../../validations/validations.validator';
import { Global } from '../../../shared/services/golbal';
import { AuthService } from '../auth.service';
import { DataService } from '../../../shared/services/data.service';

import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 activeTab: string = 'login'; // Default tab
  loginForm: any;
  registerForm: any;
  strMsg!: string;
  submitted: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private _toastr: ToastrService ,private fb: FormBuilder ,private _authgService: AuthService, private _dataService: DataService) {
    // Initialize login form
   

 
    

    // console.log("here for sdsa",this.loginForm.get('email')?.value == '');

  }

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegisterForm();
    // console.log("here data response",this.loginForm.value);
 
    // const formData = new FormData();
    // console.log("here data response",formData);
    
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      // rememberMe: [false]
    });
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$")
      ]],
      image: [null, Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      type: [null, Validators.required]
    }); 
  }

  
  // Switch Tabs (Login/Register)
  switchTab(tab: string) {
    this.activeTab = tab;
  }

    // Handle Image Upload
    onImageUpload(event: any) {
      const file = event.target.files[0];
      if (file) {
        this.registerForm.patchValue({ image: file });
        this.registerForm.get('image')?.updateValueAndValidity();
  
        // Preview Image
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
    logformdata :any;
  // Handle Login Submission
  onLoginSubmit() {
    this.logformdata = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    };
    debugger;

    if (this.loginForm.get('email').value === "") {
      this._toastr.error("email is required !!", "Login");
    } else if (this.loginForm.get('password').value == "") {
      this._toastr.error("Password is required !!", "Login");
    } else {
      if (this.loginForm.valid) {
        this._dataService.post(Global.BASE_API_PATH + "login", this.logformdata).subscribe(res => {
          console.log("here data response",this.loginForm.value);
          if (res.success) {
            this._authgService.login(res.data);

            this.strMsg = this._authgService.getMessage();
            if (this.strMsg !== "") {
              this._toastr.error(this.strMsg, "Login");
              // this.resetLoginForm();
            }
          } else {
            this._toastr.error(res.errors, "Login");
            // this.resetLoginForm();
          }
        });
      } else {
        this._toastr.error("Invalid Crendiantial!!", "Login");
        // this.resetLoginForm();
      }
    }
  }

  // Handle Register Submission
  onRegisterSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    const formData = new FormData();

    // Append form fields
    formData.append('name', this.registerForm.get('name')?.value);
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('password', this.registerForm.get('password')?.value);
    formData.append('mobile', this.registerForm.get('mobile')?.value);
    formData.append('type', this.registerForm.get('type')?.value);
  
    // Append image (Check if an image is selected)
    const imageFile = this.registerForm.get('image')?.value;
    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      console.error('No image selected');
      alert('Please select an image');
      return;
    }
    this._dataService.post(Global.BASE_API_PATH + "resgister",formData ).subscribe((res) => {
      console.log("here data",res);
      if (res.suceess) {
        console.log("here data",res);
        this._toastr.success("Registration has been done !!", "Register");
        this.registerForm.reset();
        this.submitted = false;
        // this.elname.select('logintab');
        this.switchTab('login'); // Auto-switch to login after success
      } else {
        this._toastr.error(res?.msg ?? "Registration failed.", "Register");
      }
    },
    error => {
      console.error("API Error:", error);
      const errorMsg = error?.error?.msg || "Something went wrong. Please try again later.";
      this._toastr.error(errorMsg, "Register");
    }
  );
    

  }

  // onRegisterSubmit() {
  //   this.submitted = true;
  
  //   if (this.registerForm.invalid) {
  //     this._toastr.error("Please fill all required fields correctly.", "Register");
  //     return;
  //   }
  
  //   const formData = new FormData();
  //   formData.append('name', this.registerForm.get('name')?.value ?? '');
  //   formData.append('email', this.registerForm.get('email')?.value ?? '');
  //   formData.append('password', this.registerForm.get('password')?.value ?? '');
  //   formData.append('mobile', this.registerForm.get('mobile')?.value ?? '');
  //   formData.append('type', this.registerForm.get('type')?.value ?? '');
  
  //   // Append Image
  //   const imageFile = this.registerForm.get('image')?.value;
  //   if (imageFile) {
  //     formData.append('image', imageFile);
  //   } else {
  //     this._toastr.error("Please select an image.", "Register");
  //     return;
  //   }
  
  //   this._dataService.post(Global.BASE_API_PATH + "register", formData).subscribe(
  //     res => {
  //       if (res?.success) {
  //         this._toastr.success("Registration successful!", "Register");
  //         this.registerForm.reset();
  //         this.submitted = false;
  //         this.switchTab('login'); // Auto-switch to login after success
  //       } else {
  //         this._toastr.error(res?.msg ?? "Registration failed.", "Register");
  //       }
  //     },
  //     error => {
  //       console.error("API Error:", error);
  //       const errorMsg = error?.error?.msg || "Something went wrong. Please try again later.";
  //       this._toastr.error(errorMsg, "Register");
  //     }
  //   );
  // }
  
}
