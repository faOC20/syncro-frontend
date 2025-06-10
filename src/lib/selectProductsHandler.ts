
export const selectProductsHandler = (store: any)=>{
    const {updateProducts} = store
interface product{
    amount: number,
    change_date: any,
    code_product: string,
    guarantee: number,
    name_category: string,
    name_color: string,
    name_product: string,
    name_warehouse:string,
}

const allProducts:product[] = JSON.parse(document.getElementById('products')?.getAttribute('data-products') || '[]')
const productsList = document.getElementById('products-list') as HTMLDivElement
const tagsContainer = document.getElementById('tags') as HTMLDivElement
const productsSearch = document.getElementById('products-search') as HTMLInputElement


let tags:any[] = []

const filterProducts = (search: string)=>{

    if(!search){
        productsList.classList.add('hidden')
        return
    }
    
    const filteredProducts = allProducts.filter((product: product)=>
        product.code_product?.toLowerCase().startsWith(search.toLowerCase())
    )
    
    if(filteredProducts.length == 0){
        productsList.classList.add('hidden')
        return
    }

    showProducts(filteredProducts)
}

const showProducts = (filteredProducts: product[])=>{

    productsList.innerHTML = ''
    filteredProducts.slice(0,5).forEach(product => {
        const productOption = document.createElement('li')
        productOption.className = 'text-gray-300 border-b-1 w-full text-start list-none cursor-pointer'
        productOption.innerHTML = `
            
            <a>
                <strong class='text-theme-ocean-blue'>
                ${product.code_product}
            </strong>
            <span class='text-xs text-gray-600 block'>
                ${product.name_product} 
            </span>
            </a>
           
        `
        
        productOption.addEventListener('click', (e)=>{
            productsSearch.value = ''
            const index = allProducts.findIndex(e => e.code_product === product.code_product);
            let productTag = {}
            if (index !== -1) {
                productTag = allProducts.splice(index, 1); 
            }

            tags.push(productTag[0])

            refreshTags()


            
        })

        productsList.appendChild(productOption)
    });

    productsList.classList.remove('hidden')
    
    
}

const refreshTags = ()=>{
    tagsContainer.innerHTML = ''
    tags.forEach(tag=>{
                
        const productTag = document.createElement('div')
        productTag.id = `${tag.code_product}`
        productTag.className = 'product-tag bg-theme-light-blue px-2 max-h-6 rounded-full cursor-pointer hover:bg-red-500 transition-all'
        productTag.title = `${tag.name_product}`
        productTag.innerHTML = `
            <strong class='text-sm text-white'>
                ${tag.code_product}
            </strong>
        `
        tagsContainer.appendChild(productTag)
        
        

        
        
    })
    updateProducts(tags)
}


productsSearch.addEventListener('input', (e)=>{
    filterProducts(e.target.value.trim())
    
})

document.addEventListener('click', (e)=>{
    if (e.target != productsSearch){
        
        productsList.classList.add('hidden')
    }
})

productsSearch.addEventListener('focus', (e)=>{
    if (productsSearch.value.trim()){
        filterProducts(productsSearch.value.trim())
    }
})



//eliminar tags

const manejadorClick = (e) => {
    const target = e.target.closest("div");
    const indexProduct = tags.findIndex(t => t.code_product === target.id)
    const deletedTag = tags.splice(indexProduct, 1)
    allProducts.push(deletedTag[0])
    refreshTags()
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
            
            const productTags = document.querySelectorAll('.product-tag')
           
            productTags.forEach((tag)=>{
                
                tag.addEventListener("click", manejadorClick);
            })
        }
    });
});


const config = { childList: true };


observer.observe(tagsContainer, config);


}