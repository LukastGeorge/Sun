import { getCart, updateQuantity, removeFromCart, updateCartBadge } from '../cart.js';
import { formatVND } from '../main.js';

document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById('cart-container');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const cartItemsList = document.getElementById('cart-items-list');

    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');

    let currentCart = getCart();

    // 1. Render giỏ hàng
    function renderCartItems() {
        if (currentCart.length === 0) {
            cartContainer.style.display = 'none';
            emptyCartMsg.style.display = 'block';
            return;
        }

        cartContainer.style.display = 'grid'; // .cart-layout grid
        emptyCartMsg.style.display = 'none';

        // LÝ THUYẾT: Sử dụng Array.prototype.map() để lặp qua mảng đối tượng (Objects) giỏ hàng
        // và trả về một mảng mới chứa các chuỗi HTML tĩnh (Template Literals). 
        // Sau đó dùng .join('') để gộp tất cả chuỗi lại thành 1 đoạn HTML hoàn chỉnh nạp vào DOM.
        cartItemsList.innerHTML = currentCart.map(item => `
            <div class="cart-item-row" data-id="${item.id}">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <a href="detail.html?id=${item.id}" class="cart-item-name">${item.name}</a>
                </div>
                
                <div class="col-price">${formatVND(item.price)}</div>
                
                <div class="col-qty">
                    <div class="qty-control">
                        <button class="btn-qty-dec">-</button>
                        <input type="number" class="input-qty" value="${item.quantity}" min="1" max="10" readonly>
                        <button class="btn-qty-inc">+</button>
                    </div>
                </div>
                
                <div class="col-total">${formatVND(item.price * item.quantity)}</div>
                
                <div class="col-action">
                    <button class="btn-remove" title="Xóa khỏi giỏ hàng"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
        `).join('');

        updateSummary();
    }

    // 2. Cập nhật tổng tiền
    function updateSummary() {
        // LÝ THUYẾT: Phương thức Array.prototype.reduce() dùng để tính tổng dồn.
        // `acc` là biến tích lũy (accumulator) giữ giá trị dồn qua mỗi vòng lặp.
        // `0` ở cuối là giá trị khởi tạo ban đầu cho biến `acc`.
        const total = currentCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        summarySubtotal.textContent = formatVND(total);
        summaryTotal.textContent = formatVND(total); // Giả sử freeship
    }

    // 3. Event Delegation cho toàn bộ List giỏ hàng
    if (cartItemsList) {
        cartItemsList.addEventListener('click', (e) => {
            const row = e.target.closest('.cart-item-row');
            if (!row) return;

            const id = row.getAttribute('data-id');
            const itemObj = currentCart.find(i => i.id === id);
            if (!itemObj) return;

            // Xóa sản phẩm
            if (e.target.closest('.btn-remove')) {
                if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                    currentCart = removeFromCart(id);
                    renderCartItems();
                }
                return;
            }

            // Tăng số lượng
            if (e.target.closest('.btn-qty-inc')) {
                let newQty = itemObj.quantity + 1;
                if (newQty <= 10) {
                    currentCart = updateQuantity(id, newQty);
                    renderCartItems();
                }
                return;
            }

            // Giảm số lượng
            if (e.target.closest('.btn-qty-dec')) {
                let newQty = itemObj.quantity - 1;
                if (newQty > 0) {
                    currentCart = updateQuantity(id, newQty);
                    renderCartItems();
                }
                return;
            }
        });
    }

    // Nút thanh toán mock
    const btnCheckout = document.querySelector('.btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            alert('Chức năng Thanh toán đang phát triển!');
        });
    }

    // Khởi tạo lần đầu
    renderCartItems();
});
