/**
 * Utilities & Common Logic cho GDU TechStore
 */

// Format tiền tệ VNĐ
export const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Toggle Mobile Menu
// LÝ THUYẾT BÁO CÁO: Sự kiện DOMContentLoaded 
// Đảm bảo toàn bộ thẻ HTML đã được trình duyệt tải (parse) xong rải rác trên cây DOM 
// trước khi Javascript chạy lệnh can thiệp. Giúp tránh lỗi (Null Reference Error).
document.addEventListener("DOMContentLoaded", () => {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            // Hiển thị dạng block khi toggle (cho đơn giản, vì đây chỉ là logic cơ bản)
            if (navMenu.style.display === 'block') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'block';
                // Thêm một chút style padding trên mobile tạm thời
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.backgroundColor = 'var(--white)';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';

                const ul = navMenu.querySelector('ul');
                if (ul) {
                    ul.style.flexDirection = 'column';
                    ul.style.gap = '15px';
                }
            }
        });
    }

    // Active Navigation Link
    const navLinks = document.querySelectorAll('.nav-menu ul li a');

    // LÝ THUYẾT BÁO CÁO: Sử dụng đối tượng BOM (Browser Object Model) `window.location.pathname`
    // để trích xuất URL nhằm so khớp với đường link Menu. Tự động thêm class `.active` tạo UX tốt.
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

});
