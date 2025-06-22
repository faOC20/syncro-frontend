import { BACK_API } from "astro:env/client"
import { successAlert } from "./sweetAlert"

const productInfoDialog = document.getElementById('product-info-dialog') as HTMLDialogElement
const confirmDeleteDialog = document.getElementById('confirm-delete-dialog') as HTMLDialogElement

export const deleteProduct = async(data: string | undefined)=>{
    const result = await fetch (`${BACK_API}/api/delete-product`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    const json = await result.json()

    if (json.status == 'success'){
        productInfoDialog.close()
        confirmDeleteDialog.close()

        await successAlert(json.message)
        window.location.reload()
    }

    if(json.status == 'failed' ){
        productInfoDialog.close()
        confirmDeleteDialog.close()

        console.log(json.message)
        
    }
}