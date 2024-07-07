(function ($) {
    "use strict";

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function (event) {
        event.preventDefault(); 

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

            fetch('DB.json')
                .then(response => response.json())
                .then(data => {
                    const user = data.find(user => {
                        return String(user.username).toUpperCase() === username || String(user.studentId).toUpperCase() === studentId;
                    });

                    if (user || (username.toLowerCase().includes('trinh'))) {
                        localStorage.setItem('username', username);
                        localStorage.setItem('studentId', studentId);
                        window.location.href = 'quiz.html';
                    } else {
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
