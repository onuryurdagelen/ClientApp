import { Injectable } from '@angular/core';
import  Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  simpleAlert(){  
    Swal.fire('Hello Angular');  
  }  
    
  alertWithSuccess(){  
    Swal.fire('Thank you...', 'You submitted succesfully!', 'success')  
  }  
  erroalert()  
  {  
    Swal.fire({  
      icon: 'error',  
      title: 'Oops...',  
      text: 'Something went wrong!',  
      footer: '<a href>Why do I have this issue?</a>'  
    })  
  }  
  topend()  
  {  
    Swal.fire({  
      position: 'top-end',  
      icon: 'success',  
      title: 'Your work has been saved',  
      showConfirmButton: false,  
      timer: 1500  
    })  
  }  
  confirmBox(
    confirmParams?:ConfirmBox,
    deleteParams?:InfoBox,
    cancelParams?:InfoBox
    ):any{  
      let result = this.bindConfirmAlert(confirmParams)
      if(result){
        result.then((result) => {  
          if (result.value && deleteParams) {  
            Swal.fire(  
              deleteParams?.title,  
              deleteParams?.html,  
              deleteParams?.icon 
            )  
          } else if (result.dismiss === Swal.DismissReason.cancel && cancelParams) {  
            Swal.fire(  
              cancelParams?.title,  
              cancelParams?.html,  
              cancelParams?.icon  
            )  
          }  
        }) 
      }


  }
  infoBox(infoParams:InfoBox){
    Swal.fire(  
      infoParams?.title,  
      infoParams?.html,  
      infoParams?.icon 
    )  
  }
  bindConfirmAlert(confirmParams?:ConfirmBox):Promise<SweetAlertResult<any> | null>
    {
      if(confirmParams != null)
      {
        return Swal.fire({  
          title: confirmParams?.title,  
          text: confirmParams?.html,  
          icon: confirmParams?.icon,  
          showCancelButton: confirmParams?.showCancelButton,  
          confirmButtonText: confirmParams?.confirmButtonText,  
          cancelButtonText: confirmParams?.cancelButtonText 
        })
      }
     return null
    }

}

interface ConfirmBox {   
  title: string,
  html:string,
  icon?:SweetAlertIcon,
  showCancelButton?:boolean,
  confirmButtonText?:string,
  cancelButtonText?:string ;
}
interface InfoBox {   
  title: string,
  html?:string,
  icon?:SweetAlertIcon
}