import { useQuery } from '@tanstack/react-query';
import { getProducts , getProductByBrand , getProductsByCategoryAndBrand , getProductsByCategoryAndBrandAndModel , getProductsById} from '../api/services/productsService';



export const useProducts = (category, page = 1) => {
  return useQuery({
    queryKey: ["products", category, page],
    queryFn: () => getProducts(category, page),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};



export const useProductsByBrand = (brand, page = 1) => {
    return useQuery({
        queryKey: ["products", "brand", brand, page], // اضافه شدن page به کلید
        queryFn: () => getProductByBrand(brand, page),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData, // برای جلوگیری از پرش صفحه هنگام لود صفحه جدید
    })
}

export const useProductsByCategoryAndBrand = (category, brand, page = 1) => {
    return useQuery({
        queryKey: ["products", "category", category, brand, page], // اضافه شدن page به کلید
        queryFn: () => getProductsByCategoryAndBrand(category, brand, page),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    })
}



export const useProductsByCategoryAndBrandAndModel = (category, brand, model, page = 1) => {
    return useQuery({
        queryKey: ["products", "category-brand-model", category, brand, model, page],
        queryFn: () => getProductsByCategoryAndBrandAndModel(category, brand, model, page),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData, // جلوگیری از پرش صفحه در زمان لود صفحه جدید
    })
}


export const useProductsById = (id) => {
    return useQuery({
        queryKey: ["products", id], // مرتب‌سازی کلید کوئری به شکل استانداردتر
        queryFn: () => getProductsById(id),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
        enabled: !!id, // تا وقتی id نیامده ریکوئست زده نشود
    })
}