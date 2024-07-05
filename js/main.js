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
            // Nếu tất cả các trường đều hợp lệ, điều hướng đến trang quiz.html
            const username = document.getElementById('username').value;
            const studentId = document.getElementById('student-id').value;

            // Lưu thông tin vào localStorage khi đăng nhập thành công
            localStorage.setItem('username', username);
            localStorage.setItem('studentId', studentId);
            window.location.href = 'quiz.html';
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
