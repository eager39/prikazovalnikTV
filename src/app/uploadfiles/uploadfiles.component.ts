import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import { ApiDataService } from '../api-data.service';
import { isNumber } from 'util';


@Component({
  selector: 'app-uploadfiles',
  templateUrl: './uploadfiles.component.html',
  styleUrls: ['./uploadfiles.component.scss']
})
export class UploadfilesComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  uspeh;
  napaka=false;
  images;
  videos;
  show;
  items;
  selectedtv;
  tvs;
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(private fb: FormBuilder,  private _dataService: ApiDataService,) {
    this.createForm();
  }
  imageForm = new FormGroup({
    red: new FormControl(''),
  })
  itemsForm = new FormGroup({
    ord: new FormControl(''),
    tv:new FormControl("")
  })
  tvsForm = new FormGroup({
    name: new FormControl(''),
    location: new FormControl(''),
  })
  uploadTextForm= new FormGroup({
    naslov:new FormControl(""),
    vsebina: new FormControl("")
  })


  createForm() {
    this.form = this.fb.group({
      
      avatar: null,
      display:new FormControl("")
    });
  }
  allImageVideo(tv){
    this._dataService.get("uredi",{ 
      params: {
        id:tv
      } }).subscribe(
      data => {
        console.log(data);
       this.items=data
       
      }
    )
  }
 
 

  async getTv(){
    this.tvs =await this._dataService.get("tvs").toPromise()
  }


  ngOnInit() {
   // this.allImageVideo()
this.getTVs()
  }
  deleteImg(id,name){
    
    this._dataService.add({"id":id,"name":name},"deleteImg").subscribe(
        (val) => {
        
          
            console.log("POST call successful value returned in body", 
                        val);
                         this.allImageVideo(this.selectedtv)
        },
        response => {
          console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now completed.");
        
        });
  

  }
  deleteVid(id,name){
    this._dataService.add({"id":id,"name":name},"deleteVid").subscribe(
        (val) => {
         this.allImageVideo(this.selectedtv);
          
            console.log("POST call successful value returned in body", 
                        val);
        },
        response => {
          console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now completed.");
        
        });
  

  }
  showhideImg(image){
    if(image.active==0){
      image.active=1;
     }else{
       image.active=0;
     }
     this._dataService.add({"id":image.id,"active":image.active},"showhideImg").subscribe(
      (val) => {
       this.allImageVideo(this.selectedtv);
        
          console.log("POST call successful value returned in body", 
                      val);
      },
      response => {
        console.log("POST call in error", response);
      },
      () => {
          console.log("The POST observable is now completed.");
      
      });

  }
  showhideVid(video){
    if(video.active==0){
      video.active=1;
     }else{
       video.active=0;
     }
     this._dataService.add({"id":video.id,"active":video.active},"showhideVid").subscribe(
      (val) => {
       this.allImageVideo(this.selectedtv);
        
          console.log("POST call successful value returned in body", 
                      val);
      },
      response => {
        console.log("POST call in error", response);
      },
      () => {
          console.log("The POST observable is now completed.");
      
      });

  }
  
  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: (reader.result as string).split(',')[1]
        })
      };
    }
  }

  onSubmit() {
    const formModel = this.form.value;
    console.log(formModel)
    this.loading = true;
    this._dataService.add({"item":this.form.value.avatar,"tvid":this.itemsForm.value.tv},"image").subscribe(
      data => {
        
          if(data){
            this.uspeh=true
            this.napaka=false
            this.allImageVideo(this.selectedtv);
          }else{
            this.napaka=true
          }
          
         this.loading=false;
         this.clearFile();
      },
      error => {
        console.log(error.statusText);
          this.loading = false;
        this.napaka=true;
      });
   
  }
  ifactive=0;
 async updateImgRed(id,value){
   this.ifactive=id
    
       let result=await this._dataService.add({"id":id,"red":value},"updateImgRed").toPromise()
      console.log(result)
      if(result){
        this.allImageVideo(this.selectedtv);
        this.show="";
      
    }
  
  }
  async updateItemDur(id,value,dur){
    if(dur==1000 && value=="-"){
      return false;
    }
    this.ifactive=id
     console.log("haha")
        let result=await this._dataService.add({"id":id,"red":value},"updateItemDur").toPromise()
       console.log(result)
       if(result){
         this.allImageVideo(this.selectedtv);
         this.show="";
       
     }
   
   }
  async addTVs(){
    
     var form=this.tvsForm.value;
     if(!form.name){
       return false;
     }
   var data=await this._dataService.add(form,"addTVs").toPromise()
       if(data){
         alert("uspešno dodana naprava")
         this.getTVs()
       }else{
         alert("error")
       }

 }

 async addText(){
    
  var form=this.uploadTextForm.value;
  var tvid=this.itemsForm.value.tv
var data=await this._dataService.add({"text":JSON.stringify(form),"id":tvid},"addText").toPromise()
    if(data){
      alert("uspešno dodano")
      this.allImageVideo(this.selectedtv)
    }
  

  

}
 
 async getTVs(){
  var data=await this._dataService.get("getTVs").toPromise()
  this.tvs=data
  console.log(this.tvs)
 }

  clearFile() {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
   setTimeout(()=>{    //<<<---    using ()=> syntax
     this.uspeh=false;
 }, 2000);
    
  }
  edit(id){
    
      this.show=id;
   
      
    
  }
 izbranitv(event){
   console.log( this.itemsForm.value.tv)
   this.selectedtv=this.itemsForm.value.tv
   this.allImageVideo(this.selectedtv);
  }
}
