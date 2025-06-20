import { useEffect, useState } from "react"
import { useProductsStore } from "src/stores/productsStore"

export const TotalInput = ()=>{

    const {cartProducts} = useProductsStore()
    const[total, setTotal] = useState(0)
    useEffect(()=>{
        if(cartProducts && cartProducts.length > 0){
            setTotal(cartProducts.reduce((iteration, product) => iteration + parseFloat(product.salePrice*product.quantity), 0))
        }
        else{
            setTotal(0)
        }
    },[cartProducts])

    return (
        <div>
          <label for="total" class="block text-sm font-medium  mb-1">Total ($)</label>
          <input disabled
            type="number" 
            id="total" 
            step="any"
            name="total" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-ocean-blue" 
            value={total}
            >
            
            </input>
          
        </div>
    )
}