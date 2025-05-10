import { updateInstallment } from "@lib/updateInstallment"
import { useEffect, useState } from "react"

export const InstallmentModal = ({installment, index, orderNumber, installmentType})=>{

    const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedStatus, setSelectedStatus] = useState(installment.id_state)

    const installmentUpdate =async (e)=>{
      e.preventDefault()
      const data = {
          state: selectedStatus,
          paid_date: paidDate,
          order_number: orderNumber,
          installment_type: installmentType
      }
      await updateInstallment(data, index)
    }
  return (
    <dialog id={`installment-modal-${index}`} className="rounded-xl p-6 max-w-md bg-white shadow-xl w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
    <form onSubmit={(e)=>{installmentUpdate(e)}} method="dialog" className="space-y-4" id={`installment-form-${index}`}>
      <h3 className="text-xl font-semibold">Editar Cuota</h3>
      <span id={`installment-error-${index}`} className="block h-2 w-full text-sm text-red-500">
        
      </span>
      <div>
        <label className="block text-sm font-medium mb-1">Fecha de vencimiento</label>
        <strong>
          {installment.date_to_pay}
        </strong>
      </div>
  
      <div>
        <label className="block text-sm font-medium mb-1">Monto ($)</label>
        <strong>
            {installment.installment_amount}
        </strong> 
      </div>
  
      <div>
        <label className="block text-sm font-medium mb-1">Estado</label>
        <select 
          required
          id={`installment-select-${index}`} 
          className="w-full px-4 py-2 border rounded-lg" 
          data-index={index}
          onChange={(e) => setSelectedStatus(e.target.value)}
          defaultValue={installment.id_state}
        >
          <option value={1}>Pendiente</option>
          <option value={4}>Pagado</option>
          <option value={2}>No pagado</option>
          <option value={3}>Error bancario</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Dia de actualización de estado</label>
        <input
        onChange={(e)=>{
          setPaidDate(e.target.value)
        }}
          required
          type="date"
          className="w-full px-4 py-2 border rounded-lg"
          id={`installment-date-${index}`}
          // max={new Date().toISOString().split('T')[0] || ''}
          value={paidDate}
        />
      </div>
  
      <div className="flex justify-end gap-3 pt-4">
        <button 
          type="button"
          onClick={()=>{
            document.getElementById(`installment-error-${index}`).innerText = ''
            document.getElementById(`installment-modal-${index}`)?.close()
          }}
          className="px-4 py-2 border rounded-lg"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Guardar
        </button>
      </div>
    </form>
</dialog>

  )
}


{/* <script is:inline define:vars={{ index, orderNumber, installmentType }}>

const installmentUpdate =async ()=>{
    const form = document.getElementById(`installment-form-${index}`);
    const select = form?.querySelector(`#installment-select-${index}`);
    
    if (form && select) {
      form.addEventListener('submit', async(e) => {
        e.preventDefault();
        const data = new Object(
          {
            state: select.value,
            paid_date: form.querySelector(`#installment-date-${index}`).value
          }
        )
        console.log(installmentType)
        const response = await updateInstallment(data)
        console

        
      });
    }
 }

 installmentUpdate()
  
</script> */}
