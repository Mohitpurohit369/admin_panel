import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../../shared/services/golbal';
import { DataService } from '../../../../shared/services/data.service';
import { error } from 'console';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit{
  productForm: FormGroup;
  editMode: boolean = false;
  selectedBrandId: string = '';
  objRows: any;
  submitted: boolean = false;
  counter: number = 0;
  fileToUpload :any= [];
  objSizes:any = [];
  objTags:any = [];
  objColors:any;
  objCategories :any;
  objsubCategories :any;
  sizes = ['Small', 'Medium', 'Large', 'Extra Large']; // Options for dropdowns
  objRow: any;
  productId: number = 0;
  bigImage:any = "assets/images/pro3/1.jpg";
  url:any = [
    { img: 'assets/images/noimage.png' },
    { img: 'assets/images/noimage.png' },
    { img: 'assets/images/noimage.png' },
    { img: 'assets/images/noimage.png' },
    { img: 'assets/images/noimage.png' }
  ];

  constructor(private _dataService: DataService,private fb: FormBuilder,private _toastr: ToastrService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      salePrice: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      productCode: ['', [Validators.required, Validators.minLength(3)]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      size: ['', Validators.required],
      tag: ['', Validators.required],
      category_id: ['', Validators.required],
      sub_category_id: ['', Validators.required],
      color: ['', Validators.required],
      total_products: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });


   
  
    
  } 

  ngOnInit(): void {
    // this.setFormState(); 
    this.getSizes();
    this.getCategories();
    this.getColors();
    this.getTags();
    this.getsubCategories();

    // if (this.productId && this.productId != null && this.productId > 0) {
    //   this.getProductById();
    // }
  }

  get f() {
    return this.productForm.controls;
  }

  // fileList: (File | null)[] = Array(6).fill(null); // Allow empty slots

  // onFileSelected(event: Event, index: number): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.fileList[index] = input.files[0]; // Assign file to correct index
  //   }
  // }

  

  upload(files: any, i: number) {
    debugger;
    if (files.Length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastr.error("Only images are supported !!", "ProductMaster Master");
    
      return;
    }

    this.fileToUpload[i] = files[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.url[i].img = reader.result;
      this.bigImage = reader.result;
    }

  }
  
  onSubmit() {
    this.submitted = true;
    console.log("FormData prepared for submission 1");
  
    // Ensure exactly 5 images are uploaded
    // const uploadedFiles = this.fileList.filter(file => file !== null) as File[];
    // if (uploadedFiles.length !== 5) {
    //   this._toastr.error("Please upload exactly 5 images per product!", "Product Master");
    //   return;
    // }
  
    const formData = new FormData();
    const controls = this.productForm.controls;
  
    formData.append("name", controls['name'].value);
    formData.append("title", controls['title'].value);
    formData.append("productCode", controls['productCode'].value);
    formData.append("price", controls['price'].value); // Fix capitalization
    formData.append("salePrice", controls['salePrice'].value);
    formData.append("discount", controls['discount'].value);
    formData.append("size", controls['size'].value);
    formData.append("color", controls['color'].value);
    formData.append("tag", controls['tag'].value);
    formData.append("category_id", controls['category_id'].value); // Fix naming
    formData.append("sub_category_id", controls['sub_category_id'].value);
    formData.append("total_products", controls['total_products'].value);
    formData.append("description", controls['description'].value);
  
    // Append images to FormData
    // uploadedFiles.forEach((file, index) => {
    //   console.log("FormData prepared for submission 2");
    //   formData.append(`Image${index + 1}`, file, file.name);
    // });




    // if (this.fileToUpload) {
    //   for (let i = 0; i < this.fileToUpload.length; i++) {
    //     let ToUpload = this.fileToUpload[i];
    //     formData.append("Image", ToUpload, ToUpload.name);

    //     // formData.append("Image", this.fileToUpload[i], this.fileToUpload[i].name);
    //   }
    // }



      // ✅ File Upload Handling
  if (this.fileToUpload && this.fileToUpload.length > 0) {
    for (const file of this.fileToUpload) {
      formData.append("images", file, file.name); // Fix naming
    }
  } else {
    this._toastr.warning("Please select at least one image!", "Validation Error");
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
      // ✅ API Call with Error Handling
  this._dataService.post(Global.BASE_API_PATH + "add-product", formData).subscribe(
    (res) => {
      if (res.success) {
        this._toastr.success("Product saved successfully!", "Success");
        this.resetForm();
      } else {
        this._toastr.error(res.errors, "Error");
      }
    },
    (err) => {
      console.error("Submission failed", err);
      this._toastr.error(err.message || "Submission failed!", "Error");
    }
  );
}
    

    
  
    console.log("FormData prepared for submission 3");
  }


 


  increment() {
    this.counter++;
    this.productForm.controls['quantity'].setValue(this.counter);
  }
  
  decrement() {
    if (this.counter > 1) { // Prevent quantity from going below 1
      this.counter--;
      this.productForm.controls['quantity'].setValue(this.counter);
    }
  }


  getSizes() {
    this._dataService.get(Global.BASE_API_PATH + "get-size").subscribe(res => {
      
      if (res.success) {
  //  console.log("here data get size",res.data);
        this.objSizes = res.data;
      } else {
        this._toastr.error(res.errors, 'Product Master');
      }
    },error=>{

    });
  }
  getTags() {
    this._dataService.get(Global.BASE_API_PATH + "get-tag").subscribe(res => {
      if (res.success) {
        // console.log("here tag",res.data);
        this.objTags = res.data;
        // console.log("here tag",this.objTags);
      } else {
        this._toastr.error(res.errors, 'Product Master');
      }
    },error=>{

    });
  }
  getColors() {
    this._dataService.get(Global.BASE_API_PATH + "get-color").subscribe(res => {
      if (res.success) {
        this.objColors = res.data;
        console.log("here data get color",res.data);
      } else {
        this._toastr.error(res.errors, 'Product Master');
      }
    },error=>{

    });
  }
  getCategories() {
    
    this._dataService.get(Global.BASE_API_PATH + "get-category").subscribe((res:any) => {
     
      if (res.success) {
        console.log("here data category",res.data);
        this.objCategories = res.data;
      } else {
        this._toastr.error(res.errors, 'Product Master');
      }
    },error=>{

    });;
  }


  getsubCategories() {
    this._dataService.get(Global.BASE_API_PATH + "get-sub-category").subscribe((res:any) => {
      console.log("here data category",res.data);
      if (res.success) {
        console.log("here data category",res.data);
        this.objsubCategories = res.data;
      } else {
        this._toastr.error(res.errors, 'Product Master');
      }
    },error=>{

    });;
  }
  getProductById() {
    this._dataService.get(Global.BASE_API_PATH + "ProductMaster/GetbyId/" + this.productId).subscribe(res => {
      if (res.isSuccess) {
        this.objRow = res.data;
        this.productForm.patchValue(this.objRow);

        // this.productForm.controls['isSale'].setValue(this.objRow.isSale == 1 ? true : false);
        // this.productForm.controls['isNew'].setValue(this.objRow.isNew == 1 ? true : false);

        this.counter = this.objRow.quantity;


        this._dataService.get(Global.BASE_API_PATH + "ProductMaster/GetProductPicturebyId/" + this.productId).subscribe(res => {
          if (res.isSuccess) {
            if (res.data.length > 0) {
              // this.url = [
              //   { img: res.data[0] != null ? Global.BASE_IMAGES_PATH + res.data[0].name : 'assets/images/noimage.png' },
              //   { img: res.data[1] != null ? Global.BASE_IMAGES_PATH + res.data[1].name : 'assets/images/noimage.png' },
              //   { img: res.data[2] != null ? Global.BASE_IMAGES_PATH + res.data[2].name : 'assets/images/noimage.png' },
              //   { img: res.data[3] != null ? Global.BASE_IMAGES_PATH + res.data[3].name : 'assets/images/noimage.png' },
              //   { img: res.data[4] != null ? Global.BASE_IMAGES_PATH + res.data[4].name : 'assets/images/noimage.png' },
              // ];
            }
          } else {
            this._toastr.error(res.errors[0], 'Product Master');
          }
        });

      } else {
        this._toastr.error(res.errors[0], 'Product Master');
      }
    });
  }
  

  
    onEdit(id: string) {
      this.editMode = true;
      this.selectedBrandId = id;
      // this.switchTab('add');
  
      const selectedBrand = this.objRows.find((b: any) => b._id === id);
  
      if (!selectedBrand) {
          // console.warn("Brand not found for ID:", id);
          return;
      }
  
      this.productForm.controls['name'].setValue(selectedBrand.name);
  
      // ✅ Correct way to show image preview
      if (selectedBrand.image) {
          // console.log("Existing image: ", selectedBrand.image);
          // this.imagePreview = selectedBrand.image; // Display existing image URL
      } else {
          // this.imagePreview = null;
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
              // this.getData();
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
      this.productForm.reset();
      this.editMode = false;
      // this.selectedBrandId = '';
      // this.imagePreview = ''; // Reset preview
    }

    onCancel(): void {
      this.productForm.reset();
      this.submitted = false;
    }
}
