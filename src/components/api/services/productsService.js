import http from "../http";

export const getProducts = async (category) => {
    const url = category ? `/products?category=${category}` : "/products"
    const res = await http.get(url)
    return res.data
}