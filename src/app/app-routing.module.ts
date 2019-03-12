import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component'
import { AuthGuard } from './auth.guard';
import { UploadfilesComponent} from './uploadfiles/uploadfiles.component'


const routes: Routes = [
  {
    path:"home",
    component:HomeComponent,
  },

  
  {
    path:"",
    component:HomeComponent
  },
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"dodaj",
    component:UploadfilesComponent,
   
    
  },{
    path:"**",
    component:HomeComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
