import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import {FormBuilder,FormGroup,Validators,FormControl} from "@angular/forms";
import {ApiDataService} from '../api-data.service';
import {AuthService} from '../auth.service'
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-uploadfiles',
  templateUrl: './uploadfiles.component.html',
  styleUrls: ['./uploadfiles.component.scss']
})
export class UploadfilesComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  uspeh;
  napaka = false;
  images;
  videos;
  show;
  items;
  selectedtv;
  tvs;
  editTv=false;
   currTVname
   currTVlocation
   tvid
   data:any
   message
   columns=[]
   multipleselect=false
   itemall
   selectedid
   selectedtext
  
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  constructor(private fb: FormBuilder, private _dataService: ApiDataService, private auth: AuthService ) {
     this.createForm();
  }
  excelForm = new FormGroup({
   name: new FormControl(''),
   graph_type:new FormControl("")
})
  imageForm = new FormGroup({
     red: new FormControl(''),
  })
  itemsForm = new FormGroup({
     ord: new FormControl(''),
     tv: new FormControl(""),
     multipleTV:new FormControl("")
  })
  tvsForm = new FormGroup({
     name: new FormControl(''),
     location: new FormControl(''),
  })
  uploadTextForm = new FormGroup({
     naslov: new FormControl(""),
     vsebina: new FormControl("")
  })

  excel(evt: any) {
   /* wire up file reader */
   const target: DataTransfer = <DataTransfer>(evt.target);
   if (target.files.length !== 1) throw new Error('Cannot use multiple files');
   const reader: FileReader = new FileReader();
   reader.onload = (e: any) => {
     /* read workbook */
     const bstr: string = e.target.result;
     const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

     /* grab first sheet */
     const wsname: string = wb.SheetNames[0];
     const ws: XLSX.WorkSheet = wb.Sheets[wsname];

     /* save data */
     this.data = (XLSX.utils.sheet_to_json(ws, {header: 1}));
     for(var i=0;i<this.data[0].length;i++){
      this.columns.push(this.data[0][i])
     }
     
     this.data.shift()
   
     
   };
   reader.readAsBinaryString(target.files[0]);
 }
 async addExcelData() {

   var tvid = this.itemsForm.value.tv
   var data = await this._dataService.add({
      "graph": JSON.stringify(this.data),
      "id": tvid,
      "name":this.excelForm.value.name,
      "graph_type":this.excelForm.value.graph_type,
      "columns":JSON.stringify(this.columns)
   }, "addGraph").toPromise()
   if (data) {
      alert("uspešno dodano")
      this.allImageVideo(this.selectedtv)
      this.getTVs()
   }else{
      this.message="Napaka"
      
   }




}
showOtherTV(item){
   if(item.id==this.multipleselect){
      this.multipleselect=false
      this.itemall=false

   }else{
      this.itemall=item
      this.multipleselect=item.display
   }

}
async addToMultipleTV(){
  
   var data = await this._dataService.add({
      "item": this.itemall,
      "id": this.itemsForm.value.multipleTV,
   }, "addToOthers").toPromise()
   if (data) {
      alert("uspešno dodano")
      this.allImageVideo(this.selectedtv)
      this.multipleselect=false
      this.itemall=false
      
      this.getTVs()

   }else{
      
      
   }
}



  createForm() {
     this.form = this.fb.group({

        avatar: null,
        display: new FormControl("")
     });
  }
  allImageVideo(tv) {
     this._dataService.get("uredi", {
        params: {
           id: tv
        }
     }).subscribe(
        data => {
          
           this.items = data
          

        }
     )
  }

editTV(tv){
   
  this.currTVname=tv.name
   this.currTVlocation=tv.location
  this.tvid=tv.id
   this.editTv=true

}
async editTVs(id){
   let result = await this._dataService.add({
      "id": id,
      "name":this.tvsForm.value.name,
      "location":this.tvsForm.value.location
   }, "editTV").toPromise()
   
   if (result) {
      this.getTVs();
      this.allImageVideo(this.selectedtv)
      alert("uspešno spremenjeno")
      this.editTv=false

   }else{
     alert("napaka pri spremembi")
   }
}

  async getTv() {
     this.tvs = await this._dataService.get("tvs").toPromise()
  }


  ngOnInit() {
     // this.allImageVideo()
     this.getTVs()
  }
  deleteImg(id, name,type,display) {

     this._dataService.add({
        "id": id,
        "name": name,
        "type":type,
        "display":display
     }, "deleteImg").subscribe(
        (val) => {


         
           this.allImageVideo(this.selectedtv)
           this.getTVs();
        },
        response => {
           console.log("POST call in error", response);
        },
        () => {
           console.log("The POST observable is now completed.");

        });


  }
  deleteVid(id, name) {
     this._dataService.add({
        "id": id,
        "name": name
     }, "deleteVid").subscribe(
        (val) => {
           this.allImageVideo(this.selectedtv);
           this.getTVs()
         
        },
        response => {
           console.log("POST call in error", response);
        },
        () => {
           console.log("The POST observable is now completed.");

        });


  }
  async deleteTV(id) {
    let result = await this._dataService.add({
      "id": id,
   }, "deleteTV").toPromise()
   
   if (result) {
      this.getTVs();
      alert("uspešno izbrisano")

   }else{
     alert("brisanje ni mogoče ker TV vsebuje slide")
   }

 }
  showhideImg(image) {
     if (image.active == 0) {
        image.active = 1;
     } else {
        image.active = 0;
     }
     this._dataService.add({
        "id": image.id,
        "active": image.active
     }, "showhideImg").subscribe(
        (val) => {
           this.allImageVideo(this.selectedtv);

        
        },
        response => {
           console.log("POST call in error", response);
        },
        () => {
           console.log("The POST observable is now completed.");

        });

  }
  showhideVid(video) {
     if (video.active == 0) {
        video.active = 1;
     } else {
        video.active = 0;
     }
     this._dataService.add({
        "id": video.id,
        "active": video.active
     }, "showhideVid").subscribe(
        (val) => {
           this.allImageVideo(this.selectedtv);

           
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
     if (event.target.files && event.target.files.length > 0) {
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
    
    if(!this.form.value.avatar){ 
      this.napaka=true;
      return false;
     
    }
     this.loading = true;
     this._dataService.add({
        "item": this.form.value.avatar,
        "tvid": this.itemsForm.value.tv
     }, "image").subscribe(
        data => {

           if (data) {
              this.uspeh = true
              this.napaka = false
              this.allImageVideo(this.selectedtv);
              this.getTVs();
           } else {
              this.napaka = true
              this.loading = false;
           }

           this.loading = false;
           this.clearFile();
        },
        error => {
           console.log(error.statusText);
           this.loading = false;
           this.napaka = true;
        });

  }
  ifactive = 0;
  async updateImgRed(id, value) {
     this.ifactive = id

     let result = await this._dataService.add({
        "id": id,
        "red": value,
        "display":this.itemsForm.value.tv
     }, "updateImgRed").toPromise()
    
     if (result) {
        this.allImageVideo(this.selectedtv);
        this.show = "";

     }

  }
  async updateItemDur(id, value, dur) {
     if (dur == 1000 && value == "-") {
        return false;
     }
     this.ifactive = id
     
     let result = await this._dataService.add({
        "id": id,
        "red": value
     }, "updateItemDur").toPromise()
    
     if (result) {
        this.allImageVideo(this.selectedtv);
        this.show = "";

     }

  }
  async addTVs() {

     var form = this.tvsForm.value;
     if (!form.name) {
        return false;
     }
     var data = await this._dataService.add(form, "addTVs").toPromise()
    
     if (data) {
        alert("uspešno dodana naprava")
        this.getTVs()
     } else {
        alert("Omejeno število zaslonov na 12!")
     }

  }

  async addText() {

     var form = this.uploadTextForm.value;
     var tvid = this.itemsForm.value.tv
     var data = await this._dataService.add({
        "text": JSON.stringify(form),
        "id": tvid
     }, "addText").toPromise()
     if (data) {
        alert("uspešno dodano")
        this.allImageVideo(this.selectedtv)
        this.getTVs()
     }




  }

  async getTVs() {
     var data = await this._dataService.get("getTVs").toPromise()
     this.tvs = data
    
  }

  clearFile() {
   this.loading=false
     this.form.get('avatar').setValue(null);
     this.fileInput.nativeElement.value = '';
     setTimeout(() => { //<<<---    using ()=> syntax
        this.uspeh = false;
     }, 2000);

  }
  edit(id) {

     this.show = id;



  }
  izbranitv() {
     
     this.selectedtv = this.itemsForm.value.tv
     this.allImageVideo(this.selectedtv);
     this.getTVs()
    this.multipleselect=false
  }
  logout(){
     
     this.auth.logout()
  }
}