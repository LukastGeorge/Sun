document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById('contactForm');

    // Inputs
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');

    const successMsg = document.getElementById('form-success-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // LÝ THUYẾT: e.preventDefault() chặn hành vi mặc định của trình duyệt 
            // (là reload lại nguyên trang khi bấm nút Submit). Giúp ta kiểm tra lỗi 
            // bằng Javascript ở Client-side trước khi thực sự gửi đi.
            // CÂU HỎI BẢO VỆ: Thầy/Cô: "Dòng `e.preventDefault();` này xóa đi được không?"
            // DẠ TRẢ LỜI: "Dạ tuyệt đối không ạ! Đặc tính của thẻ HTML <form> là khi bấm nút Submit, trình duyệt sẽ lập tức load lại (F5) trang web để tuồn data lên Server. Lệnh này giúp 'Chặn' hành vi F5 đó lại, để JS có thời gian chạy các hàm if-else kiểm tra lỗi chép đỏ Form trước."
            e.preventDefault();

            // Xóa Msg thành công từ lần trước
            successMsg.style.display = 'none';

            let isValid = true;

            // Validate First Name (Không rỗng)
            if (firstName.value.trim() === '') {
                setError(firstName, 'Vui lòng nhập Họ của bạn.');
                isValid = false;
            } else {
                setSuccess(firstName);
            }

            // Validate Last Name
            if (lastName.value.trim() === '') {
                setError(lastName, 'Vui lòng nhập Tên của bạn.');
                isValid = false;
            } else {
                setSuccess(lastName);
            }

            // Validate Email (Định dạng Email chuẩn Regex)
            // LÝ THUYẾT: Biểu thức chính quy (Regular Expression - Regex) 
            // `^[^\s@]+@[^\s@]+\.[^\s@]+$` dùng để kiểm tra tính hợp lệ của Email.
            // Bắt buộc chuỗi phải có ký tự '@' và dấu chấm '.', không chứa khoảng trắng.
            // CÂU HỎI BẢO VỆ: Thầy/Cô: "Làm sao em biết người ta gõ tên linh tinh thay vì gõ Email?"
            // DẠ TRẢ LỜI: "Dạ em dùng kỹ thuật Regex (Biểu thức chính quy). Ký hiệu ^[^\s@]+ bắt buộc phải gõ chuỗi chữ không có dấu cách và dấu @. Kế tiếp PHẢI CÓ một dấu @, rồi đến tên miền domain, rồi PHẢI CÓ một dấu Chấm (.) và đuôi .com/.vn ạ."
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                setError(email, 'Vui lòng nhập Email.');
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                setError(email, 'Email không hợp lệ.');
                isValid = false;
            } else {
                setSuccess(email);
            }

            // Validate Phone (10 số, bắt đầu bằng 0)
            const phoneRegex = /^(0)[0-9]{9}$/;
            if (phone.value.trim() === '') {
                setError(phone, 'Vui lòng nhập Số điện thoại.');
                isValid = false;
            } else if (!phoneRegex.test(phone.value.trim())) {
                setError(phone, 'Số điện thoại phải gồm 10 chữ số khởi đầu bằng số 0.');
                isValid = false;
            } else {
                setSuccess(phone);
            }

            // Validate Message
            if (message.value.trim() === '') {
                setError(message, 'Vui lòng không để trống nội dung.');
                isValid = false;
            } else {
                setSuccess(message);
            }

            // Nếu tất cả hợp lệ -> Submit logic giả lập
            if (isValid) {
                // Ở kịch bản thật sẽ dùng fetch(API_Endpoint) POST method.
                // Ở Mock Frontend thì hiển thị thành công form và reset text
                successMsg.style.display = 'block';
                contactForm.reset();

                // LÝ THUYẾT: Hàm setTimeout() là hàm Callback chạy Asynchronous, 
                // tự động ẩn thông báo thành công đi sau 5000 mili-giây (5 giây).
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }
        });
    }

    // Helper Functions
    function setError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-msg');

        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function setSuccess(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
    }
});
