import { Injectable } from '@angular/core';
import { Category } from '../../shared/model/category';
import {
  DocumentSnapshot,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { categoryConverter } from './converters/category.converter';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private firestoreService: Firestore) {}

  async list(): Promise<Category[]> {
    const collectionConnection = collection(
      this.firestoreService,
      'categories'
    ).withConverter(categoryConverter);
    const querySnapshot: QuerySnapshot<Category> = await getDocs(
      collectionConnection
    );
    const result: Category[] = [];
    querySnapshot.docs.forEach((docSnap: DocumentSnapshot<Category>) => {
      const data = docSnap.data();
      if (data) {
        result.push(data);
      }
    });
    return result;
  }

  async get(id: string): Promise<Category | undefined> {
    const categoryDocRef = doc(
      this.firestoreService,
      'categories',
      id
    ).withConverter(categoryConverter);
    return (await getDoc(categoryDocRef)).data();
  }

  async delete(id: string): Promise<void> {
    const categoryDocRef = doc(
      this.firestoreService,
      'categories',
      id
    ).withConverter(categoryConverter);
    return await deleteDoc(categoryDocRef);
  }

  async update(category: Category): Promise<void> {
    const categoryDocRef = doc(
      this.firestoreService,
      'categories',
      category.id
    ).withConverter(categoryConverter);
    return await setDoc(categoryDocRef, category);
  }

  async add(category: Category) {
    await addDoc(
      collection(this.firestoreService, 'categories').withConverter(
        categoryConverter
      ),
      category
    );
  }
}
