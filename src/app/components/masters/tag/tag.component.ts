import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../shared/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../shared/services/golbal';
import { NoWhiteSpaceValidator, TextFieldValidator } from '../../../validations/validations.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent {
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
    console.log(this.brandForm.value);
    this.submitted = true;
    if (this.brandForm.invalid) {
      return;
    }
    const formData = new FormData();

    formData.append('size', this.brandForm.get('name')?.value);
    
   
    if (this.editMode && this.selectedBrandId) {
      this._dataService.put(Global.BASE_API_PATH +"update-tag/", this.selectedBrandId, this.brandForm.value).subscribe((res:any) => {
        if(res.success){
           console.log(this.brandForm.value);
        
          // alert('Brand updated successfully!');
          this._toastr.success("Brand updated successfully! !!", "BrandLogo Master");
          this.resetForm();
        }
      });
    } 
    else {
      this._dataService.post(Global.BASE_API_PATH + "tag", this.brandForm.value).subscribe((res) => {
        console.log('Form Submitted', res.data);
        if (res.success) {
          this._toastr.success("Data saved successfully !!", "tag Master");
          // this.setForm();
          this.resetForm();
          this.switchTab('add');

        } else {
          this._toastr.error(res.errors, 'BrandLogo Master');
        }
      },(err) => {
        console.error("Submission failed", err);
        this._toastr.error(err.msg || "Submission failed!", "size Master");
      })
    }




  }

  onCancel(): void {
    this.brandForm.reset();
    this.submitted = false;
  }





  
  getData() {
    this._dataService.get(Global.BASE_API_PATH + "get-tag").subscribe(res => {
      if (res.success) {
        this.objRows =res.data;
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
        this._dataService.delete(Global.BASE_API_PATH + "delete-tag", id).subscribe(res => {
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
