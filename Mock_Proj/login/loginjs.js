window.onload = function(){
    $('#loginbutton').click(login);

    $('#registerbutton').click(register);

    $('#guestbutton').click(guestmode);

    $('#ppfailbutton').click(function(){
        $('#ppfail').removeClass("openpopup");
    })

    localStorage.clear()
}

const url = "http://localhost:8080/RailwayManagement/"

function login(){

    let email = $('#loginemail').val()
    let password = $('#loginpassword').val()
    let data = {}
    data.email = email
    data.password = password
    $.ajax({
        type: "post",
        url : url+"login",
        data: JSON.stringify(data),
        dataType: "json",
        contentType : "json",
        success: function (response) {
            console.log(response.msg)
            if(response.success){
                localStorage.setItem('token' , response.authtoken)
                localStorage.setItem('username' , response.username)
                localStorage.setItem('userid' , response.userid)
                localStorage.setItem('email' , email)
                console.log(localStorage.getItem('username'))
                location.assign('../userpage/userhtml.html')
            }else{
                $('#ppfail').addClass('openpopup');
                document.getElementById('response').innerText = response.msg
            }
        },
        error : function(error){
            console.log("error loggin in")
            console.log(error)
        }
    });
    console.log("login button working")
}

function register(){
    window.location.assign("../register/registerhtml.html")
}


function guestmode(){
    location.assign("../userpage/userhtml.html")
}