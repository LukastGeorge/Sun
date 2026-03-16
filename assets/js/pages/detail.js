import { fetchProducts } from '../api.js';
import { formatVND } from '../main.js';
import { addToCart as saveToCart } from '../cart.js'; // Đổi tên để tránh trùng lặp biến

document.addEventListener("DOMContentLoaded", async () => {
    // UI Elements
    const loader = document.getElementById('product-detail-loader');
    const errorMsg = document.getElementById('product-detail-error');
    const content = document.getElementById('product-detail-content');

    const els = {
        breadcrumb: document.getElementById('breadcrumb-current'),
        image: document.getElementById('detail-image'),
        category: document.getElementById('detail-category'),
        name: document.getElementById('detail-name'),
        price: document.getElementById('detail-price'),
        desc: document.getElementById('detail-desc'),
        inputQty: document.getElementById('input-quantity'),
        btnDec: document.getElementById('btn-decrease'),
        btnInc: document.getElementById('btn-increase'),
        btnAddCart: document.getElementById('btn-add-to-cart')
    };

    // LÝ THUYẾT: Đối tượng `URLSearchParams` giúp trích xuất các tham số (Parameters) trên thanh địa chỉ URL.
    // Ở đây ta gọi phương thức `.get('id')` để bóc tách mã sản phẩm người dùng đang nhấn vào.
    // CÂU HỎI BẢO VỆ: Thầy/Cô: "Làm sao trang Detail biết được em vừa ấn vào con Laptop hay con iPhone mà hiện ra cho đúng?"
    // DẠ TRẢ LỜI: "Dạ thứ nhất, ở trang chủ lúc click thẻ thẻ a href, thẻ gài sẵn ID lên URL (VD: detail.html?id=1). Trang Detail này em dùng hàm new URLSearchParams()
    // để lấy đúng con số 1 đó trên thanh địa chỉ. Sau đó em map lại với mảng dữ liệu (Array.find p.id === 1) để lôi tấm hình iPhone / Laptop của số 1 ra và nhét giao diện ạ."
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showError();
        return;
    }

    try {
        const products = await fetchProducts();

        // LÝ THUYẾT: Array.prototype.find() sẽ chạy qua từng phần tử của mảng và trả về Object sản phẩm 
        // ĐẦU TIÊN khớp với điều kiện (p.id === productId), thay vì duyệt hết mảng như filter().
        const product = products.find(p => p.id === productId);

        if (product) {
            renderProduct(product);
        } else {
            showError();
        }
    } catch (err) {
        console.error("Lỗi khi tải chi tiết:", err);
        showError();
    }

    // Hiển thị nội dung
    function renderProduct(product) {
        if (loader) loader.style.display = 'none';
        if (content) content.style.display = 'grid'; // Grid từ file css

        document.title = `${product.name} - GDU TechStore`;

        if (els.breadcrumb) els.breadcrumb.textContent = product.name;
        if (els.image) {
            els.image.src = product.image;
            els.image.alt = product.name;
        }
        if (els.category) els.category.textContent = product.category;
        if (els.name) els.name.textContent = product.name;
        if (els.price) els.price.textContent = formatVND(product.price);
        if (els.desc) els.desc.textContent = product.description;

        // Logic tăng giảm số lượng
        // LÝ THUYẾT: DOM Value extraction -> ParseInt biến chuỗi text thành số nguyên (Integer)
        // để thực hiện phép toán +, -.
        if (els.btnDec && els.btnInc && els.inputQty) {
            els.btnDec.addEventListener('click', () => {
                let current = parseInt(els.inputQty.value) || 1;
                if (current > 1) els.inputQty.value = current - 1;
            });

            els.btnInc.addEventListener('click', () => {
                let current = parseInt(els.inputQty.value) || 1;
                if (current < 10) els.inputQty.value = current + 1; // Giới hạn max 10
            });
        }

        // Add to cart localstorage
        if (els.btnAddCart) {
            els.btnAddCart.addEventListener('click', () => {
                const qty = parseInt(els.inputQty.value) || 1;
                saveToCart(product, qty);
            });
        }
    }

    function showError() {
        if (loader) loader.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'block';
        if (content) content.style.display = 'none';
    }
});
