import { BACK_API } from "astro:env/client"
import { successAlert } from "@lib/sweetAlert"
import Swal from 'sweetalert2'

export const newOperation = async (data: string)=>{
    
    try{

        const errorInfo = document.getElementById('error-info');
        const errorFormInfo = document.getElementById('error-form-info');

        const result = await fetch(`${BACK_API}/api/new-operation`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: data
        })
    
        
        const json = await result.json()
        console.log(json)
        
        if (json.status === 'success'){
            
            const dialog = document.getElementById('additional-info-dialog') as HTMLDialogElement;
            if (dialog && dialog.open) {
                dialog.close();
            }

            await successAlert('Operación creada correctamente')
            
            window.location.reload(); // Recargar después de guardar la info adicional
            return json.status


        }

        if (json.status === 'customer_not_found'){
            return json.status
        }

        if (json.status === 'invalid_phone'){
            
            
            errorInfo?.classList.remove('invisible');
            if (errorInfo) {
                errorInfo.textContent = json.message;
            }
        }

        if (json.status === 'repeated_phone'){
            errorInfo?.classList.remove('invisible');
            if (errorInfo) {
                errorInfo.textContent = json.message;
            }
        }

        if (json.status === 'repeated_order'){
            errorFormInfo?.classList.remove('invisible');
            if (errorFormInfo) {
                errorFormInfo.textContent = json.message;
            }
        }


        
    }
    catch(err){
        console.log('no se pudo hacer la conexion')
    }
    
   
}