import { BACK_API } from "astro:env/client"
import { failedAlert, successAlert } from "@lib/sweetAlert"

const errorFormInfo = document.getElementById('error-form-info');
const confirmDialog = document.getElementById('check-info') as HTMLDialogElement

export const newOperation = async (data)=>{

    console.log('hola')
    try{


        const result = await fetch(`http://localhost:5000/api/new-operation`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data),
            credentials: "include"
        })
    
        
        const json = await result.json()
        console.log(json)
        
        if (json.status === 'success'){

            if(confirmDialog && confirmDialog.open) {
                confirmDialog.close()
            }

            await successAlert('Operación creada correctamente')
            
            window.location.reload(); // Recargar después de guardar la info adicional
            return json.status


        }

        if (json.status === 'customer_not_found'){
            return json.status
        }

        if (json.status === 'repeated_order'){
            errorFormInfo.innerHTML = json.message
        }

        if (json.status === 'failed'){
            if(confirmDialog && confirmDialog.open) {
                confirmDialog.close()
            }

            await failedAlert(json.message)
            window.location.reload()
        }


        
    }
    catch(err){
        console.log('no se pudo hacer la conexion')
    }
    
   
}