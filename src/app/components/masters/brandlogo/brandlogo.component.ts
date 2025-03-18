import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../shared/services/golbal';
import { NoWhiteSpaceValidator, TextFieldValidator } from '../../../validations/validations.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brandlogo',
  templateUrl: './brandlogo.component.html',
  styleUrl: './brandlogo.component.css'
})
export class BrandlogoComponent implements OnInit {
  activeTab: string = 'add';
  buttonText!: string;
  brandForm!: FormGroup;
  submitted = false;
  imagePreview: string | ArrayBuffer | null = null;
  objRows: any;
  objRow: any;
  editMode: boolean = false;
  selectedBrandId: string = '';



  constructor(private _dataService: DataService, private fb: FormBuilder, private _toastr: ToastrService) {
    // this.getData();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getData();
  }

  initializeForm() {
    this.brandForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        TextFieldValidator.validTextField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ]],
      image: [null, Validators.required]
    });
  }


  // Switch Tabs (Login/Register)
  switchTab(tab: string) {
    this.getData();
    this.activeTab = tab;
  }
  // Getter for easy access to form controls
  get f() {
    return this.brandForm.controls;
  }



  // Handle Image Upload
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.brandForm.patchValue({ image: file });
      this.brandForm.get('image')?.updateValueAndValidity();

      // Preview Image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    console.log(this.brandForm.valid);
    this.submitted = true;
    if (this.brandForm.invalid) {
      return;
    }
    const formData = new FormData();

    formData.append('name', this.brandForm.get('name')?.value);
    formData.append('id', this.brandForm.get('_id')?.value);
    const imageFile = this.brandForm.get('image')?.value;


    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      // console.error('No image selected');
      alert('Please select an image');
      return;
    }
    if (this.editMode && this.selectedBrandId) {
      this._dataService.put(Global.BASE_API_PATH + "update-logo/", this.selectedBrandId, formData).subscribe((res) => {
        if(res.success){
          console.log("here updates",formData);
          // alert('Brand updated successfully!');
          this._toastr.success("Brand updated successfully! !!", "BrandLogo Master");
          this.resetForm();
        }
      });
    } 
    else {
      this._dataService.post(Global.BASE_API_PATH + "brand-logos", formData).subscribe((res) => {
        // console.log('Form Submitted', res.data);
        if (res.success) {
          this._toastr.success("Data saved successfully !!", "BrandLogo Master");
          // this.setForm();
          this.resetForm();
          // this.switchTab('add');

        } else {
          this._toastr.error(res.errors, 'BrandLogo Master');
        }
      })
    }




  }

  onCancel(): void {
    this.brandForm.reset();
    this.submitted = false;
  }


  // getData() {
  //   this._dataService.get(Global.BASE_API_PATH + "get-logos").subscribe(res => {
  //     if (res.success) {
  //       this.objRows = res.data;
  //       console.log("here data", res.data)
  //     } else {
  //       this._toastr.error(res.errors, 'BrandLogo Master');
  //     }
  //   });
  // }



  // onEdit(id: string) {
  //   this.editMode = true;
  //   this.selectedBrandId = id;
  //   this.switchTab('add');
  
  //   const selectedBrand = this.objRows.find((b: any) => b._id === id);
  //   console.log("here data id ",selectedBrand.image);
  //   if (selectedBrand) {
  //     this.brandForm.controls['name'].setValue(selectedBrand.name);
  
  //     // If an image exists, set preview
  //     if (selectedBrand.image) {
  //       console.log("here data id ",selectedBrand.image);
  //       // this.brandForm.controls['image'].setValue(selectedBrand.image);
  //       this.brandForm.get('image')?.setValue(selectedBrand.image);
  //       this.imagePreview = selectedBrand.image.toString(); // Show existing image preview
  //     }
  //   }
  // }

  // getData() {
  //   this._dataService.get(Global.BASE_API_PATH + "get-logos").subscribe(res => {
  //     if (res.success) {
  //       this.objRows = res.data.map((band: any) => ({
  //         ...band,
  //         image: band.image.startsWith('/public/') ? `http://localhost:5000${band.image}` : band.image
  //       }));
  //       console.log("Updated image paths", this.objRows);
  //       this.objRows = res.data;
  //     } else {
  //       this._toastr.error(res.errors, 'BrandLogo Master');
  //     }
  //   });
  // }
  
  getData() {
    this._dataService.get(Global.BASE_API_PATH + "get-logos").subscribe(res => {
      if (res.success) {
        this.objRows = res.data.map((band: any) => ({
          ...band,
          image: `http://localhost:5000/api/${band.image}` // ✅ Prepend Base URL
        }));
        // console.log("Updated image paths", this.objRows);
      } else {
        this._toastr.error(res.errors, 'BrandLogo Master');
      }
    });
  }
  
  

  onEdit(id: string) {
    this.editMode = true;
    this.selectedBrandId = id;
    this.switchTab('add');

    const selectedBrand = this.objRows.find((b: any) => b._id === id);

    if (!selectedBrand) {
        // console.warn("Brand not found for ID:", id);
        return;
    }

    this.brandForm.controls['name'].setValue(selectedBrand.name);

    // ✅ Correct way to show image preview
    if (selectedBrand.image) {
        // console.log("Existing image: ", selectedBrand.image);
        this.imagePreview = selectedBrand.image; // Display existing image URL
    } else {
        this.imagePreview = null;
    }

    
}

  Delete(id: string) {
    let obj = {
      id: id
      
    };
    console.log("here data",id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._dataService.delete(Global.BASE_API_PATH + "delete-logo/", id).subscribe(res => {
          console.log("here",res.data);
          if (res.success) {
            Swal.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            );
            this.getData();
          } else {
            this._toastr.error(res.errors, 'BrandLogo Master');
          }
        });


      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your record is safe :)',
          'error'
        )
      }
    }
    )
  }

  resetForm() {
    this.brandForm.reset();
    this.editMode = false;
    this.selectedBrandId = '';
    this.imagePreview = ''; // Reset preview
  }
}
