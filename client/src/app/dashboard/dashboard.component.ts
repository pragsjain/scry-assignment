import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {AppService } from '../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['date','open', 'close', 'delete'];
  ELEMENT_DATA: StockElement[];
  dataSource: MatTableDataSource<StockElement>
  isDashBoardView=true;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  page=1;
  countStock;
  numberOfStockPerPage=30;
  lastPage;
  socket;

  constructor(private appService: AppService, private router: Router,private toastr: ToastrService){
    
  }
  ngOnInit() {
      //socket connection
      this.setupSocketConnection({data:'user logged in ,socket established!'});
      this.socket = io(environment.SOCKET_ENDPOINT);
      this.getAllStocks()
  }

    
  setupSocketConnection(data) {
    //console.log(this.socket);
    //console.log(data);
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.on('notification', ()=>{
      this.getAllStocks();
    })         
  }

  getAllStocks(){
    this.appService.getAllStocks(this.page,this.numberOfStockPerPage).subscribe( (res) =>{
      //console.log(res);
      if(!res.error && res.data){
      var StocksArray:any=[];
      this.countStock=res.data.count
      this.lastPage=Math.ceil(res.data.count/this.numberOfStockPerPage);
      res.data.stockList.forEach(element => {
        var obj={};
        obj['id']=element.id
        obj['date']=element.date;
        obj['low']=element.low;
        obj['open']=element.open;
        obj['close']=element.close;
        obj['high']=element.high;
        StocksArray.push(obj);
      });
      this.ELEMENT_DATA =StocksArray;
    }
    else{
      this.countStock=0
     // this.toastr.error(res.message)
      this.ELEMENT_DATA =[];
    }
    this.dataSource= new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    },(error)=>{
      console.log('error',error);
      this.ELEMENT_DATA =[];
      this.dataSource= new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  create(){
    this.router.navigate(['/stockDescription','']);
  }

  edit(id){
    console.log(id);
    this.router.navigate(['/stockDescription',id]);
  }

  delete(id){
    console.log('delete',id);
    this.appService.deleteStock(id).subscribe( (res) =>{
      console.log(res);
      this.getAllStocks()
    })
  }
  goToSearch(){
    this.router.navigate(['/search']);
  }
  goToDashboard(){
    this.router.navigate(['/dashboard']);
  }  
}



export interface StockElement {
  id: string
  status: string;
  title: string;
  reporter: string;
  date: Date;
}
