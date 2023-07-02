import {Route, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";

const router: Route[] = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
]
@NgModule({
  imports: [
    RouterModule.forRoot(router)
  ]
})
export class AppRoutingModule { }
