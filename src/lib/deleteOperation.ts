import { BACK_API } from "astro:env/client"
import { successAlert } from "./sweetAlert";

export const deleteOperation = async (orderNumber:string)=>{
    const res = await fetch(`http://localhost:5000/api/delete-operation`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderNumber),
        credentials: 'include'
    })

    const json = await res.json()

    if (json.status === 'success') {
        const dialog = document.getElementById('delete-dialog') as HTMLDialogElement;
        dialog.close();
        await successAlert('Operación eliminada con éxito')
        window.location.href = '/'
    }
    console.log(json)
}