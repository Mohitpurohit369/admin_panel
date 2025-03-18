import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../shared/services/data.service';
import { fileValidator } from '../../../../validations/validations.validator';
import { Global } from '../../../../shared/services/golbal';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrl: './subcategory.component.css'
})
export class SubcategoryComponent implements OnInit {

  showcategort = false;
  sub_categoryForm: FormGroup;
 objRows = [];
  selectedFile: File | null = null;
  categories:any = [];

  constructor(private fb: FormBuilder, private _dataService: DataService) {
    this.sub_categoryForm = this.fb.group({
      category_id: ['', Validators.required],
      sub_category: ['', Validators.required],
      // images: [null, [Validators.required, fileValidator()]] // Apply custom file validator here
    });
  }
  ngOnInit(): void {
   this.allcategoryget();
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
      this.sub_categoryForm.get('images')?.setValue(input.files); // Set the file to the form control
    } else {
      console.error('No file selected');
    }
  }



  onSubmit() {
    debugger;
    if (this.sub_categoryForm.valid) {
      console.log('Form submitted:', this.sub_categoryForm.value);
      const formData = new FormData();
      formData.append('category_id', this.sub_categoryForm.get('category_id')?.value);
      formData.append('sub_category', this.sub_categoryForm.get('sub_category')?.value);

      if (this.selectedFile) {
        formData.append('images', this.selectedFile);
      } else {
        console.error('No image selected');
        alert('Please select an images');
        return;
      }

      console.log('Form submitted:', this.sub_categoryForm.value);

      this._dataService.post(Global.BASE_API_PATH + "add-sub-category", formData).subscribe((res)=>{
        
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
allcategoryget(){
  this._dataService.get(Global.BASE_API_PATH +"get-category").subscribe((res)=>{
    // console.log("here category data",res.data);
    this.categories = res.data;
  })
}
}
