/**
 * Giỏ hàng - Quản lý LocalStorage và cập nhật Badge toàn cục
 */

const CART_KEY = 'gdu_techstore_cart';

// Lấy giỏ hàng từ Local Storage
// LÝ THUYẾT BÁO CÁO: Hàm getCart() sử dụng Window.localStorage để lưu trữ dữ liệu State cục bộ 
// trên trình duyệt người dùng. Dữ liệu trong LocalStorage luôn là chuỗi (String), do đó 
// cần dùng JSON.parse() để biến đổi ngược lại thành Object/Mảng Javascript.
// CÂU HỎI BẢO VỆ: Thầy/Cô: "Tại sao em phải lưu giỏ hàng bằng localStorage mà không dùng hàm biến Let/Const thông thường?"
// DẠ TRẢ LỜI: "Dạ vì biến thông thường sẽ bị xóa trắng khi người dùng Load lại trang (F5) hoặc chuyển từ trang Chủ sang trang Cửa hàng.
//  LocalStorage giúp dữ liệu nằm vĩnh viễn trên trỉnh duyệt HTML5 Web Storage cho đến khi họ tự tay xóa."
export const getCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

// Lưu giỏ hàng
// LÝ THUYẾT BÁO CÁO: Trước khi SetItem, mảng (Array) cần phải được tự động tuần tự hóa (Serialization)
// thông qua JSON.stringify() để chuyển thành chuỗi String hợp lệ.
export const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
};

// Thêm sản phẩm vào giỏ
export const addToCart = (product, quantity = 1) => {
    const cart = getCart();
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart(cart);
    alert(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`);
};

// Xóa sản phẩm khỏi giỏ
// LÝ THUYẾT BÁO CÁO: Sử dụng Array.prototype.filter() - một tính năng của ES6 
// giúp lọc bỏ đi các item có id trùng với id cần xóa và trả về một mảng mới sạch sẽ (Pure function).
export const removeFromCart = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    return cart; // trả về giỏ mới để render lại
};

// Thay đổi số lượng
export const updateQuantity = (productId, newQuantity) => {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item && newQuantity > 0) {
        item.quantity = newQuantity;
        saveCart(cart);
    }
    return cart; // trả về giỏ mới để render lại
};

// Tính tổng số lượng hiển thị lên Icon Header
export const updateCartBadge = () => {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const badgeEle = document.querySelector('.cart-count');
    if (badgeEle) {
        badgeEle.textContent = totalItems;
        // Thêm animation nho nhỏ khi cập nhật
        badgeEle.style.transform = 'scale(1.5)';
        setTimeout(() => {
            badgeEle.style.transform = 'scale(1)';
        }, 300);
    }
};

// DOM Content Loaded: Tự khởi tạo số lượng trên icon giỏ hàng ở bất kỳ trang nào gắn cart.js
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
});
