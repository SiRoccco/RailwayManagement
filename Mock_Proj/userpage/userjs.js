window.onload = function(){
    // disablepastdate()
    // $('#searchtraintab').click(getstationdata)
    checkuser()


    $('#searchtraintab').click(function (e) { 
        e.preventDefault();
        setselected(e);
        getstationdata(e);
        showselected(e);
    });

    $('#viewticketstab').click(function (e) { 
        e.preventDefault();
        setselected(e)
        showselected(e);
    });

    $('#booktickettab').click(function (e) { 
        e.preventDefault();
        setselected(e)
        showselected(e);
    });

    $('#searchtraintab').addClass('selected');

    $('#searchbutton').click(startsearch)
    $('#ppfailbutton').click(function(){
    $('#ppfail').removeClass('openpopup');
    })

    $('#viewticketstab').click(gettickets)
    
    $('#ticketidsearch').on('change keydown paste input' , getticketbyid)

    // $.ajaxSetup({
    // headers: { 'x-authorization': localStorage.getItem('token') }
    // });

    getstationdata()
    startup()

}

const url = "http://localhost:8080/RailwayManagement/"

async function getticketbyid(){
    if(localStorage.getItem('username') == 'guest' || localStorage.getItem('username') == null){
        
        openpopup('Login to continue')
        return
    }

    let promise11 = new Promise((resolve, reject) => {

        let ticketid = $('#ticketidsearch').val()
        
        $.ajax({
            type: "get",
            url: url + "ticket",
            data: {'userid' : localStorage.getItem('userid') , 'ticketid' : ticketid},
            dataType: "json",
            beforeSend: function(xhr){
                xhr.setRequestHeader("X-Authorization" , localStorage.getItem('token'))
            },
            success: function (response) {
                if(response.success){
                    $('#ticketcontent').html(``)
                    resolve(response.data.tickets)
                }else{
                    $('#ticketcontent').html(`<h1> No tickets found in this ID </h1>`)
                }
                console.log(response)
            }
        });
    })

    let tickets = await promise11

    displaytickets(tickets)
}


async function gettickets(){
    if(localStorage.getItem('username') == 'guest' || localStorage.getItem('username') == null){
        
        openpopup('Login to continue')
        return
    }
    let promise8 = new Promise((resolve, reject) => {
        const token = localStorage.getItem('token')
        $.ajax({
            type: "get",
            url: url + "ticket",
            data: {'userid' : localStorage.getItem('userid')},
            dataType: "json",
            headers :{'X-Authorization' : token},
            crossDomain : true,
            cors: true ,
            contentType:'application/json',
            secure: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            success: function (response) {
                if(response.success){
                    $('#ticketcontent').html(``)
                    resolve(response.data.tickets)
                }else{
                    $('#ticketcontent').html(`<h1> ${response.msg} </h1>`)
                }
                console.log(response)
            }
        });
    })

    let tickets = await promise8

    displaytickets(tickets)
}

function displaytickets(tickets){
    var ticketcontent = document.getElementById('ticketcontent')

    var hrdiv = document.createElement('div')
    hrdiv.innerHTML = '<hr>'

    for(i=0 ; i < tickets.length ; i++){
        var singleticketdiv = document.createElement('div')
        singleticketdiv.setAttribute('class' , 'ticket')
        singleticketdiv.setAttribute('id' , 'ticket'+tickets[i].ticketid)

        var trainnamediv = document.createElement('div')
        trainnamediv.setAttribute('class' , 'singlepass')

        var span = document.createElement('span')
        span.innerText = 'Train Name : ' + tickets[i].trainname

        trainnamediv.appendChild(span.cloneNode(true))

        span.innerText = 'Seats Booked : ' + tickets[i].numberofseatsbooked
        trainnamediv.appendChild(span.cloneNode(true))

        span.innerText = 'Ticket ID : ' + tickets[i].ticketid
        trainnamediv.appendChild(span.cloneNode(true))

        var passengersummarydiv = document.createElement('div')
        passengersummarydiv.setAttribute('class' , 'passengersummary')

        span.innerText = 'Passenger Info'
        passengersummarydiv.appendChild(span.cloneNode(true))

        var headerdiv = document.createElement('div')
        headerdiv.setAttribute('class' , 'singlepass')

        span.innerText = 'Passenger Name'
        headerdiv.appendChild(span.cloneNode(true))

        span.innerText = 'Coach Number'
        headerdiv.appendChild(span.cloneNode(true))

        span.innerText = 'Seat Number'
        headerdiv.appendChild(span.cloneNode(true))

        passengersummarydiv.appendChild(headerdiv)

        let passengers = tickets[i].passengers

        for(j=0 ; j < passengers.length ; j++){
            var singlepassdiv = document.createElement('div')
            singlepassdiv.setAttribute('class' , 'singlepass')

            span.innerText = passengers[j].passengername
            singlepassdiv.appendChild(span.cloneNode(true))

            span.innerText = passengers[j].coachno
            singlepassdiv.appendChild(span.cloneNode(true))

            span.innerText = passengers[j].seatno
            singlepassdiv.appendChild(span.cloneNode(true))

            passengersummarydiv.appendChild(singlepassdiv)
        }

        var journeydiv = document.createElement('div')
        journeydiv.setAttribute('class' , 'passengersummary')

        span.innerText = 'Journey Info'
        journeydiv.appendChild(span.cloneNode(true))

        var journeyinfo1 = document.createElement('div')
        journeyinfo1.setAttribute('class' , 'singlepass')

        span.innerText = 'From : ' + tickets[i].boardingstation.stationname
        journeyinfo1.appendChild(span.cloneNode(true))

        span.innerText = 'To : ' + tickets[i].arrivalstation.stationname
        journeyinfo1.appendChild(span.cloneNode(true))

        var journeyinfo2 = document.createElement('div')
        journeyinfo2.setAttribute('class' , 'singlepass')

        span.innerText = 'Departure Time : ' + tickets[i].boardingstation.departuretime
        journeyinfo2.appendChild(span.cloneNode(true))

        span.innerText = 'From : ' + tickets[i].arrivalstation.arrivaltime
        journeyinfo2.appendChild(span.cloneNode(true))

        journeydiv.appendChild(journeyinfo1)
        journeydiv.appendChild(journeyinfo2)

        var farediv = document.createElement('div')
        span.innerText = 'Fare : ' + tickets[i].fare
        farediv.appendChild(span.cloneNode(true))

        singleticketdiv.appendChild(trainnamediv)
        singleticketdiv.appendChild(hrdiv.cloneNode(true))
        singleticketdiv.appendChild(passengersummarydiv)
        singleticketdiv.appendChild(hrdiv.cloneNode(true))
        singleticketdiv.appendChild(journeydiv)
        singleticketdiv.appendChild(hrdiv.cloneNode(true))
        singleticketdiv.appendChild(farediv)

        ticketcontent.appendChild(singleticketdiv)
    }
}

async function postpassenger(selectid){

    var passengersarray = []
    var passinfo = {}

    var newpassengername = document.getElementById('putpassengername')
    if(newpassengername.value == '' || newpassengername.value == null){
        openpopup('name cannot be empty')
        return;
    }else{
        passinfo.passengername = newpassengername.value
    }

    var newpassengergender = document.getElementById('putpassengergendermale')
    if(newpassengergender.checked == true){
        passinfo.gender = 'male'
    }else{
        passinfo.gender = 'female'
    }

    var newpassengerage = document.getElementById('putpassengerage')
    if(newpassengerage.value == '' || newpassengerage.value == null){
        openpopup('age cannot be empty')
        return;
    }else{
        passinfo.age = newpassengerage.value
    }

    passengersarray.push(passinfo)

    var passenger ={}
    passenger.userid = localStorage.getItem('userid')
    passenger.username = localStorage.getItem('username')
    passenger.passengers = passengersarray
    console.log(passinfo)

    let promise6 = new Promise((resolve , reject) =>{
        $.ajax({
            type: "post",
            url: url + "passenger",
            data: JSON.stringify(passenger),
            dataType: "json",
            contentType :'json',
            success: function (response) {
                if(response.success){
                    console.log("passid of last pass" + response.lastpassengerid)
                    passinfo.passengerid = response.lastpassengerid
                    resolve(passinfo)
                }else{
                    openpopup('could not add passenger')
                }
            }
        });
    }).then(async (passinfo , passid)=>{
        var parent =  document.getElementById(selectid).parentNode.parentNode
        var nameselect = parent.getElementsByTagName('select')
        console.log(nameselect)

        // generateexistingpassengers(selectid.charAt(selectid.length-1))

        const res = await generateexistingpassengers()

        document.getElementById(selectid).value = passinfo.passengerid

        var inputs = parent.getElementsByTagName('input')
        if(passinfo.gender == 'male'){
            inputs[0].checked =true
        }else{
            inputs[1].checked =true
        }

        inputs[2].value = passinfo.age

        document.getElementById('putpassengerdetailspopup').style.visibility = 'hidden'

        selectappendedpassenger(selectid,passinfo.passengerid)
    })
}

function selectappendedpassenger(selectid,passid){
    console.log('selectid : ' + selectid + ' passid : ' + passid)
    
    $(`#${selectid} option[value = ${passid}]`).prop('selected' , true)
}

function putpassengerdetails(selectid , optionvalue){
    if(optionvalue == 0){
        addnewpassenger(selectid,optionvalue)
    }else if(optionvalue == -1){

    }
    else{
        console.log('select existing passengers')

        $.ajax({
            type: "get",
            url: url + "passenger",
            data: {'passengerid' : optionvalue, 'userid' :localStorage.getItem('userid')},
            dataType: "json",
            success: function (response) {
                if(response.success){
                    console.log(response.data.passenger)
                    
                    var div = document.getElementById(selectid).parentElement.parentElement
                    var inputs = div.getElementsByTagName('input')

                    console.log(inputs)
                    if (response.data.passenger.gender == 'male') {
                        inputs[0].checked = true
                    } else {
                        inputs[1].checked = true
                    }
                    inputs[2].value = response.data.passenger.age

                    // disableselected()

                }else{
                    console.log(response)
                }
            }
        });
    }
}

function disableselected(){
    var selects = document.getElementsByClassName('nameselect')

    // console.log(selectid)

    for(i=0 ; i < selects.length ; i++){
        var selectedvalue = selects[i].value

        for(j=0 ; j < selects.length ; j++){
            if(i==j){
                continue;
            }

            var options = selects[j].options

            for(k=0 ; k < options.length ; k++){
                if(options[k].value == selectedvalue){
                    options[k].disabled = true
                }
            }
        }
    }
}

async function addnewpassenger(selectid,optionvalue){
    document.getElementById('putpassengerbutton').value = selectid
    toggleaddpasspopup()
}

async function generateexistingpassengers(id){

    let promise7 = new Promise((resolve,reject) => {
        $.ajax({
            type: "get",
            url: url + "passenger",
            data: {'userid' : localStorage.getItem('userid')},
            dataType: "json",
            success: function (response) {
                console.log(response)
                if(response.success){
                    resolve(response.data.passengers)
                }else{
                    openpopup(response.msg)
                }
            },
            error : function (error) {  openpopup(error)  }
        });
    })

    let passengerdetails = await promise7

    refreshlist(passengerdetails)
}

async function bookticket(button , passengerinfo) {

    let promise5 = new Promise((resolve,reject)=>{
        var thistrain = JSON.parse(localStorage.getItem('thistrain'))

        var bookinginfo = {}
        bookinginfo.userid = localStorage.getItem('userid')
        bookinginfo.tripid = thistrain.trip.trip_id
        bookinginfo.startingstationid = thistrain.source.stationid
        bookinginfo.endingstationid = thistrain.destination.stationid
        bookinginfo.consecutiveseatpref = true
        bookinginfo.passengers = JSON.parse(passengerinfo)
        console.log(JSON.parse(passengerinfo))
        console.log(bookinginfo)

        $.ajax({
            type: "post",
            url: url + "booking",
            data: JSON.stringify(bookinginfo),
            dataType: "json",
            beforeSend : function(xhr){
                xhr.setRequestHeader('x-authorization' , localStorage.getItem('token'))
            },
            success: function (response) {
                if(response.success){
                    console.log(response.msg)
                    openpopup('Ticket booked successfully!')
                }else{
                    openpopup(response.msg)
                }
            }
        });
    })

}

// async function getboardingstationsinfo(tripid){
//     let promise3 = new Promise((resolve,reject)=>{
//         $.ajax({
//             type: "get",
//             url: url +"trip",
//             data: {'tripid' : tripid},
//             dataType: "json",
//             success: function (response) {
//                 if(response.success){
//                     resolve(response)
//                     console.log('success')
//                 }else{
//                     openpopup(response.msg)
//                 }
//             }
//         });
//     })

//     let response = await promise3;
//     console.log(response)
// }

async function createsummary(passengerinfo){

    // let promise4 = new Promise((resolve , reject) =>{
    //     $.ajax({
    //         type: "get",
    //         url: url+"users",
    //         data: {"email" : localStorage.getItem('email') , 'userid' : localStorage.getItem(userid)},
    //         dataType: "json",
    //         success: function (response) {
    //             if(response.success){
    //                 resolve(response.data)
    //             }else{
    //                 openpopup(response.msg)
    //             }
    //         }
    //     });
    // })

    // let result= await promise4;

    var faresummary = document.getElementById('summary')
    var summarydiv = document.createElement('div')
    summarydiv.setAttribute('class', 'summary')

    var usernamespan = document.createElement('span')
    usernamespan.innerText = 'Username : ' +localStorage.getItem('username')

    var hrdiv = document.createElement('div')
    var hr = document.createElement('hr')

    hrdiv.appendChild(hr)

    var passerngersummarydiv = document.createElement('div')
    passerngersummarydiv.setAttribute('class' ,'passengersummary')

    var passengersdiv = document.createElement('div')
    var passengersspan = document.createElement('span')
    passengersspan.innerText = 'Passengers Info :'

    var farediv = document.createElement('div')
    var farespan = document.createElement('span')
    console.log(document.getElementsByClassName('singlepass').length)
    let i = JSON.parse(localStorage.getItem('thistrain'))
    console.log('i : ' + i.fare)
    farespan.innerText = 'Fare : ' + ( i.fare * document.getElementById('passengercontent1').childNodes.length)

    farediv.appendChild(farespan)

    passengersdiv.append(passengersspan)

    for(i=0 ; i < passengerinfo.length ; i++){
        var singlepassdiv = document.createElement('div')
        singlepassdiv.setAttribute('class' , 'singlepass')

        var namespan = document.createElement('span') 
        var genderspan = document.createElement('span') 
        var agespan = document.createElement('span') 

        namespan.innerText = passengerinfo[i].passengername
        genderspan.innerText = passengerinfo[i].gender
        agespan.innerText = passengerinfo[i].age

        singlepassdiv.append(namespan.cloneNode(true))
        singlepassdiv.append(genderspan.cloneNode(true))
        singlepassdiv.append(agespan.cloneNode(true))

        passengersdiv.append(singlepassdiv)
    }

    var button = document.createElement('button')
    button.innerText = 'Book Now'
    button.setAttribute('class' , 'bookingbutton')
    button.setAttribute('id' , 'booknowbutton')
    button.setAttribute('value' , JSON.stringify(passengerinfo))
    button.setAttribute('type' , 'button')
    button.setAttribute('onclick' , 'bookticket(this.id,this.value)')

    var radiobuttondiv = document.createElement('div')
    radiobuttondiv.innerText = "Book Seats under same coach  "

    var radiobutton = document.createElement('input')
    radiobutton.setAttribute('type' , 'radio')
    radiobutton.setAttribute('name' ,'preferenceradio')
    radiobutton.setAttribute('value' ,1)

    summarydiv.appendChild(usernamespan)
    summarydiv.appendChild(hrdiv.cloneNode(true))
    summarydiv.appendChild(passengersdiv)
    summarydiv.appendChild(hrdiv.cloneNode(true))
    summarydiv.appendChild(farediv)
    summarydiv.appendChild(button)

    faresummary.appendChild(summarydiv)


}

function generatefaresummary(){
    $('#summary').empty()
    
    console.log(localStorage.getItem('thistrain'))

    var passinfodivs = document.getElementById('passengercontent1').childNodes

    passengersarray = []

    for(i=0 ; i < passinfodivs.length ; i++){
        var select = document.getElementById('passselect'+(i+1))

        let passengerid = select.value
        if(passengerid == 0 || passengerid == -1){
            openpopup('please choose a passenger')
            return;
        }
        let passengername = select.options[select.selectedIndex].text

        var singlediv = passinfodivs[i]

        var inputs = singlediv.getElementsByTagName('input')

        let passenger = {}

        if(inputs[0].checked == true){
            let passengergender = 'male'
            passenger.gender = passengergender
        }else{
            let passengergender = 'female'
            passenger.gender = passengergender
        }

        let passengerage = inputs[2].value

        if(passengerage <= 0 || passengerid == null){
            openpopup('invalid input in age')
        }
        
        passenger.passengerid = passengerid
        passenger.passengername = passengername
        
        passenger.age = passengerage

        passengersarray.push(passenger)

    }

    let passengerinfo = {}
    passengerinfo.passengers = passengersarray

    console.log(passengerinfo)

    createsummary(passengersarray)
}

function appendSavebutton(){
    if(document.getElementById('savebutton')){
        $('#savebutton').remove()
    }
    var passcontent = document.getElementById('passengercontent')

    var savebutton = document.createElement('button')
    savebutton.setAttribute('id', 'savebutton')
    savebutton.setAttribute('class', 'utilitybutton')
    savebutton.setAttribute('onclick', 'generatefaresummary()')
    savebutton.innerText = "Save & Continue"
    passcontent.appendChild(savebutton)
    
}

function appendPassenger(){
    console.log('append passenger working')

    var lastchild = document.getElementById('passengercontent1')
    len = lastchild.childNodes.length + 1
    console.log(lastchild.childNodes.length)

    var passcontentdiv = document.createElement('div')
    passcontentdiv.setAttribute('id', 'passenger'+len)
    passcontentdiv.setAttribute('class', 'passinfo')
    
    var nameinputdiv = document.createElement('div')
    var genderinputdiv = document.createElement('div')
    var ageinputdiv = document.createElement('div')

    nameinputdiv.setAttribute('class' , 'namediv')
    genderinputdiv.setAttribute('class' , 'genderdiv')
    ageinputdiv.setAttribute('class' , 'agediv')

    // var nameinput = document.createElement('input')
    // nameinput.setAttribute('class' , 'passnameinput')
    // nameinput.setAttribute('id' , 'passname'+len)
    // nameinput.setAttribute('type' , 'text')
    // nameinput.setAttribute('onchange' , 'clearwarning(this.id)')

    var nameinputsel = document.createElement('select')
    nameinputsel.setAttribute('class' , 'nameselect')
    nameinputsel.setAttribute('id' , 'passselect' +len)
    nameinputsel.setAttribute('onchange' , 'putpassengerdetails(this.id,this.value)')

    var selectanoption =  document.createElement('option')
    selectanoption.setAttribute('class' , 'passoption')
    selectanoption.value = -1
    selectanoption.innerText = '-----Select-----'

    var defaultoption = document.createElement('option')
    defaultoption.setAttribute('class' , 'passoption')
    defaultoption.value = 0
    defaultoption.innerText = 'Add new passenger'

    nameinputsel.appendChild(selectanoption.cloneNode(true))
    nameinputsel.appendChild(defaultoption.cloneNode(true))

    nameinputdiv.appendChild(nameinputsel)

    // var genderinput = document.createElement('input')
    // genderinput.setAttribute('class' , 'passgenderinput')
    // genderinput.setAttribute('id' , 'passgender'+len)
    // genderinput.setAttribute('type' , 'text')

    var maleradio = document.createElement('input')
    maleradio.setAttribute('type' , 'radio')
    maleradio.setAttribute('name' ,'genderradio' + len)
    maleradio.setAttribute('id' , 'maleradio')
    maleradio.checked = true
    maleradio.disabled = true

    var femaleradio = document.createElement('input')
    femaleradio.setAttribute('type' , 'radio')
    femaleradio.setAttribute('name' ,'genderradio' + len)
    femaleradio.setAttribute('id' , 'femaleradio')
    femaleradio.disabled = true

    var malelabel = document.createElement('label')
    malelabel.setAttribute('for' , 'maleradio')
    malelabel.innerText = 'Male'
    var femalelabel = document.createElement('label')
    femalelabel.setAttribute('for' , 'femaleradio')
    femalelabel.innerText = 'Female'

    genderinputdiv.appendChild(maleradio.cloneNode(true))
    genderinputdiv.appendChild(malelabel.cloneNode(true))
    genderinputdiv.appendChild(femaleradio.cloneNode(true))
    genderinputdiv.appendChild(femalelabel.cloneNode(true))

    var ageinput = document.createElement('input')
    ageinput.setAttribute('class' , 'passageinput')
    ageinput.setAttribute('id' , 'passage'+len)
    ageinput.setAttribute('type' , 'number')
    ageinput.setAttribute('min' , 6)
    ageinput.setAttribute('max' , 60)
    ageinput.setAttribute('onchange' , 'clearwarning(this.id)')
    ageinput.disabled = true

    nameinputdiv.appendChild(nameinputsel)
    // genderinputdiv.appendChild(genderinput)
    ageinputdiv.appendChild(ageinput)

    // passcontentdiv.appendChild(nameinputdiv)
    // passcontentdiv.appendChild(genderinputdiv)
    // passcontentdiv.appendChild(ageinputdiv)
    
    var span = document.createElement('span')

    span.innerText = 'Name :'
    nameinputdiv.prepend(span.cloneNode(true))
    // passcontentdiv.appendChild(span.cloneNode(true))
    passcontentdiv.appendChild(nameinputdiv.cloneNode(true))
    
    span.innerText = 'Gender :'
    genderinputdiv.prepend(span.cloneNode(true))
    // passcontentdiv.appendChild(span.cloneNode(true))
    passcontentdiv.appendChild(genderinputdiv.cloneNode(true))
    
    span.innerText = 'Age :'
    ageinputdiv.prepend(span.cloneNode(true))
    // passcontentdiv.appendChild(span.cloneNode(true))
    passcontentdiv.appendChild(ageinputdiv.cloneNode(true))

    var removebutton = document.createElement('button')
    removebutton.setAttribute('id','removepass'+len)
    removebutton.setAttribute('onclick' , 'removethispas(this.id)')
    removebutton.setAttribute('class' , 'removepassbutton')

    passcontentdiv.appendChild(removebutton)

    passengercontent1.appendChild(passcontentdiv)

    generateexistingpassengers(len)

    // disableselected()

    appendSavebutton()
}

function removethispas(buttonid){
    console.log(document.getElementById(buttonid).parentNode)
    var select = document.getElementById(buttonid).parentElement.getElementsByTagName('select')
    // disableselected()
    $(`#${select.id}`).val([])
    $(`#${document.getElementById(buttonid).parentElement.id}`).remove()
    
}

function refreshlist(passengerdetails){
    var selects = document.getElementsByClassName('nameselect')

    for(i=0 ; i < selects.length; i++){
        $(`#${selects[i].id}`).empty()
        var singlesel = document.getElementById(selects[i].id)

        var selectanoption =  document.createElement('option')
        selectanoption.setAttribute('class' , 'passoption')
        selectanoption.value = -1
        selectanoption.innerText = '-----Select-----'

        var defaultoption = document.createElement('option')
        defaultoption.setAttribute('class' , 'passoption')
        defaultoption.value = 0
        defaultoption.innerText = 'Add passenger'

        singlesel.prepend(selectanoption.cloneNode(true))
        

        for(j=0 ; j < passengerdetails.length ; j++){
            var option = document.createElement('option')
            option.setAttribute('value' , passengerdetails[j].passengerid)
            option.innerText = passengerdetails[j].passengername

            // for(k=0 ; k < selects.length ; k++){
            //     if(selects[k].value == passengerdetails[k].passengerid){
            //         option.disabled = true
            //     }
            // }

            singlesel.append(option)

        }

        singlesel.append(defaultoption)

    }

}

function addfirstpassenger(){
    var passengercontent = document.getElementById('passengercontent')
    var passengercontent1 = document.getElementById('passengercontent1')
    
    // if(!document.getElementById('choosepassenger')){
    //     var addapbutton = document.createElement('button')
    //     addapbutton.setAttribute('id' , 'choosepassenger')
    //     addapbutton.setAttribute('class' , 'utilitybutton')
    //     addapbutton.setAttribute('onclick' , 'getpassengerpopup()')
    //     addapbutton.innerText = 'Choose Passenger'
    
    //     var buttondiv = document.createElement('div')
    //     buttondiv.appendChild(addapbutton)
    
    //     passengercontent.prepend(buttondiv)
    // }

    if(!document.getElementById('addanotherpassenger')){
        var addapbutton = document.createElement('button')
        addapbutton.setAttribute('id' , 'addanotherpassenger')
        addapbutton.setAttribute('class' , 'utilitybutton')
        addapbutton.setAttribute('onclick' , 'appendPassenger()')
        addapbutton.innerText = 'Add Passenger'

        var buttondiv = document.createElement('div')
        buttondiv.appendChild(addapbutton)

        passengercontent.append(buttondiv)
    }


    var passcontentdiv = document.createElement('div')
    passcontentdiv.setAttribute('id', 'passenger1')
    passcontentdiv.setAttribute('class', 'passinfo')
    
    var nameinputdiv = document.createElement('div')
    var genderinputdiv = document.createElement('div')
    var ageinputdiv = document.createElement('div')
    
    nameinputdiv.setAttribute('class' , 'namediv')
    genderinputdiv.setAttribute('class' , 'genderdiv')
    ageinputdiv.setAttribute('class' , 'agediv')

    var nameinputsel = document.createElement('select')
    nameinputsel.setAttribute('class' , 'nameselect')
    nameinputsel.setAttribute('id' , 'passselect1')
    nameinputsel.setAttribute('onchange' , 'putpassengerdetails(this.id,this.value)')

    var selectanoption =  document.createElement('option')
    selectanoption.setAttribute('class' , 'passoption')
    selectanoption.value = -1
    selectanoption.innerText = '-----Select-----'

    var defaultoption = document.createElement('option')
    defaultoption.setAttribute('class' , 'passoption')
    defaultoption.value = 0
    defaultoption.innerText = 'Add new passenger'

    nameinputsel.appendChild(selectanoption.cloneNode(true))
    nameinputsel.appendChild(defaultoption)

    // var genderinput = document.createElement('input')
    // genderinput.setAttribute('class' , 'passgenderinput')
    // genderinput.setAttribute('id' , 'passgender1')
    // genderinput.setAttribute('type' , 'text')

    var maleradio = document.createElement('input')
    maleradio.setAttribute('type' , 'radio')
    maleradio.setAttribute('name' ,'genderradio1')
    maleradio.setAttribute('id' , 'maleradio')
    maleradio.checked = true
    maleradio.disabled = true

    var femaleradio = document.createElement('input')
    femaleradio.setAttribute('type' , 'radio')
    femaleradio.setAttribute('name' ,'genderradio1')
    femaleradio.setAttribute('id' , 'femaleradio')
    femaleradio.disabled = true

    var malelabel = document.createElement('label')
    malelabel.setAttribute('for' , 'maleradio')
    malelabel.innerText = 'Male'
    var femalelabel = document.createElement('label')
    femalelabel.setAttribute('for' , 'femaleradio')
    femalelabel.innerText = 'Female'

    genderinputdiv.appendChild(maleradio.cloneNode(true))
    genderinputdiv.appendChild(malelabel.cloneNode(true))
    genderinputdiv.appendChild(femaleradio.cloneNode(true))
    genderinputdiv.appendChild(femalelabel.cloneNode(true))

    var ageinput = document.createElement('input')
    ageinput.setAttribute('class' , 'passageinput')
    ageinput.setAttribute('id' , 'passage1')
    ageinput.setAttribute('type' , 'number')
    ageinput.setAttribute('min' , 6)
    ageinput.setAttribute('max' , 60)
    ageinput.setAttribute('onchange' , 'clearwarning(this.id)')
    ageinput.disabled =true

    nameinputdiv.appendChild(nameinputsel.cloneNode(true))
    // genderinputdiv.appendChild(genderinput.cloneNode(true))
    ageinputdiv.appendChild(ageinput.cloneNode(true))

    var span = document.createElement('span')

    span.innerText = 'Name :'
    nameinputdiv.prepend(span.cloneNode(true))
    // passcontentdiv.appendChild(span.cloneNode(true))
    passcontentdiv.appendChild(nameinputdiv.cloneNode(true))
    
    span.innerText = 'Gender :'
    genderinputdiv.prepend(span.cloneNode(true))
    // passcontentdiv.appendChild(span.cloneNode(true))
    passcontentdiv.appendChild(genderinputdiv.cloneNode(true))
    
    span.innerText = 'Age :'
    ageinputdiv.prepend(span.cloneNode(true))
    // passcontentdiv.appendChild(span.cloneNode(true))
    passcontentdiv.appendChild(ageinputdiv.cloneNode(true))

    passengercontent1.appendChild(passcontentdiv)

    appendSavebutton()
}

function addpassengers(){
    $('#passengercontent1').empty()
    addfirstpassenger()
}

function gotobookticket(buttonid,train){
    // $('#passengercontent').empty()

    document.getElementById('booktickettab').disabled = false
    generateexistingpassengers(1)
    $('#summary').empty()
    localStorage.setItem('thistrain' , train)
    // console.log('thistrain' + localStorage.getItem('thistrain'))
    // console.log('booking button working')
    // console.log(localStorage.getItem('username'))
    if(localStorage.getItem('username') == 'guest' || localStorage.getItem('username') == null){
        alert('Login to continue')
        return
    }
    document.getElementById('booktickettab').click()   
    // console.log($(`#${buttonid}`).val())
    // getboardingstationsinfo($(`#${buttonid}`).val())
    addpassengers();

}

function startup(){
    $(`#searchtraincontent`).show()
        $(`#bookticketcontent`).hide()
        $(`#viewticketscontent`).hide()
}

function showselected(e){
    console.log(e.target.id)
    
    if(e.target.id == 'searchtraintab'){
        $(`#searchtraincontent`).show()
        $(`#bookticketcontent`).hide()
        $(`#viewticketscontent`).hide()
    }else if(e.target.id == 'viewticketstab'){
        $(`#searchtraincontent`).hide()
        $(`#bookticketcontent`).hide()
        $(`#viewticketscontent`).show()
    }else{
        $(`#searchtraincontent`).hide()
        $(`#bookticketcontent`).show()
        $(`#viewticketscontent`).hide()
    }
}

function setselected(e){
    console.log("this " + e.target.id)
    var ul = document.getElementById('functions').childNodes
    for(i=0 ; i < ul.length ; i++){
        if(ul[i].id != e.target.id){
            $(`#${ul[i].id}`).removeClass('selected')
        }else{
            $(`#${ul[i].id}`).addClass('selected')
        }
    }
}



async function startsearch(){
    $('#booktickettab').prop('disabled' , true)
    let src = $('#sourcelist').find(':selected').text()
    let dest = $('#destinationlist').find(':selected').text()
    let date = $('#date_picker').val()
    // console.log('src ' + src + ' dest '+ dest)

    let promise2 = new Promise((resolve , reject) =>{
        $.ajax({
            type: "get",
            url: url+'search',
            data : {'source' : src , 'destination' :dest , 'date' : date},
            dataType: "json",
            success: function (response) {
                if(response.success){
                    resolve(response.data.trains)
                }else{
                    $('#ppfail').addClass('openpopup')
                    $('#failresponse').text(response.msg)
                    console.log(response.msg)
                }
            },
            error : function (error) { 
                console.log(error)
            }
        });
    })

    let result = await promise2;
    populatetable(result)
}

function populatetable(trains){
    
    let resultarea = document.getElementById('resultarea')
    $('#resultarea').empty()
    // console.log(trains)

    for(i=0 ; i < trains.length ; i++){
        let resultdiv = document.createElement('div')
        resultdiv.setAttribute('id' , "train"+(i+1))
        resultdiv.setAttribute('class' , 'result')
        
        let header = document.createElement('div')
        header.setAttribute('class' , 'header')
        
        let trainnamespan = document.createElement('span')
        trainnamespan.innerText = trains[i].trainname

        let availableseatspan = document.createElement('span')
        availableseatspan.innerText = 'Available Seats : ' + trains[i].availableseats

        let farespan = document.createElement('span')
        farespan.innerText = 'Fare : ' +trains[i].fare

        let durationspan = document.createElement('span')
        durationspan.innerText = 'Duration : ' + trains[i].duration

        header.appendChild(trainnamespan)
        header.appendChild(availableseatspan)
        header.appendChild(farespan)
        header.appendChild(durationspan)

        let hr = document.createElement('hr')
        let hrdiv = document.createElement('div')
        hrdiv.appendChild(hr)

        let infodiv = document.createElement('div')
        infodiv.setAttribute('class' , 'info')

        let startsfrom = document.createElement('span')
        startsfrom.innerText = 'Starts from : ' + trains[i].trip.starting_station

        let goesto = document.createElement('span')
        goesto.innerText = 'Goes to : ' + trains[i].trip.ending_station

        infodiv.appendChild(startsfrom)
        infodiv.appendChild(goesto)

        let stationsdiv = document.createElement('div')
        stationsdiv.setAttribute('class' , 'stations')

        let srcstationdiv = document.createElement('div')
        srcstationdiv.setAttribute('class' , 'stationinfo')

        let deststationdiv = document.createElement('div')
        deststationdiv.setAttribute('class' , 'stationinfo')

        let stationnamespan = document.createElement('span')
        stationnamespan.innerText = trains[i].source.stationname

        let depttimespan = document.createElement('span')
        depttimespan.innerText = 'Departue Time : ' + trains[i].source.departuretime

        let arrtimespan = document.createElement('span')
        arrtimespan.innerText = 'Arrival Time : ' + trains[i].source.arrivaltime

        srcstationdiv.append(stationnamespan.cloneNode(true))
        srcstationdiv.append(hrdiv.cloneNode(true))
        srcstationdiv.append(arrtimespan.cloneNode(true))
        srcstationdiv.append(depttimespan.cloneNode(true))

        stationsdiv.append(srcstationdiv)

        stationnamespan.innerText = trains[i].destination.stationname
        depttimespan.innerText = 'Departue Time : ' + trains[i].destination.departuretime
        arrtimespan.innerText = 'Arrival Time : ' + trains[i].destination.arrivaltime

        deststationdiv.append(stationnamespan.cloneNode(true))
        deststationdiv.append(hrdiv.cloneNode(true))
        deststationdiv.append(arrtimespan.cloneNode(true))
        deststationdiv.append(depttimespan.cloneNode(true))

        stationsdiv.append(deststationdiv)

        let button = document.createElement('button')
        button.setAttribute('value' , JSON.stringify(trains[i]))
        button.setAttribute('class' , 'bookingbutton')
        button.setAttribute('type' , 'button')
        button.innerText = "Book Ticket"
        button.setAttribute('id' , 'bookingbutton'+(i+1))
        button.setAttribute('onclick' , 'gotobookticket(this.id , this.value)')
        if(trains[i].availableseats == 0){
            button.disabled =true
        }

        stationsdiv.append(button)

        resultdiv.append(header)
        resultdiv.append(hrdiv.cloneNode(true))
        resultdiv.append(infodiv)
        resultdiv.append(hrdiv.cloneNode(true))
        resultdiv.append(stationsdiv)

        resultarea.append(resultdiv)
    }

}



async function getstationdata(  ){

    let promise1 = new Promise((resolve , reject) => {
        $.ajax({
            type: "get",
            url: url + "station",
            dataType: "json",
            beforeSend : function(xhr){
                xhr.setRequestHeader('x-authorization' , localStorage.getItem('token'))
            },
            success: function (response) {
                if(response.success){
                    resolve(response)
                }else{
                    var ppfail = document.getElementById('ppfail')
                    ppfail.addClass('openpopup')
                    ppfail.getElementsByTagName('p').innerText = response.msg
                }
            }
        });
    })
    var response = await promise1
    populatestations(response.data.stations)
    
}
function populatestations(stations){
    var sourcelist = document.getElementById('sourcelist')
    var destinationlist = document.getElementById('destinationlist')
    
    $('#sourcelist').empty();
    $('#destinationlist').empty();
    for(i=0 ; i < 17 ; i++){
        var option = document.createElement('option')
        option.setAttribute('value' , stations[i].stationID)
        option.innerText = stations[i].stationName
        option.setAttribute('id' , "srcstationid" + stations[i].stationID)
        sourcelist.append(option)
    }
    for(i=0 ; i < 17 ; i++){
        var option = document.createElement('option')
        option.setAttribute('value' , stations[i].stationID)
        option.innerText = stations[i].stationName
        option.setAttribute('id' , "deststationid" + stations[i].stationID)
        destinationlist.append(option)
    }
    
}

function openpopup(msg){
    var ppfail = document.getElementById('ppfail')
    document.getElementById('failresponse').innerText = msg
    ppfail.classList.add('openpopup')
}

function disablepastdate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var  yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    console.log(today)
    document.getElementById("date_picker").setAttribute('min' , today)
    document.getElementById("date_picker").setAttribute('value' , today)
}

function checkuser(){
    if(localStorage.getItem('token') == null)
    {
        alert('Signed in as guest')
        $('#booktickettab').hide()
        $('#viewticketstab').hide()
    }else{
        alert('Signed in as ' + localStorage.getItem('username'))
        $('#booktickettab').prop('disabled' , true)
    }
}

window.onbeforeunload = function(){
    localStorage.clear()
}

function clearwarning(id){
    $(`#${id}`).removeClass('warning')
}

function getpassengerpopup(){
    console.log('button working')
    var passpop = document.getElementById('putpassengerdetailspopup')
    passpop.classList.add('openpopup')
}

function toggleaddpasspopup(){
    var popup = document.getElementById('putpassengerdetailspopup')
    if(popup.style.visibility == 'visible'){
        popup.style.visibility = 'hidden'
    }else{
        popup.style.visibility = 'visible'
    }
    
}
