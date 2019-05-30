import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component'
import { AuthGuard } from './auth.guard';
import { UploadfilesComponent} from './uploadfiles/uploadfiles.component'
import { DisplayallComponent } from './displayall/displayall.component';


const routes: Routes = [
  {
    path:"home",
    component:HomeComponent,
  },
  {
    path:"home/:id",
    component:HomeComponent,
  },

 
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"dodaj",
    component:UploadfilesComponent,
    canActivate: [AuthGuard]
   
    
  }, 
  {
    path:"alltv",
    component:DisplayallComponent,
   
    
  },
  {
    path:"",
    component:DisplayallComponent
  },
  {
    path:"**",
    component:DisplayallComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
