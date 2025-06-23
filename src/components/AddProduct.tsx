
// import { selectProductsHandler } from '@lib/selectProductsHandler.ts'
import { sendNewOperation } from '@lib/sendOperation'
import { useEffect, useState } from 'react'
import { useProductsStore } from 'src/stores/productsStore'
import Dialog from '@mui/material/Dialog';
import { stockCheck } from '@lib/stockCheck';


export const AddProduct = ({products})=>{

    const {cartProducts, updateProducts} = useProductsStore()

    let allProducts:any[] = products
    const [tags, setTags] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [inputSearch, setInputSearch] = useState('')
    const [showOptions, setShowOptions] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const[selectedTag, setSelectedTag] = useState()
    const[errorMessage, setErrorMesage] = useState('')
    // const [total, setTotal] = useState(0)

    //product in cart details, inputs of the dialog thats open when we select a tag

    const[amount, setAmount] = useState(0)
    const[serial, setSerial] = useState('')
    const[price, setPrice] = useState(0)

    const inputSearchHandler = (e)=>{

        setInputSearch(e.target.value)
        filterProducts(e.target.value.trim())
    }

    const filterProducts = (search)=>{

        if (!search ){
            setShowOptions(false)
            return
        }

        const filteredProducts = allProducts.filter((product)=>(
            product.code_product.toLowerCase().startsWith(search.toLowerCase())
        ))

        setFilteredProducts(filteredProducts)

        if(filteredProducts.length == 0){
            return
        }
        setShowOptions(true)
    }

    const preparateTags = (e)=>{
        const productId = e.target.closest('li').id

        const newSelectedTag = products.filter((product)=>(product.code_product == productId))[0]

        setSelectedTag(newSelectedTag)
        setIsOpen(true)
        setShowOptions(false)
        // addTags(productId)
    }

    const addTags = async()=>{

        const data = {
            code: selectedTag.code_product,
            amount: amount
        }

        const result = await stockCheck(data)

        if(result.status == 'failed'){
            setErrorMesage(result.message)
            return
        }
        
        const productIndex = allProducts.findIndex((product)=>(product.code_product == selectedTag.code_product))

        if(productIndex != -1){
            
            const deletedProduct = allProducts.splice(productIndex,1)[0]
            deletedProduct.quantity = amount
            deletedProduct.serial = serial
            deletedProduct.salePrice = price
            setTags([...tags, deletedProduct])
            setErrorMesage("")
            setIsOpen(false)
        }


    }

    const deleteTags = (e)=>{
        const tagId = e.target.closest('div').id
        const resultingTags = tags.filter((tag)=>(tag.code_product != tagId))
        const deletedTag = tags.filter((tag)=>(tag.code_product == tagId))[0]
        
        setTags(resultingTags)
        allProducts.push(deletedTag)
        
        
    }

    useEffect(()=>{
        updateProducts(tags)
        // setTotal(tags.reduce((acumulador, tag)=>acumulador + tag.salePrice, 0))
        sendNewOperation()
    },[tags])

    return(
        <>
            <Dialog className='max-w-full' open={isOpen} onClose={()=>{
                setIsOpen(false)
                setErrorMesage('')
                }} id="product-amount">
                <form onSubmit={(e)=>{
                                e.preventDefault()
                                addTags()
                            }} className='p-6 flex flex-col gap-4 w-md'>
                    <h2 className='text-xl font-medium text-theme-ocean-blue'>Detalles del producto</h2>

                    <div className='flex flex-col gap-1'>
                        {selectedTag?(
                            <>
                                <b>
                                    {selectedTag.name_product}
                                </b>

                                <span>
                                    quedan {selectedTag.amount} unidades
                                </span>

                                <span className='text-red-600'>
                                    costo: {selectedTag.cost}$
                                </span>
                            </>
                        ):('araa')}
                    </div>
                    
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="cantidad" className="text-sm font-medium">Cantidad</label>
                        <input 
                            onChange={(e)=>{setAmount(e.target.value)}}
                            required
                            type="number" 
                            id="cantidad" 
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-ocean-blue"
                            placeholder="Ingrese la cantidad"
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="price" className="text-sm font-medium">Precio de venta (por unidad)</label>
                        <input 
                            step="any"
                            required
                            onChange={(e)=>{setPrice(e.target.value)}}
                            type="number" 
                            id="price" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-ocean-blue"
                            placeholder="Ingrese el precio de venta"
                        />
                    </div>
                    
                    {/* <div className='flex flex-col gap-2'>
                        <label htmlFor="serial" className="text-sm font-medium">Número de Serie</label>
                        <input 
                            required
                            onChange={(e)=>{setSerial(e.target.value)}}
                            type="text" 
                            id="serial" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-ocean-blue"
                            placeholder="Ingrese el número de serie"
                        />
                    </div> */}

                   <span className='w-full h-5 text-red-600'>
                        {errorMessage}
                   </span>
                    
                    <div className='flex justify-end gap-3 mt-2'>
                        <button 
                            onClick={() => {
                                setIsOpen(false)
                                setErrorMesage('')
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button 
                            type='submit'
                            className="px-4 py-2 bg-theme-ocean-blue text-white rounded-md hover:bg-opacity-90"
                        >
                            Agregar
                        </button>   
                    </div>



                </form>
            </Dialog>


            <div className="mb-8 flex flex-col xl:mb-0">
                <label className="block text-sm font-medium  mb-1">Productos</label>

                <input
                    onKeyDown={(e)=>{
                        if (e.key == 'Escape'){
                            setShowOptions(false)
                        }
                    }}
                    // onBlur={()=>{
                    //     setShowOptions(false)
                    // }}
                    onFocus={(e)=>{
                        if(e.target.value != ''){
                            inputSearchHandler(e)
                        }
                        else{
                            setFilteredProducts(allProducts)
                            setShowOptions(true)
                        }
                    }} 
                    onChange={(e)=>{
                        inputSearchHandler(e)
                    }}
                    id="products-search" 
                    type="search"
                    name="products" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-ocean-blue"
                    autoComplete="off"
                />

    
                <div className="grow mt-1 relative">
                    <div id="tags" className="absolute h-6 flex max-w-full z-10 gap-3 flex-wrap overflow-auto">
                        {
                            tags.map((tag)=>(
                                <div onClick={deleteTags} key={tag.code_product} title={`${tag.name_product} (cant: ${tag.quantity})`} id={tag.code_product} className='product-tag bg-theme-light-blue px-2 max-h-6 rounded-full cursor-pointer hover:bg-red-500 transition-all'>
                                    <strong className='text-sm text-white'>
                                        {tag.code_product}
                                    </strong>
                                </div>
                            ))
                        }
                    </div>  
                    <ul id="products-list" className={` ${showOptions?('absolute flex flex-col gap-3 bg-white shadow w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-ocean-blue overflow-hidden z-20 max-h-50 overflow-y-auto'):('hidden')}`} >
                        {
                            filteredProducts?.map((product)=>(
                                <li id={`${product.code_product}`} key={product.code_product} onClick={preparateTags} className='text-gray-300 border-b-1 w-full text-start list-none cursor-pointer'>
                                    <a>
                                        <strong className='text-theme-ocean-blue'>
                                        {product.code_product}
                                    </strong>
                                    <span className='text-xs text-gray-600 block'>
                                        {product.name_product} 
                                    </span>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>

        </>
    )
}




