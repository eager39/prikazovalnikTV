import { Component, OnInit,ViewChild,ViewChildren } from '@angular/core';
import { ApiDataService } from '../api-data.service';
import { AuthService } from '../auth.service'
import { environment } from '../../environments/environment';
import { CarouselComponent } from 'angular-bootstrap-md';

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
   

   
    ) {
     
     }
      private actionUrl: string=environment.baseUrl
    
  data;
  user;
  interval;
     apiurl;
  ngOnInit() {
   this.apiurl=this.actionUrl
  this.userData()  
  this.interval = setInterval(() => {
    this.data=new Array();
  this.userData()
}, 900000);
 
 
 //this.user=this.auth.currentUserValue;

  }
  ngAfterViewInit(){
   // if( this.carousel.slides[this.carousel.activeSlide].el.nativeElement.children[0].className.includes("video")){
        
   //   let elem = <HTMLVideoElement> document.getElementById(this.carousel.activeSlide)
   //   elem.play()
  //  }
  //console.log(this.carousel.el.nativeElement.children[0].className)

  }

  async userData() {
    this.data =await this._dataService.get("data").toPromise()
   
    function compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const genreA = a.red;
      const genreB = b.red;
    
      let comparison = 0;
      if (genreA > genreB) {
        comparison = 1;
      } else if (genreA < genreB) {
        comparison = -1;
      }
      return comparison;
    }
    
    this.data.sort(compare);
    console.log(this.data)
    
  }
 
  logout(){
    this.auth.logout();
  }
  play(){ 
 this.carousel.interval=0
 
  }
  end(name){ 
    this.carousel.interval=1000
    name.load()
    this.carousel.nextSlide()
    name.pause()
  
     }
     change(item){
      //console.log(item.activeSlide)
      if( item.slides[item.activeSlide].el.nativeElement.children[0].className.includes("video")){
         this.carousel.interval=0
        let elem = <HTMLVideoElement> document.getElementById(item.activeSlide)
        elem.play()
       
        
      }else{
        this.carousel.interval=1000
      }
     }

}
