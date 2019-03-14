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
  data;
  user;
  interval;
     apiurl;
     tvid;
  ngOnInit() {
   this.apiurl=this.actionUrl
  
  this.interval = setInterval(() => {
    this.data=new Array();
  this.userData()
}, 900000);
 
if(this.route.params){
  this.sub = this.route.params.subscribe(params => {
    this.tvid = params['id'];
})
}else{
  this.tvid=1
}
 this.userData()  
 //this.user=this.auth.currentUserValue;
console.log(this.tvid)
 
  }
  ngAfterViewInit(){
   // if( this.carousel.slides[this.carousel.activeSlide].el.nativeElement.children[0].className.includes("video")){
        
   //   let elem = <HTMLVideoElement> document.getElementById(this.carousel.activeSlide)
   //   elem.play()
  //  }
  //console.log(this.carousel.el.nativeElement.children[0].className)

  }

  async userData() {
    this.data =await this._dataService.get("data",{ 
      params: {
        id:this.tvid
      } }).toPromise()
     
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
    
    this.data.sort(compare);
 
    
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
     change(item){
      //console.log(item.activeSlide)
      if( item.slides[item.activeSlide].el.nativeElement.children[0].className.includes("video")){
         this.carousel.interval=0
        let elem = <HTMLVideoElement> document.getElementById(item.activeSlide)
        elem.play()
       
        
      }else{
      
        this.carousel.interval=this.data[item.activeSlide].dur
       
      }
     }

}
