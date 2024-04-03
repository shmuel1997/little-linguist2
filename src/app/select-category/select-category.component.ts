import { Component } from '@angular/core';
import { Category } from '../../shared/model/category';
import { CategoriesService } from '../services/categories.service';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Route, Router, RouterModule } from '@angular/router';
import { SelectGameComponent } from '../select-game/select-game.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-select-category',
  standalone: true,
  imports: [MatCardModule,NgForOf,MatButtonModule,RouterModule,MatIconModule,NgIf],
  templateUrl: './select-category.component.html',
  styleUrl: './select-category.component.css'
})



export class SelectCategoryComponent {
  categories:Category[]=[];




constructor(private categoriesService:CategoriesService, private dialogService:MatDialog, private routerService:Router) {
  
}


openSelectGame(category:Category){
  let dialogRef = this.dialogService.open(SelectGameComponent,{data: category.id});



}
ngOnInit(){
  this.categories=this.categoriesService.list();
}

getInfoDate(category:Category){
  return (new Date().getDate()-new Date(category.lastUpdateDate).getDate()<8)
}
}


