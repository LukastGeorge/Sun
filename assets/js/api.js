

const API_URL = './data/db.json';


export const fetchProducts = async () => {
    try {
        const response = await fetch(API_URL);

       
        if (!response.ok) throw new Error('Network response was not ok');

        
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm", error);
        return [];
    }
};


export const fetchLatestProducts = async () => {
    const products = await fetchProducts();
    return products.slice(0, 8);
};
