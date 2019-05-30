import { Component, OnInit,ViewChild,ViewChildren } from '@angular/core';
import { ApiDataService } from '../api-data.service';
import { AuthService } from '../auth.service'
import { environment } from '../../environments/environment';
import { CarouselComponent } from 'angular-bootstrap-md';
import { ActivatedRoute,Router, ActivationEnd } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('asd') carousel: any;
  @ViewChild("video") vid:any
  @ViewChild('troll') hehe:any
  
  slike=[];
  constructor(
    private _dataService: ApiDataService,
    private auth:AuthService,
    private route: ActivatedRoute,
    private router: Router
   

   
    ) {
     
     }
      private actionUrl: string=environment.baseUrl
      
     private sub:any;
  data
  user
  interval
     apiurl
     tvid
     tvs
     myOptions
     backupdata
   
  ngOnInit() {
   this.myOptions = {
   
    };

 
   this.apiurl=this.actionUrl
 console.log(this.apiurl)
  this.interval = setInterval(() => {
    if(this.data.length=="0"){
      this.data=new Array()
this.userData()

    }


 
 
}, 10000);

 
if(this.route.params){
  this.sub = this.route.params.subscribe(params => {
    if(params['id']){
       this.tvid = params['id'];
    }else{
      this.tvid="all"
    }
   
})
}
 this.userData()  
this.getTv()
 
  }

  async getTv() {
    var data = await this._dataService.get("getTVs").toPromise()
    this.tvs = data
   
 }
 getGraph(graph){
   
 }

 

  async userData() {
    function compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const genreA = a.ord;
      const genreB = b.ord;
    
      let comparison = 0;
      if (genreA > genreB) {
        comparison = 1;
      } else if (genreA < genreB) {
        comparison = -1;
      }
      return comparison;
    }
    try{
      this.data =await this._dataService.get("data",{ 
        params: {
          id:this.tvid
        } }).toPromise()
       console.log(this.data)
    
      
      this.data.sort(compare);
   
      console.log(this.data)
      this.backupdata=this.data
    }catch(err){
this.data=this.backupdata
console.log(err)
    }
    
  }
 
  logout(){
    this.auth.logout();
  }
  play(){ 
 this.carousel.interval=0
 
  }
  
  
  end(video){ 

    video.currentTime = 0;
    this.carousel.nextSlide()

    video.pause()
  
     }
     c=0
     change(item){
       
      this.c++
if(this.c>(this.data.length*5)-1){
  this.data=new Array
this.userData()
this.c=0
}
   
     
      if(this.data.length>0 && item.activeSlide!=undefined){
         
      //console.log(item.activeSlide)
      //if( item.slides[item.activeSlide].el.nativeElement.children[0].className.includes("video")){
        if(this.data[item.activeSlide].type=="video"){
         
         this.carousel.interval=0
        let elem = <HTMLVideoElement> document.getElementById(item.activeSlide)
        elem.play()
       
        
      }else{
        
       
       
           this.carousel.interval=this.data[item.activeSlide].dur
        
       
       
      }
    }else{
     item.activeSlide=0
    }
  
     }

}
