import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Product } from '../app/models/product.model';
import { Observable }   from 'rxjs/Observable';

@Injectable()
export class GetDataService {

	constructor(private http: HttpClient) { }

	dataUrl = 'http://usweb.dotomi.com/resources/swfs/cookies.json';
	defaultData = this.http.get(this.dataUrl);

	defaultProducts = new BehaviorSubject<any>(this.defaultData);
	products = this.defaultProducts.asObservable();

	getData(): Observable<Product[]> {
		console.log(this.products);
		let test = this.defaultProducts.getValue();
		console.log(test);
		return this.http.get<Product[]>(this.dataUrl);
	}

	addProduct(product) {
		let currentProducts = [];
		currentProducts = this.defaultProducts.getValue();
		let updatedProducts = currentProducts.concat(product);
		this.defaultProducts.next(updatedProducts);
	}

}