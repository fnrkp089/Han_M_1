function getSelf(callback) {
    $.ajax({
      type: 'GET',
      url: '/api/users/chkLogin',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      success: function (response) {
        callback(response.user);
        let toggleLogOut =
        `
        <ul class="navbar-nav mr-auto text-right">
        <li class="nav-item" id="link-cart">
        </li>
        <li class="nav-item" id="link-logout">
          <a class="nav-link" data-toggle="modal" data-target="#signOutModal" style="cursor: pointer;">
            로그아웃<i class="fa fa-sign-out ml-2" aria-hidden="true"></i>
          </a>
          <div
            class="modal text-left"
            id="signOutModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="signOutModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="signOutModalLabel">로그아웃</h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  정말로 로그아웃 하시겠습니까?
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-outline-sparta"
                    data-dismiss="modal"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    class="btn btn-sparta"
                    onclick="signOut()"
                  >
                    로그아웃하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
        `
      $('#navbarSupportedContent').append(toggleLogOut);
      },
      error: function (xhr, status, error) {
        if (status == 401) {
          alert('로그인이 필요합니다.');
        } else {
          localStorage.clear();
          $('#navbarSupportedContent').empty();
          let toggleLogIn =
          `
          <ul class="navbar-nav mr-auto text-right">
          <li class="nav-item" id="link-cart">
          </li>
          <li class="nav-item" id="link-logout">
            <a class="nav-link" style="cursor: pointer;" onclick="location.href='login'">
              로그인<i class="fa fa-sign-out ml-2" aria-hidden="true"></i>
            </a>
            </ul>
          `
          $('#navbarSupportedContent').append(toggleLogIn);
        }
      },
    });
  }
    function sign_in() {
      let nickname = $("#inputNickname").val();
      let password = $("#inputPassword").val();
      $.ajax({
        type: "POST",
        url: "/api/auth",
        data: {
          nickname: nickname,
          password: password,
        },
        success: function (response) {
          localStorage.setItem("token", response.token);
          window.location.replace("/");
        },
        error: function (error) {
          customAlert(error.responseJSON.errorMessage);
        },
      });
    }

    function signOut() {
      localStorage.clear();
      window.location.href = 'login';
    }

    function customAlert(text) {
      $("#alertText").text(text);
      $("#alertModal").modal("show");
    }
