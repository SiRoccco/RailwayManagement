window.onload = function(){

    $('#registerbutton').click(function (e) { 
        console.log("register button working")
        //e.preventDefault();
        register()
    });

    $('#ppsuccessbutton').click(function(){
        document.getElementById('ppsuccess').classList.remove('openpopup')
    })

    $('#ppfailbutton').click(function(){
        document.getElementById('ppfail').classList.remove('openpopup')
    })
    $('#testbutton').click(function(){
        var popup = document.getElementById('ppsuccess')
                popup.classList.add("openpopup")
    })
}

const url = "http://localhost:8080/RailwayManagement/"

function register(){

    var username = $('#registerusername').val();
    var email = $('#registeremail').val();
    var password = $('#registerpassword').val();
    console.log(username)
    data = {}
    data.username = username
    data.email = email
    data.password = password

    $.ajax({
        type: "post",
        url: url+"register",
        data: JSON.stringify(data),
        dataType: "json",
        contentType : "json",
        success: function (response) {
            if(response.success){
                var popup = document.getElementById('ppsuccess')
                popup.classList.add("openpopup")
            }   else{
                
                var popup = document.getElementById('ppfail')
                popup.classList.add("openpopup")
                $('#failresponse').text(response.msg);
            }     
        },
        error : function (error){
            console.log(error)
        }
    });

}