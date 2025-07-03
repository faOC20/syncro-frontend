import { useEffect, useState } from "react"
import { useDateStore } from "src/stores/dateStore"
import { usePaymentsStore } from "src/stores/paymentsStore"

export const PaymentsTable = ()=>{
    const {date} = useDateStore()
    const {payments, updatePayments} = usePaymentsStore()
    
    useEffect(()=>{
        const getPayments = async()=>{
            const response = await fetch('http://localhost:5000/api/get-cashout', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: 'include',
                body:JSON.stringify(date)
            })

            const json = await response.json()

            console.log(json)

            if( json.status === 'success'){
                
                updatePayments(json.data)
            }

            else{
                updatePayments(null)
            }
        }

        if(date != null){
            getPayments()
        }

    },[date])

    return (
        payments?(
            <table class="min-w-full border-collapse rounded-md">
                    <thead>
                        <tr class="bg-gray-50">
                            {
                                Object.keys(payments).map((method)=>(
                                    <th class="border border-gray-200 px-4 py-2 text-center">
                                        {method==='pago_movil'?('Pago movil (Bs)'):(method=='divisas' || method =='zelle'?(`${method}($)`):(`${method} (Bs)`))}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                Object.values(payments).map((method)=>(
                                    <td class="border border-gray-200 px-4 py-3 text-center   font-medium">
                                        {new Intl.NumberFormat('de-DE').format((method).toFixed(2))}
                                    </td>
                                ))
                            }
                        </tr>
                    </tbody>
        </table>
        ):(<div className="flex w-full h-full items-center justify-center text-theme-ocean-blue text-lg font-black">
            No se encontraron pagos
        </div>)
    )
}