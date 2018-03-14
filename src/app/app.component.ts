import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { GetDataService } from "../services/get-data.service";
import { MatTableModule, MatTable} from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	title = 'Epsilon Test App';
	defaultData: any;
	loadingData: boolean = true;

	// Set default sorting object for sort-direction indicator
	currentSort= { 'column': null, 'ascending': false };

	// Set form group/controls for validation
	productForm: FormGroup;
	name: FormControl;
	price: FormControl;
	category: FormControl;

  constructor(private getDataService: GetDataService, public snackBar: MatSnackBar){

	// Get default data via service

		this.getDataService.getData()
		 .subscribe(data => {
		 	data.forEach((object) => {
		 		object.price = object.price.substring(1);
		 	});
			this.defaultData = data;
			this.loadingData = false;
		  },
			err => console.log(err)
		);
  }

  ngOnInit(){
  	// Build default form and validation controls
    this.createFormControls();
    this.createForm();
  }


  createFormControls() { 
  	// Require price to have 2 decimal numbers
  	let pricePattern = "^\\d+\\.\\d{2}$";

    this.name = new FormControl('', Validators.required);
    this.price = new FormControl('', [
      Validators.required,
      Validators.pattern(pricePattern)
    ]);    
    this.category = new FormControl('', Validators.required);
  }

	createForm() { 
		this.productForm = new FormGroup({
		name: this.name,
		price: this.price,
		category: this.category
		});
	}

	sort(column){
		// Check to see if the currently sorted column is the same as what is being passed, if it is
		// reverse the sorting order. If not sort the new column in ascending order
		if(this.currentSort['column'] == column) {

			if(this.currentSort['ascending']) {
				this.defaultData.sort((a,b) => a[column] > b[column] ? -1 : a[column] < b[column] ? 1 : 0);

				this.currentSort['ascending'] = false;

			} else {
					this.defaultData.sort((a,b) => a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0);
					this.currentSort['ascending'] = true;
			}

		} else {

			this.defaultData.sort((a,b) => a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0);
			this.currentSort['column'] = column;
			this.currentSort['ascending'] = true;

		}
	}

	onSubmit(productForm) {
		// On submit add a $ to the price for consistency, add the new product to the table, give feedback
		// to the user that it has been added, and then reset the form.
		let newProduct = productForm.value;
		// let currentPrice = newProduct['price'];
		// let newPrice = "$" + currentPrice;

		// newProduct['price'] = newPrice;
		this.defaultData.push(newProduct);
		productForm.reset();
		this.openSnackBar(newProduct);
	}

	openSnackBar(newProduct) {
		// Celebrate
		let message = "Success!";
		let action =  newProduct['name'] + " was added!";
		this.snackBar.open(message, action, {
			duration: 2000,
		});
	}



}
