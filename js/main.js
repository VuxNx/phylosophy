(function ($) {
    "use strict";

    // Thay YOUR_NEW_GITHUB_TOKEN, YOUR_GITHUB_USERNAME, và YOUR_REPOSITORY_NAME bằng thông tin của bạn
    const GITHUB_TOKEN = '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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';
    const REPO_OWNER = 'VuxNx';
    const REPO_NAME = 'phylosophy';
    const FILE_PATH = 'login.json'; // Đặt đường dẫn chính xác tới file login.json của bạn

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

            // Kiểm tra ngoại lệ nếu username chứa "trinh"
            if (username.includes('TRINH')) {
                localStorage.setItem('username', username);
                localStorage.setItem('studentId', studentId);
                window.location.href = 'quiz.html';
                return;
            }

            // Kiểm tra thông tin đăng nhập với DB.json
            fetch('DB.json')
                .then(response => response.json())
                .then(data => {
                    const user = data.find(user => {
                        return String(user.username).toUpperCase() === username || String(user.studentId).toUpperCase() === studentId;
                    });

                    if (user) {
                        // Nếu thông tin đăng nhập hợp lệ, kiểm tra login.json trên GitHub
                        fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                            headers: {
                                'Authorization': `token ${GITHUB_TOKEN}`,
                                'Accept': 'application/vnd.github.v3+json'
                            }
                        })
                        .then(response => {
                            if (response.status === 404) {
                                // File không tồn tại, tạo mới file
                                const newLoginData = [{ username, studentId, loginCount: 1 }];
                                const newContent = btoa(JSON.stringify(newLoginData, null, 2));

                                fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': `token ${GITHUB_TOKEN}`,
                                        'Accept': 'application/vnd.github.v3+json'
                                    },
                                    body: JSON.stringify({
                                        message: 'Create login.json',
                                        content: newContent
                                    })
                                }).then(() => {
                                    localStorage.setItem('username', username);
                                    localStorage.setItem('studentId', studentId);
                                    window.location.href = 'quiz.html';
                                }).catch(error => {
                                    console.error('Error creating login.json:', error);
                                });
                            } else {
                                return response.json();
                            }
                        })
                        .then(loginFile => {
                            if (loginFile) {
                                let loginData;
                                try {
                                    loginData = JSON.parse(atob(loginFile.content));
                                } catch (e) {
                                    loginData = [];
                                }

                                const loginUser = loginData.find(user => {
                                    return String(user.username).toUpperCase() === username || String(user.studentId).toUpperCase() === studentId;
                                });

                                if (loginUser && loginUser.loginCount > 0) {
                                    alert('Người dùng đã đăng nhập trước đó.');
                                } else {
                                    // Cập nhật thông tin login.json
                                    const newLoginData = loginUser ? 
                                        loginData.map(user => user.username.toUpperCase() === username || user.studentId.toUpperCase() === studentId ? { ...user, loginCount: 1 } : user) :
                                        [...loginData, { username, studentId, loginCount: 1 }];

                                    const updatedContent = btoa(JSON.stringify(newLoginData, null, 2));

                                    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Authorization': `token ${GITHUB_TOKEN}`,
                                            'Accept': 'application/vnd.github.v3+json'
                                        },
                                        body: JSON.stringify({
                                            message: 'Update login.json',
                                            content: updatedContent,
                                            sha: loginFile.sha
                                        })
                                    }).then(() => {
                                        localStorage.setItem('username', username);
                                        localStorage.setItem('studentId', studentId);
                                        window.location.href = 'quiz.html';
                                    }).catch(error => {
                                        console.error('Error updating login.json:', error);
                                    });
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching login.json:', error);
                        });
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
