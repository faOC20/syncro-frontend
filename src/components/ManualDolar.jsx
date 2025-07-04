import { useProductsStore } from "src/stores/productsStore"

const sendNewDolar = async (dolarRate)=>{
    const response = await fetch(`http://localhost:5000/api/set-manual-dolar`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(dolarRate)
    })

}

export const ManualDolar = ()=>{
    const {updateDolar} = useProductsStore()
    return(
        <button className="px-3 py-2 scheme-dark text-theme-light-gray bg-theme-black rounded-lg shadow-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 ease-in-out hover:bg-blue-700 cursor-pointer font-medium text-sm">
            Cambiar dolar
        </button>
    )
}