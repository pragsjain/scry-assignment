import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AppService } from '../app.service';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-stock-desc',
  templateUrl: './stock-desc.component.html',
  styleUrls: ['./stock-desc.component.css']
})
export class StockDescComponent implements OnInit {

  id='';
  stock;
  createForm: FormGroup;
  editorStyle={height:'150px',background: '#fff'}
  date=new Date();
  isForm=true;
  noStockDetail;
  reporterFullName='';
  fieldsChanged=[];
  socket;

 // @ViewChild('scrollMe', { read: ElementRef }) 
  scrollMe: ElementRef;
  scrolltop:number = null

  constructor(private appService: AppService, private fb: FormBuilder, private router:Router,
    private route:ActivatedRoute,private toastr: ToastrService) { 
   this.resetForm()
  }
  
    ngOnInit(): void {
      this.socket = io(environment.SOCKET_ENDPOINT);
      this.route.params.subscribe(params =>{
        //console.log('params.id->',params.id);
        if(params.id!==''){
          this.id=params.id;
          this.isForm=false;
          //get stock by id
          this.appService.getStockById(this.id).subscribe( (res) =>{
            //console.log('res',res);
            if(!res.error){
            this.setFormValue(res.data);
            }
            else{
             this.toastr.error(res.message)
            }
          },(error)=>{
            console.log('error',error);
          })
        }
      })
  
  }

  resetForm(){
    this.appService.fullName.subscribe(val=>
      this.reporterFullName= val );
    this.createForm = this.fb.group({
     id:[''],
     open:['',Validators.required],
     close:[''],
     low:[''],
     high:[''],
     date:[''],
    })
   
   }

   //set form according to response if stock id is not null
   setFormValue(res){
    this.stock=res;
    //console.log('this.filesArray->',this.filesArray);
      this.createForm.get('open').setValue(this.stock.open);
      this.createForm.get('close').setValue(this.stock.close);
      this.createForm.get('high').setValue(this.stock.high);
      this.createForm.get('low').setValue(this.stock.low);
      if(this.id==''){
        this.createForm.get('date').setValue(new Date());
      }else{
        this.createForm.get('date').setValue(this.stock.date);
      }
   }

   createFormData(){
    //console.log('saved form value->',this.createForm.value)
     let stock=this.createForm.value;
     var formData = {};
      if(this.id)
      formData['id']=this.id
      formData['open']=stock.open
      formData['close']=stock.close
      formData['high']=stock.high
      formData['low']=stock.low
      formData['date']=stock.date
      return formData;
   }

  saveClicked(){
    this.isForm=false;
    let formData = this.createFormData();
    if(this.id==''){
      this.appService.createStock(formData).subscribe((res)=>{
        if(!res.error){
        this.callSocket();
        this.router.navigate(['/dashboard']);
        }else{
          this.toastr.error('Stock not Created. Try Again !')
        }
      })
    }else{
      this.editStock(formData);
    }
  }

  callSocket(){
        this.socket.emit('sendnotification');
  }

  editStock(formData){
    //console.log(formData);
    this.appService.editStock(formData).subscribe((res)=>{
      //console.log(res);
      this.stock=res.data;
    })
  }

}
