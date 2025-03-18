import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../shared/services/data.service';
import { fileValidator } from '../../../../validations/validations.validator';
import { Global } from '../../../../shared/services/golbal';
 // Import the custom validator


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{
  showcategort = false;
  categoryForm: FormGroup;
  objRows = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private _dataService: DataService) {
    this.categoryForm = this.fb.group({
      category: ['', Validators.required],
      // images: [null, [Validators.required, fileValidator()]] // Apply custom file validator here
    });
  }
  ngOnInit(): void {
    this.getData();
  }

  addCategory() {
    this.showcategort = true;
  }

  closeModal() {
    this.showcategort = false;
  }



  upload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile);
      this.categoryForm.get('images')?.setValue(input.files); // Set the file to the form control
    } else {
      console.error('No file selected');
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      console.log('Form submitted:', this.categoryForm.value);
      const formData = new FormData();
      formData.append('category', this.categoryForm.get('category')?.value);

      if (this.selectedFile) {
        formData.append('images', this.selectedFile);
      } else {
        console.error('No image selected');
        alert('Please select an image');
        return;
      }

      console.log('Form submitted:', this.categoryForm.value);

      this._dataService.post(Global.BASE_API_PATH + "add-category", formData).subscribe((res)=>{
        
          console.log('Response:', res.data);
          alert('Category added successfully!');
          this.closeModal();
        
        
      },(err) => {
        console.error('Error:', err.msg);
        alert('Something went wrong. Please try again.');
      });
    } else {
      console.log('Form is invalid');
    }
  }


  getData() {
    this._dataService.get(Global.BASE_API_PATH + "get-category").subscribe(res => {
      if (res.success) {
        console.log("here all category", res.data)
        this.objRows = res.data;
      } else {
        // this._toastr.error(res.errors[0], 'BrandLogo Master');
      }
    });
  }
}
