import http from "../http";

export const getProducts = async (category, page = 1) => {
    // ساخت پاردامترها به صورت پویا
    const params = { page };
    if (category) {
        params.category = category;
    }

    const res = await http.get("/products", { params });
    return res.data;
}

export const getProductByBrand = async (brand, page = 1) => {
    const url = brand ? `/products?brand=${brand}&page=${page}` : `/products?page=${page}`
    const res = await http.get(url)
    return res.data
}

export const getProductsByCategoryAndBrand = async (category, brand, page = 1) => {
    // اصلاح شرط برای اطمینان از ارسال پارامترها به همراه صفحه
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (brand) params.append("brand", brand);
    params.append("page", page);

    const res = await http.get(`/products?${params.toString()}`)
    return res.data
}



export const getProductsByCategoryAndBrandAndModel = async (category, brand, model, page = 1) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (brand) params.append("brand", brand);
    if (model) params.append("model", model);
    params.append("page", page);

    const res = await http.get(`/products?${params.toString()}`)
    return res.data
}



export const getProductsById = async (id) => {
    const url = id ? `/products?id=${id}` : "/products"
    const res = await http.get(url)
    return res.data
}