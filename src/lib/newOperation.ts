import { BACK_API } from "astro:env/client"
import { successAlert } from "@lib/sweetAlert"

const errorFormInfo = document.getElementById('error-form-info');

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
            
            const confirmDialog = document.getElementById('check-info') as HTMLDialogElement

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


        
    }
    catch(err){
        console.log('no se pudo hacer la conexion')
    }
    
   
}