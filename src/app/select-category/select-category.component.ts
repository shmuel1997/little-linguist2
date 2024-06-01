import { Component } from '@angular/core';
import { Category } from '../../shared/model/category';
import { CategoriesService } from '../services/categories.service';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { SelectGameComponent } from '../select-game/select-game.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-select-category',
  standalone: true,
  imports: [
    MatCardModule,
    NgForOf,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    NgIf,
    MatProgressSpinnerModule,
  ],
  templateUrl: './select-category.component.html',
  styleUrl: './select-category.component.css',
})
export class SelectCategoryComponent {
  categories: Category[] = [];
  isLoading = true;
  constructor(
    private categoriesService: CategoriesService,
    private dialogService: MatDialog
  ) {}

  openSelectGame(category: Category) {
    this.dialogService.open(SelectGameComponent, { data: category.id });
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {
    this.categoriesService.list().then((res) => {
      this.categories = res;
      this.isLoading = false;
    });
  }

  getInfoDate(category: Category) {
    return (
      new Date().getDate() - new Date(category.lastUpdateDate).getDate() < 8
    );
  }
}
