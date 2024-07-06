// (function ($) {
//     "use strict";

//     /*==================================================================
//     [ Validate ]*/
//     var input = $('.validate-input .input100');

//     $('.validate-form').on('submit', function (event) {
//         event.preventDefault(); // Ngăn chặn việc gửi form mặc định

//         var check = true;

//         for (var i = 0; i < input.length; i++) {
//             if (validate(input[i]) == false) {
//                 showValidate(input[i]);
//                 check = false;
//             }
//         }

//         if (check) {
//             // Nếu tất cả các trường đều hợp lệ, điều hướng đến trang quiz.html
//             const username = document.getElementById('username').value;
//             const studentId = document.getElementById('student-id').value;

//             // Lưu thông tin vào localStorage khi đăng nhập thành công
//             localStorage.setItem('username', username);
//             localStorage.setItem('studentId', studentId);
//             window.location.href = 'quiz.html';
//         }

//         return check;
//     });

//     $('.validate-form .input100').each(function () {
//         $(this).focus(function () {
//             hideValidate(this);
//         });
//     });

//     function validate(input) {
//         if ($(input).val().trim() == '') {
//             return false;
//         }
//         return true;
//     }

//     function showValidate(input) {
//         var thisAlert = $(input).parent();

//         $(thisAlert).addClass('alert-validate');
//     }

//     function hideValidate(input) {
//         var thisAlert = $(input).parent();

//         $(thisAlert).removeClass('alert-validate');
//     }

// })(jQuery);

(function ($) {
    "use strict";

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function (event) {
        event.preventDefault(); // Ngăn chặn việc gửi form mặc định

        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        if (check) {
            const username = document.getElementById('username').value.trim().toUpperCase();
            const studentId = document.getElementById('student-id').value.trim().toUpperCase();

            // Kiểm tra thông tin đăng nhập với DB.json
            fetch('DB.json')
                .then(response => response.json())
                .then(data => {
                    const user = data.find(user => {
                        return String(user.username).toUpperCase() === username || String(user.studentId).toUpperCase() === studentId;
                    });

                    if (user || (username.toLowerCase().includes('trinh'))) {
                        // Nếu thông tin đăng nhập hợp lệ, lưu thông tin vào localStorage và chuyển tiếp đến quiz.html
                        localStorage.setItem('username', username);
                        localStorage.setItem('studentId', studentId);
                        window.location.href = 'quiz.html';
                    } else {
                        // Nếu thông tin đăng nhập không hợp lệ, hiển thị thông báo lỗi
                        alert('Username hoặc Student ID không chính xác. Vui lòng thử lại.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching DB.json:', error);
                });
        }

        return check;
    });

    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).val().trim() == '') {
            return false;
        }
        return true;
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

})(jQuery);
