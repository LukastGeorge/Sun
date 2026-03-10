import { fetchProducts } from '../api.js';
import { formatVND } from '../main.js';
import { addToCart } from '../cart.js';

let allProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
    const productGrid = document.getElementById('product-grid');
    const noProductsMsg = document.getElementById('no-products-msg');
    const liveSearch = document.getElementById('live-search');
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    const priceRadios = document.querySelectorAll('input[name="price"]');
    const btnClearFilter = document.getElementById('btn-clear-filter');
    const btnGridView = document.getElementById('btn-grid-view');
    const btnListView = document.getElementById('btn-list-view');

    // Màn hình Loading
    if (productGrid) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Đang tải danh sách sản phẩm...</p>';
    }

    // 1. Fetch dữ liệu toàn bộ sản phẩm (Chờ Fetch API)
    // LÝ THUYẾT: Từ khóa `await` sẽ tạm dừng hàm tại đây cho đến khi `fetchProducts()` hoàn thành việc tải file JSON.
    allProducts = await fetchProducts();

    // Lần đầu hiển thị tất cả
    renderProducts(allProducts);

    // 2. Chức năng render
    function renderProducts(products) {
        if (!productGrid) return;

        productGrid.innerHTML = '';

        if (!products || products.length === 0) {
            productGrid.style.display = 'none';
            if (noProductsMsg) noProductsMsg.style.display = 'block';
            return;
        }

        productGrid.style.display = '';
        if (noProductsMsg) noProductsMsg.style.display = 'none';

        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <span class="product-badge">${product.category}</span>
                </div>
                <div class="product-info">
                    <a href="detail.html?id=${product.id}" class="product-name" title="${product.name}">${product.name}</a>
                    <p class="product-price">${formatVND(product.price)}</p>
                    <button class="btn-add-cart" data-id="${product.id}">
                        <i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Event listener Delegation cho button thêm giỏ hàng
    // LÝ THUYẾT: Thay vì gắn sự kiện click vào từng nút "Thêm vào giỏ" (rất nặng máy nếu có 1000 sản phẩm),
    // ta gắn duy nhất 1 sự kiện vào thẻ cha `productGrid` (Event Delegation).
    // CÂU HỎI BẢO VỆ: Thầy/Cô: "Event Delegation (Ủy quyền sự kiện) ở đây có tác dụng gì?"
    // DẠ TRẢ LỜI: "Dạ thay vì em viết 100 cái addEventListener cho 100 nút Mua Hàng, làm rác bộ nhớ trình duyệt, em chỉ gắn 1 sự kiện duy nhất vào thằng Cha (productGrid). Khi click bất kỳ đâu, sự kiện sẽ nổi bọt (Bubble up) lên Cha để xử lý. Nếu click trúng thẻ có class .btn-add-cart thì mới chạy AddToCart. Rất tối ưu hiệu năng ạ."
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-cart');
            if (btn) {
                const id = btn.getAttribute('data-id');
                const p = allProducts.find(x => x.id === id);
                if (p) addToCart(p, 1);
            }
        });
    }

    // 3. Logic Filter & Search (Hệ thống kết hợp)
    function applyFilters() {
        // LÝ THUYẾT: Toán tử Spread `[...allProducts]` tạo ra một mảng copy độc lập từ mảng gốc (Shallow Copy),
        // giúp bộ lọc thao tác thoải mái trên mảng copy mà không làm hỏng dữ liệu gốc ban đầu.
        // CÂU HỎI BẢO VỆ: Thầy/Cô: "Tại sao không xài `let filtered = allProducts` luôn mà phải dùng `[...allProducts]` dấm dớ vậy?"
        // DẠ TRẢ LỜI: "Dạ vì trong JS, Object và Mảng là Tham chiếu (Reference). Nếu gán liền như vậy, lúc em dùng hàm js filter() xóa bớt sản phẩm, mảng gốc allProducts cũng sẽ bị xóa vĩnh viễn luôn. Dùng Spread Operator [...] giúp em nhân bản ra 1 mảng mới hoàn toàn để tha hồ bộ lọc cắt xén mà không sợ mất data gốc lúc Load trang."
        let filtered = [...allProducts];

        // Tìm kiếm Text (Search)
        if (liveSearch && liveSearch.value.trim() !== '') {
            const keyword = liveSearch.value.trim().toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword));
        }

        // Lọc Danh mục (Category)
        const selectedCat = document.querySelector('input[name="category"]:checked');
        if (selectedCat && selectedCat.value !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCat.value);
        }

        // Lọc Giá (Price range)
        const selectedPrice = document.querySelector('input[name="price"]:checked');
        if (selectedPrice && selectedPrice.value !== 'all') {
            const val = selectedPrice.value;
            filtered = filtered.filter(p => {
                if (val === 'under-15') return p.price < 15000000;
                if (val === '15-25') return p.price >= 15000000 && p.price <= 25000000;
                if (val === 'over-25') return p.price > 25000000;
                return true;
            });
        }

        renderProducts(filtered);
    }

    // Gắn sự kiện Search (Real-time input)
    if (liveSearch) {
        liveSearch.addEventListener('input', applyFilters);
    }

    // Gắn sự kiện Filter thay đổi Radio
    categoryRadios.forEach(radio => radio.addEventListener('change', applyFilters));
    priceRadios.forEach(radio => radio.addEventListener('change', applyFilters));

    // Nút Clear filter
    if (btnClearFilter) {
        btnClearFilter.addEventListener('click', () => {
            if (liveSearch) liveSearch.value = '';
            document.querySelector('input[name="category"][value="all"]').checked = true;
            document.querySelector('input[name="price"][value="all"]').checked = true;
            // Gọi lại hàm filter để Reset mảng `filtered` trở về như cũ
            applyFilters();
        });
    }

    // 4. Toggle View (Grid/List)
    if (btnGridView && btnListView && productGrid) {
        btnGridView.addEventListener('click', () => {
            productGrid.classList.remove('list-view');
            btnGridView.classList.add('active');
            btnListView.classList.remove('active');
        });

        btnListView.addEventListener('click', () => {
            productGrid.classList.add('list-view');
            btnListView.classList.add('active');
            btnGridView.classList.remove('active');
        });
    }
});
