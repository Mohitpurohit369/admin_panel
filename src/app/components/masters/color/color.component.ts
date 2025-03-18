import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../shared/services/golbal';
import { NoWhiteSpaceValidator, TextFieldValidator } from '../../../validations/validations.validator';
import Swal from 'sweetalert2';
import { error } from 'node:console';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrl: './color.component.css'
})
export class ColorComponent {
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
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10)
      ])],
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10)
      ])]
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





  onSubmit() {
    this.submitted = true;
    if (this.brandForm.invalid) {
      return;
    }
    // const formData = new FormData();
    // formData.append('name', this.brandForm.get('name')?.value);
    // formData.append('code', this.brandForm.get('code')?.value);
    
    // formData.append('id', this.brandForm.get('_id')?.value);
    // const imageFile = this.brandForm.get('image')?.value;


  
    if (this.editMode && this.selectedBrandId) {
      this._dataService.put(Global.BASE_API_PATH + "update-color/", this.selectedBrandId, this.brandForm.value).subscribe((res) => {
        if(res.success){
          console.log("here updates");
          // alert('Brand updated successfully!');
          this._toastr.success("Brand updated successfully! !!", "BrandLogo Master");
          this.resetForm();
        }
      });
    } 
    else {
      console.log("here updates2");
      this._dataService.post(Global.BASE_API_PATH + "color",this.brandForm.value).subscribe((res:any) => {
        console.log('Form Submitted', res);
        if (res.success) {
          this._toastr.success("Data saved successfully !!", "Color Master");
          // this.setForm();
          this.resetForm();
          // this.switchTab('add');

        } else {
          this._toastr.error(res.errors, 'Color Master');
        }
      },(err) => {
        console.error("Submission failed", err);
        this._toastr.error(err.msg || "Submission failed!", "Color Master");
      }
    )
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
    this._dataService.get(Global.BASE_API_PATH + "get-color").subscribe(res => {
      if (res.success) {

        this.objRows = res.data;
        // this.objRows = res.data.map((band: any) => ({
        //   ...band,
        //   image: `http://localhost:5000/api/${band.image}` // ✅ Prepend Base URL
        // }));
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
    this.brandForm.controls['code'].setValue(selectedBrand.code);

 
   

    
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
        this._dataService.delete(Global.BASE_API_PATH + "delete-color/", id).subscribe(res => {
          console.log("here",res.data);
          if (res.success) {
            Swal.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            );
            this.getData();
          } else {
            this._toastr.error(res.errors, 'Color Master');
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
