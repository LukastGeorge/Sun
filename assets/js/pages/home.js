import { fetchLatestProducts } from '../api.js';
import { formatVND } from '../main.js';
import { addToCart } from '../cart.js';

let homeProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
    const productGrid = document.getElementById('product-grid');

    if (productGrid) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Đang tải sản phẩm...</p>';
    }

    homeProducts = await fetchLatestProducts();

    if (homeProducts && homeProducts.length > 0 && productGrid) {
        productGrid.innerHTML = homeProducts.map(product => `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <span class="product-badge">${product.category}</span>
                </div>
                <div class="product-info">
                    <a href="detail.html?id=${product.id}" class="product-name" title="${product.name}">${product.name}</a>
                    <p class="product-price">${formatVND(product.price)}</p>
                    <button class="btn-add-cart" data-id="${product.id}">
                        <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        `).join('');

        // Event listener Delegation cho button thêm giỏ hàng
        productGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-cart');
            if (btn) {
                const id = btn.getAttribute('data-id');
                const p = homeProducts.find(x => x.id === id);
                if (p) addToCart(p, 1);
            }
        });
    } else if (productGrid) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Không có sản phẩm nào.</p>';
    }
});
