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
    const header = document.querySelector('.header'); // Lấy thẻ cha Header

    if (mobileToggle && header) {
        // CÂU HỎI BẢO VỆ: Thầy/Cô: "Làm sao cái Menu trên Điện thoại tự ẩn tự hiện được khi bấm nút 3 gạch?"
        // DẠ TRẢ LỜI: "Dạ em bắt sự kiện Click vào Icon 3 gạch (Hamburger). Mỗi lần Click, JS sẽ bật/tắt class '.mobile-active' vào thẻ Header lớn nhất bằng thuộc tính classList.toggle(). Từ đó CSS Mobile bên layout.css sẽ hiểu là cần hiển thị thả danh sách Menu xuống."
        mobileToggle.addEventListener('click', () => {
            header.classList.toggle('mobile-active');
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
