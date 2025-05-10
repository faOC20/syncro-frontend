import { BACK_API } from "astro:env/client"
import { successAlert } from "./sweetAlert"

export const updateInstallment = async (data: any, index:string)=>{

    const closeModal = ()=>{
        (document.getElementById(`installment-modal-${index}`) as HTMLDialogElement)?.close()
      }

    try{
        const result = await fetch(`${BACK_API}/api/installment-update`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const json = await result.json()

        if (json.status === 'success'){
            closeModal()
            await successAlert('Cuota actualizada con éxito')
            window.location.reload()
        }

        if (json.status === 'no_state_changes'){
            console.log(json.message)
            const errorSpan = document.getElementById(`installment-error-${index}`) as HTMLSpanElement
            errorSpan.innerText = json.message
        }

        if (json.status === 'unexpired_installment'){
            console.log(json.message)
            const errorSpan = document.getElementById(`installment-error-${index}`) as HTMLSpanElement
            errorSpan.innerText = json.message
        }
    }
    catch(err){
        console.log(err)
    }
}