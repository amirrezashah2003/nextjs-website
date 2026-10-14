import http from "../http";

export const getProducts = async (category) => {
    const url = category ? `/products?category=${category}` : "/products"
    const res = await http.get(url)
    return res.data
}

export const getProductByBrand = async (brand) => {
    const url = brand ? `/products?brand=${brand}` : "/products"
    const res = await http.get(url)
    return res.data
}



export const getProductsByCategoryAndBrand = async (category , brand) => {
    const url = category && brand ? `/products?category=${category}&brand=${brand}` : "/products"
    const res = await http.get(url)
    return res.data
}


export const getProductsByCategoryAndBrandAndModel = async (category , brand , model) => {
    const url = category && brand && model ? `/products?category=${category}&brand=${brand}&model=${model}` : "/products"
    const res = await http.get(url)
    return res.data
}


export const getProductsById = async (id) => {
    const url = id ? `/products?id=${id}` : "/products"
    const res = await http.get(url)
    return res.data
}