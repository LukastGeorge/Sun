/**
 * Fetch API utility for GDU TechStore
 * LÝ THUYẾT BÁO CÁO: File này sử dụng kiến trúc ES6 Module (dùng từ khóa export) 
 * để tái sử dụng mã (Code Reusability). Tách riêng Logic xử lý Dữ liệu (Data Fetching)
 * ra khỏi Logic Giao diện (UI Rendering).
 */

const API_URL = './data/db.json';

// Lấy danh sách toàn bộ sản phẩm
// LÝ THUYẾT BÁO CÁO: Hàm fetchProducts sử dụng async/await (ES8) kết hợp với Fetch API 
// để xử lý bất đồng bộ (Asynchronous Programming) thay vì dùng XMLHttpRequest cổ điển.
// CÂU HỎI BẢO VỆ: Thầy/Cô: "Tại sao chỗ này lại dùng từ khóa 'async' và 'await'?"
// DẠ TRẢ LỜI: "Dạ vì thao tác lấy dữ liệu (fetch) phải đi qua mạng, tốn thời gian. Dùng await giúp Javascript 'tạm dừng' chờ tải xong Data rồi mới chạy code tiếp theo bên dưới, tránh hiện tượng lỗi Uncaught Promise vì chưa có dữ liệu mà đã đòi render."
export const fetchProducts = async () => {
    try { // LÝ THUYẾT: Sử dụng khối try...catch để bẫy và xử lý lỗi mạng (Network errors)
        const response = await fetch(API_URL);

        // Kiểm tra mã HTTP Status (VD: 200 OK, 404 Not Found)
        if (!response.ok) throw new Error('Network response was not ok');

        // Phân tích cú pháp chuỗi JSON trả về thành Object Javascript
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu sản phẩm", error);
        return [];
    }
};

// Lấy 8 sản phẩm mới nhất (giả lập bằng cách lấy 8 item đầu)
// LÝ THUYẾT BÁO CÁO: Array.prototype.slice() giúp trích xuất một phần tử của mảng 
// mà không làm thay đổi mảng gốc (Immutability).
export const fetchLatestProducts = async () => {
    const products = await fetchProducts();
    return products.slice(0, 8);
};
