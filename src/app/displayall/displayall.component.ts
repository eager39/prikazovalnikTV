import { Component, OnInit } from '@angular/core';
import { ApiDataService } from '../api-data.service';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-displayall',
  templateUrl: './displayall.component.html',
  styleUrls: ['./displayall.component.scss']
})
export class DisplayallComponent implements OnInit {

  constructor(
    private _dataService: ApiDataService,
  
  ) { }
  data
apiurl=environment.angularUrl
  ngOnInit() {
    this.getNumOfDisplays()
  }
  async  getNumOfDisplays(){
  this.data= await this._dataService.get("numOfTVs").toPromise()
  for(var i in this.data){
    this.data[i].orgid=this.data[i].id
   this.data[i].id=this.apiurl+"home/"+this.data[i].id
  }
  console.log(this.data)
  }

}
