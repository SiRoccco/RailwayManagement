window.onload = function () { 

    startup()

    $('#removetripbutton').click(function(e){
        removetriproot(e)
    })

    $('#addtripbutton').click(function(e){
        addtriproot(e)
    })

    $('#removetrainbutton').click(function(e){
        removetrainroot(e)
    })

    $('#addtrainbutton').click(function(e){
        addtrainroot(e)
    })

    $('#removestationbutton').click(function(e){
        removestationroot(e)
    })

    $('#addstationbutton').click(function(e){
        addstationroot(e)
    })

    $('#stationbutton').click(function(e){
        stationtabroot(e)
    })

    $('#trainbutton').click(function(e){
        traintabroot(e)
    })

    $('#tripbutton').click(function(e){
        triptabroot(e)
    })

    $('#ppsuccessbutton').click(function (e) {
        $('#ppsuccess').removeClass('openpopup')
    })

    $('#ppfailbutton').click(function (e) {
        $('#ppfail').removeClass('openpopup')
    })

}

function selectonchange(){
    console.log('changing')
    disableselected()
}


function triptabroot(e){
    selectbutton(e)
    showcontentlevel1(e)
    $('#addtripbutton').click()
}

function traintabroot(e){
    selectbutton(e)
    showcontentlevel1(e)
    $('#addtrainbutton').click()
}

function stationtabroot(e) {  
    selectbutton(e)
    showcontentlevel1(e)
    $('#addstationbutton').click()
}

function addstationroot(e) {
    selectbutton(e)
    showcontentlevel2(e)
}

function removestationroot(e){
    selectbutton(e)
    showcontentlevel2(e)
    generateremovestation()
}

function addtrainroot(e) {
    selectbutton(e)
    showcontentlevel2(e)
    generateaddtrain()
}

function removetrainroot(e){
    selectbutton(e)
    showcontentlevel2(e)
    generateremovetrain()
}

function addtriproot(e) {
    selectbutton(e)
    showcontentlevel2(e)
    generateaddtrip()
}

function removetriproot(e){
    selectbutton(e)
    showcontentlevel2(e)
    generateremovetrip()
}

function showcontentlevel2(e){
    let buttonid = e.target.id

    let target = $(`#${buttonid}`).val()

    $('.contentlevel2').hide()

    $(`#${target}`).show()
}

function showcontentlevel1(e){
    let buttonid = e.target.id

    let target = $(`#${buttonid}`).val()

    $('.contentlevel1').hide()

    $(`#${target}`).show()
}

function generateremovetrip(){

}

function disableselected(){

    $('option').prop('disabled' , false)

    var addtrip = document.getElementById('addtrip')

    var selects = addtrip.getElementsByTagName('select')

    let selectedoptions = []

    for(i=0 ; i < selects.length ; i++){
        var selectedoption = selects[i].value
        selectedoptions.push(selectedoption)
    }

    for(i=0 ; i < selects.length ; i++){
        for(j=0 ; j < selectedoptions.length ; j++){
            $(`#${selects[i].id} option[value = ${selectedoptions[j]}]`).prop('disabled' , true)
        }
    }
}

function enableoption(stationid){
    var addtrip = document.getElementById('addtrip')

    var selects = addtrip.getElementsByTagName('select')

    for(i=0 ; i < selects.length ; i++){
        $(`#${selects[i].id} option[value = ${stationid}]`).prop('disabled' , false)
    }

    // let selectedoptions = []

    // for(i=0 ; i < selects.length ; i++){
    //     var selectedoption = selects[i].value
    //     selectedoptions.push(selectedoption)
    // }

    // for(i=0 ; i < selects.length ; i++){
    //     for(j=0 ; j < selectedoptions.length ; j++){
    //         $(`#${selects[i].id} option[value = ${selectedoptions[j]}]`).prop('disabled' , true)
    //     }
    // }
}

function checkdefaultstations(){

    let firststationinfo = {}
    let laststationinfo = {}

    let fsdt = $('#firststationdepttime').val() +':00'
    fsdt = fsdt.replace('T' , ' ')
    let fsname = $('#firststationselect option:selected').text()
    let fsval = $('#firststationselect').val()
    console.log('First station name : ' + fsname)
    console.log('First station dept time : ' + fsdt)

    if(fsval == -99){
        openpopupfail('Please choose a station for source')
        throw new Error('Please choose a station for source')
    }

    if(fsdt == '' || fsdt == null){
        openpopupfail('Please choose a departure time for source station')
        throw new Error('No departure time for source station')
    }else{
        firststationinfo.stationname = fsname
        firststationinfo.arrivaltime = null
        firststationinfo.departuretime = fsdt
    }

    let lsat = $('#finalstationarrtime').val()  +':00'
    lsat = lsat.replace('T' , ' ')
    let lsname = $('#finalstationselect option:selected').text()
    let lsval = $('#finalstationselect option:selected').val()

    if(lsval == -99 || lsval == null){
        openpopupfail('Please choose a station for destination')
        throw new Error('Please choose a station for destination')
    }

    if(lsat == '' || lsat == null){
        openpopupfail('Please choose a arrival time for destination station')
        throw new Error('No arrival time for destination station')
    }else{
        laststationinfo.stationname = lsname
        laststationinfo.arrivaltime = lsat
        laststationinfo.departuretime = null
    }

    return {firststationinfo , laststationinfo}
}

function checkassignedtrain() {  
    var trainselect = document.getElementById('assignedtrain')
    let trainid = trainselect.value

    if(trainid == -99 || trainid == null){
        openpopupfail('Please choose a train for this trip')
        throw new Error('No train chosen')
    }else{
        return trainid
    }
}

function checkassignedcpk(){
    var cpkinput = document.getElementById('costperkminput')
    if(isNaN(parseInt(cpkinput.value))){
        openpopupfail('Enter valid Cost Per Km')
        throw new Error('Invalid cost per km')
    }else{
        return parseInt(cpkinput.value)
    }
}

function checkintermediatestations(){
    var intermediatestations = document.getElementsByClassName('intermediatestation')

    let stations = []

    for(i=0 ; i < intermediatestations.length ; i++){

        let singlestationinfo = {}

        var inputs = intermediatestations[i].getElementsByTagName('input')

        var stationarrtime = inputs[0].value.replace('T' , ' ')  +':00'
        var stationdepttime = inputs[1].value.replace('T' , ' ') +':00'

        if(stationarrtime == null || stationarrtime == ''){
            openpopupfail('No arrival time for intermediate station' + (i+1))
            throw new Error('No arrival time for intermediate station' + (i+1))
        }else{
            singlestationinfo.arrivaltime = stationarrtime
        }

        if(stationdepttime == null || stationdepttime == ''){
            openpopupfail('No departure time for intermediate station' + (i+1))
            throw new Error('No departure time for intermediate station' + (i+1))
        }else{
            singlestationinfo.departuretime = stationdepttime
            
        }

        var select = intermediatestations[i].getElementsByClassName('stationselect')
        if(select[0].value == -99){
            openpopupfail('Please choose a station for for station' + (i+1))
            throw new Error('Please choose a station for for station' + (i+1))
        }else{
            singlestationinfo.stationname = $(`#${select[0].id} option:selected`).text()
        }

        stations.push(singlestationinfo)

    }

    return stations
    
}

async function posttrip(){

    var stations = []

    var trainid = checkassignedtrain()

    var cpk = checkassignedcpk()

    var defaultstations = checkdefaultstations()

    stations.push(defaultstations.firststationinfo)
    stations.push(defaultstations.laststationinfo)

    if(document.getElementById('intermediatestations').children.length > 0){
       var intermediatestations =  checkintermediatestations()
       console.log(intermediatestations)
       for(i=0 ; i < intermediatestations.length ; i++){
        stations.push(intermediatestations[i])
       }
    }

    console.log(stations)

    let data = {}
    data.data = stations
    data.trainid = trainid
    data.costperkm = cpk
    console.log(data)
    
    let promise12 = new Promise((resolve,reject) => {
        $.ajax({
            type: "post",
            url: url + "trip",
            data: JSON.stringify(data),
            dataType: "json",
            contentType : 'json',
            success: function (response) {
                if(response.success){
                    openpopupsuccess('Trip added successfully')
                    resetaddtrip()
                }else{
                    openpopupfail(response.msg)
                }
            }
        });
    })
}

function resetaddtrip() {  
    generateaddtrip()
}

async function generateaddtrip(){
    var addtripdiv = document.getElementById('addtrip')

    $('.stations').empty()

    await getsourcestation()

    await getfinalstation()

    await assigntrain()
}

async function assigntrain() {  

    $('#assigntrain').empty()
    $('#assigncostperkm').empty()

    let trains = await gettraindata()

    var assigntrain = document.getElementById('assigntrain')

    var trainselect = document.createElement('select')
    trainselect.setAttribute('id' , 'assignedtrain')
    trainselect.setAttribute('class' , 'stationselect')

    for(i=0 ; i< trains.length ; i++){
        var option = document.createElement('option')
        option.setAttribute('value' , trains[i].trainID)
        option.innerText = trains[i].trainName

        trainselect.append(option)
    }

    var defaultoption = document.createElement('option')
    defaultoption.innerText = '-----Select-----'
    defaultoption.setAttribute('value' , -99)
    defaultoption.selected = true

    trainselect.append(defaultoption)

    var span =document.createElement('span')
    span.innerText = 'Assign a Train for this trip'

    assigntrain.append(span.cloneNode(true))
    assigntrain.append(trainselect)

    span.innerText = 'Enter Cost Per Km'
    var cpkinput = document.createElement('input')
    cpkinput.setAttribute('id' , 'costperkminput')
    cpkinput.setAttribute('type' , 'number')

    var assigncpk = document.getElementById('assigncostperkm')

    assigncpk.append(span.cloneNode(true))
    assigncpk.append(cpkinput)

    console.log(trains)
}

function removethisstation(buttonid){
    var parentid = document.getElementById(buttonid).parentNode.id
    var selects = document.getElementById(parentid).getElementsByClassName('stationselect')
    var stationid = selects[0].value
    enableoption(stationid)
    $(`#${parentid}`).remove()
}

async function addintermediatestation(buttonid){
    var intermediatestations = document.getElementById('intermediatestations')

    var len = intermediatestations.children.length

    var arrtimeinputdiv = document.createElement('div')
    arrtimeinputdiv.setAttribute('class' , 'flexcolumn')

    var depttimeinputdiv = document.createElement('div')
    depttimeinputdiv.setAttribute('class' , 'flexcolumn')

    var stationselectdiv = document.createElement('div')
    stationselectdiv.setAttribute('class' , 'flexcolumn')
    

    var stationdiv = document.createElement('div')
    stationdiv.setAttribute('class' , 'intermediatestation')
    stationdiv.setAttribute('id' , 'station' + (len+1))

    var span = document.createElement('span')
    span.innerText = 'Arrival Time'

    var arrtimeinput = document.createElement('input')
    arrtimeinput.setAttribute('id' , 'arrtime' + (len+1))
    arrtimeinput.setAttribute('type' , 'datetime-local')
    
    arrtimeinputdiv.appendChild(span.cloneNode(true))
    arrtimeinputdiv.appendChild(arrtimeinput)

    

    var stationselect = await getstationselect()
    stationselect.setAttribute('class' , 'stationselect')
    stationselect.setAttribute('id' , 'intermediatestationselect' + (len+1))
    stationselect.setAttribute('onchange' , 'selectonchange()')

    span.innerText = 'Station ' + (len+1)
    stationselectdiv.appendChild(span.cloneNode(true))
    stationselectdiv.appendChild(stationselect)

    var depttimeinput = document.createElement('input')
    depttimeinput.setAttribute('id' , 'depttime' + (len+1))
    depttimeinput.setAttribute('type' , 'datetime-local')
    
    span.innerText = 'Departure Time'
    depttimeinputdiv.appendChild(span.cloneNode(true))
    depttimeinputdiv.appendChild(depttimeinput)
    
    var removestationbutton = document.createElement('button')
    removestationbutton.setAttribute('id' , 'removestationbutton' + (len+1))
    removestationbutton.setAttribute('class' , 'roundbutton')
    removestationbutton.setAttribute('onclick' , 'removethisstation(this.id)')
    removestationbutton.innerText = 'x'

    var addstationbutton = document.createElement('button')
    addstationbutton.setAttribute('id' , 'addintermediatestationbutton' + (len+1))
    addstationbutton.setAttribute('class' , 'roundbutton')
    addstationbutton.setAttribute('onclick' , 'addintermediatestation(this.id)')
    addstationbutton.innerText = '+'

    stationdiv.appendChild(arrtimeinputdiv)
    stationdiv.appendChild(stationselectdiv)
    stationdiv.appendChild(depttimeinputdiv)
    stationdiv.appendChild(removestationbutton)
    stationdiv.appendChild(addstationbutton)

    if(buttonid == null){
        intermediatestations.prepend(stationdiv)
    }else{
        var parent = document.getElementById(buttonid).parentElement
        parent.insertAdjacentElement("afterend" , stationdiv)
    }

    disableselected()

}

async function getfinalstation(){
    $('#deststation').empty()

    var destdiv = document.getElementById('deststation')

    var span = document.createElement('span')
    span.innerText = 'Destination Station'

    var stationinputdiv = document.createElement('div')
    stationinputdiv.setAttribute('class' , 'flexcolumn')

    var stationselect = await getstationselect()
    stationselect.setAttribute('id' , 'finalstationselect')
    stationselect.setAttribute('class' , 'stationselect')
    stationselect.setAttribute('onchange' , 'selectonchange()')

    stationinputdiv.appendChild(span.cloneNode(true))
    stationinputdiv.appendChild(stationselect)

    var arrtimeinputdiv = document.createElement('div')
    arrtimeinputdiv.setAttribute('class' , 'flexcolumn')

    span.innerText = 'Arrival Time'

    var arrtimeinput = document.createElement('input')
    arrtimeinput.setAttribute('type' , 'datetime-local')
    arrtimeinput.setAttribute('id' , 'finalstationarrtime')

    arrtimeinputdiv.appendChild(span)
    arrtimeinputdiv.appendChild(arrtimeinput)

    destdiv.append(arrtimeinputdiv)
    destdiv.append(stationinputdiv)
    
    

}

async function getsourcestation(){
    $('#srcstation').empty()
    var srcdiv = document.getElementById('srcstation')

    var span = document.createElement('span')
    span.innerText = 'Source Station'

    var stationinputdiv = document.createElement('div')
    stationinputdiv.setAttribute('class' , 'flexcolumn')

    let stationselect = await getstationselect()
    console.log(stationselect)
    stationselect.setAttribute('id' , 'firststationselect')
    stationselect.setAttribute('class' , 'stationselect')
    stationselect.setAttribute('onchange' , 'selectonchange()')

    stationinputdiv.appendChild(span.cloneNode(true))
    stationinputdiv.appendChild(stationselect)

    var depttimeinputdiv = document.createElement('div')
    depttimeinputdiv.setAttribute('class' , 'flexcolumn')

    span.innerText = 'Departure Time'

    var depttimeinput = document.createElement('input')
    depttimeinput.setAttribute('type' , 'datetime-local')
    depttimeinput.setAttribute('id' , 'firststationdepttime')

    depttimeinputdiv.appendChild(span)
    depttimeinputdiv.appendChild(depttimeinput)

    var addstationbutton =document.createElement('button')
    addstationbutton.setAttribute('id' , 'addanotherstation')
    addstationbutton.setAttribute('class' , 'roundbutton')
    addstationbutton.setAttribute('onclick' , 'addintermediatestation()')
    addstationbutton.innerText = '+'

    srcdiv.append(stationinputdiv)
    srcdiv.append(depttimeinputdiv)
    srcdiv.append(addstationbutton)

}

async function getstationselect(){
    let stations = await getstationdata()
    
    var stationselect = document.createElement('select')
    for(i=0 ; i < stations.length  ; i++){
        var option =document.createElement('option')
        option.value = stations[i].stationID
        option.innerText = stations[i].stationName

        stationselect.prepend(option)
    }
    
    var defaultoption = document.createElement('option')
    defaultoption.setAttribute('value' , -99)
    defaultoption.innerText = '-----Select-----'
    defaultoption.selected = true

    stationselect.append(defaultoption)

    return Promise.resolve(stationselect)
}

function selectbutton(e) {
    console.log(e.target.id)
    let buttonid = e.target.id
    var buttons = document.getElementById(buttonid).parentNode.childNodes

    for(i=0 ; i < buttons.length ; i++){
        if(buttons[i].id != buttonid){
            $(`#${buttons[i].id}`).removeClass('selected');
        }else{
            $(`#${buttons[i].id}`).addClass('selected');
        }
    }

}

async function deletetrain(){
    let promise3 = new Promise((resolve , reject) => {

        let trainid = document.getElementById('trainnameselect').value

        if(trainid == null || trainid == ''){
            openpopupfail('invalid train ID')
            return
        }else{
            let traininfo = {}
            traininfo.trainid = trainid
        }

        $.ajax({
            type: "DELETE",
            url: url + "train?tid=" + trainid ,
            success: function (response) {
                if(response.success){
                    generateremovetrain()
                    openpopupsuccess('Train deleted successfully')
                }else{
                    openpopupfail(response.msg)
                }
            }
        });
    })
}

async function gettraindata(){
    let promise2 = new Promise((resolve , reject) => {
        $.ajax({
            type: "get",
            url: url + "train",
            dataType: "json",
            success: function (response) {
                if(response.success){
                    console.log(response)
                    resolve(response.data.trains)
                }else{
                    openpopupfail(response.msg)
                }
            }
        });
    })

    return await promise2
}

async function generateremovetrain(){
    
    let trains = await gettraindata()

    $('#removetrain').empty()

    var removetraindiv = document.getElementById('removetrain')

    var div = document.createElement('div')
    div.setAttribute('class' , 'flexrow')

    var trainselect = document.createElement('select')
    trainselect.setAttribute('id' , 'trainnameselect')
    trainselect.setAttribute('class' , 'stationselect')

    for(i=0 ; i< trains.length ; i++){
        let option = document.createElement('option')
        option.setAttribute('value' , trains[i].trainID)
        option.innerText = trains[i].trainName
        trainselect.append(option)
    }

    div.appendChild(trainselect)

    var removetrainbutton = document.createElement('button')
    removetrainbutton.setAttribute('id', 'deletetrain')
    removetrainbutton.setAttribute('onclick', 'deletetrain()')
    removetrainbutton.setAttribute('class' , 'submitbutton')
    removetrainbutton.innerText = 'Remove'

    div.appendChild(removetrainbutton)

    removetraindiv.append(div)
}

function generateaddtrain(){
    $('#addtrain').empty()
    
    var addtraindiv = document.getElementById('addtrain')

    var trainnamediv = document.createElement('div')
    trainnamediv.setAttribute('class' , 'flexrow')

    var coachdiv = document.createElement('div')
    coachdiv.setAttribute('class' , 'flexrow')

    var seatdiv = document.createElement('div')
    seatdiv.setAttribute('class' , 'flexrow')

    var buttondiv = document.createElement('div')
    buttondiv.setAttribute('class' , 'flexrow')

    var span = document.createElement('span')
    
    span.innerText = 'Train Name'
    
    var trainnameinput = document.createElement('input')
    trainnameinput.setAttribute('id' , 'trainnameinput')
    trainnameinput.setAttribute('type' , 'text')
    trainnamediv.appendChild(span.cloneNode(true))
    trainnamediv.appendChild(trainnameinput)

    var coachinput = document.createElement('input')
    coachinput.setAttribute('id' ,'coachinput')
    coachinput.setAttribute('type' , 'number')
    coachinput.setAttribute('class' , 'posinput')

    var seatinput = document.createElement('input')
    seatinput.setAttribute('id' ,'seatinput')
    seatinput.setAttribute('type' , 'number')
    seatinput.setAttribute('class' , 'posinput')

    var posttrainbutton = document.createElement('button')
    posttrainbutton.setAttribute('class' , 'submitbutton')
    posttrainbutton.setAttribute('id' , 'posttrainbutton')
    posttrainbutton.setAttribute('type', 'button')
    posttrainbutton.setAttribute('onclick' , 'posttrain()')
    posttrainbutton.innerText = 'Add Train'

    span.innerText = 'Number of Coaches'
    coachdiv.appendChild(span.cloneNode(true))
    coachdiv.appendChild(coachinput)

    span.innerText = 'Number of Seats per Coach'
    seatdiv.appendChild(span.cloneNode(true))
    seatdiv.appendChild(seatinput)

    addtraindiv.appendChild(trainnamediv)
    addtraindiv.appendChild(coachdiv)
    addtraindiv.appendChild(seatdiv)
    addtraindiv.appendChild(posttrainbutton)

}

async function posttrain(){

    let trainname = $('#trainnameinput').val()
    let coaches = $('#coachinput').val()
    let seats = $('#seatinput').val()

    let traininfo = {}

    if(trainname == null || trainname == ''){
        openpopupfail('Train Name cannot be empty')
        return
    }else{
        traininfo.trainname = trainname
    }

    if(coaches == '' || coaches == null){
        openpopupfail('Number of coach cannot be empty')
        return
    }else{
        traininfo.coaches = parseInt(coaches)
    }

    if(seats == '' || seats == null){
        openpopupfail('Number of seats cannot be empty')
        return
    }else{
        traininfo.seatspercoach = parseInt(seats)
    }

    $.ajax({
        type: "post",
        url: url + "train",
        data: JSON.stringify(traininfo),
        dataType: "json",
        success: function (response) {
            if(response.success){
                openpopupsuccess('Train added successfully')
                generateaddtrain()
            }else{
                openpopupfail(response.msg)
            }
        }
    });
}

async function deletestation(){
    var stationid = document.getElementById('selectstationid').value

    let stationinfo = {}
    stationinfo.sid = stationid
    $.ajax({
        type: "DELETE",
        url: url + "station",
        dataType : 'json',
        data: JSON.stringify(stationinfo),
        success: async function (response) {
            if(response.success){
                await generateremovestation()
                openpopupsuccess('Station removed successfully')
            }else{
                openpopupfail(response.msg)
            }
        }
    });
}

async function poststation(){
    let stationname = $('#stationnameinput').val()
    let posx = $('#posxinput').val()
    let posy = $('#posyinput').val()

    let stationinfo = {}

    if(stationname == '' || stationname == null){
        openpopupfail('Station Name cannot be empty')
        return
    }else{
        stationinfo.stationname = stationname
    }

    if(posx == '' || posx == null){
        openpopupfail("X coordinate cannot be empty")
        return
    }else{
        stationinfo.posx = posx
    }

    if(posy == '' || posy == null){
        openpopupfail("Y coordinate cannot be empty")
        return
    }else{
        stationinfo.posy = posy
    }

    $.ajax({
        type: "POST",
        url: url + "station",
        data: JSON.stringify(stationinfo),
        dataType: "json",
        success: function (response) {
            if(response.success){
                openpopupsuccess('Station added successfully')
                generateaddstation()

            }else{
                openpopupfail(response.msg)
            }
        }
    });

}

async function generateremovestation() {

    let stations = await getstationdata()

    console.log(stations)

    $('#removestation').empty()

    var removestationdiv = document.getElementById('removestation')
    
    var div = document.createElement('div')
    div.setAttribute('class' , 'flexrow')

    let stationselect = document.createElement('select')
    stationselect.setAttribute('class' , 'stationselect')
    stationselect.setAttribute('id' , 'selectstationid')

    for(i=0 ; i< stations.length ; i++){
        let option = document.createElement('option')
        option.value = stations[i].stationID
        option.innerText = stations[i].stationName

        stationselect.appendChild(option)
    }

    var removestationbutton = document.createElement('button')
    removestationbutton.setAttribute('id', 'deletestationbutton')
    removestationbutton.setAttribute('class' , 'submitbutton')
    removestationbutton.setAttribute('onclick' , 'deletestation()')
    removestationbutton.innerText = 'Remove Station'

    div.appendChild(stationselect)    
    div.appendChild(removestationbutton)    

    removestationdiv.appendChild(div)
}

function generateaddstation() {

    $('#addstation').empty()
    $('#addstation').show()

    var addstation = document.getElementById('addstation')

    var stationnamediv = document.createElement('div')
    stationnamediv.setAttribute('class' , 'flexrow')

    var span = document.createElement('span')
    span.innerText = 'Station Name '

    var input = document.createElement('input')
    input.setAttribute('type' , 'text')
    input.setAttribute('id' , 'stationnameinput')

    stationnamediv.appendChild(span.cloneNode(true))
    stationnamediv.appendChild(input)

    var stationposdiv = document.createElement('div')
    stationposdiv.setAttribute('class' , 'flexrow')

    var posxinput = document.createElement('input')
    posxinput.setAttribute('class' , 'posinput')
    posxinput.setAttribute('type' , 'number')
    posxinput.setAttribute('id' , 'posxinput')

    var posyinput = document.createElement('input')
    posyinput.setAttribute('class' , 'posinput')
    posyinput.setAttribute('type' , 'number')
    posyinput.setAttribute('id' , 'posyinput')

    span.innerText = 'Pos X'
    stationposdiv.appendChild(span.cloneNode(true))
    stationposdiv.appendChild(posxinput)

    span.innerText = 'Pos Y'
    stationposdiv.appendChild(span.cloneNode(true))
    stationposdiv.appendChild(posyinput)

    var addstationbutton = document.createElement('button')
    addstationbutton.setAttribute('id' , 'poststationbutton')
    addstationbutton.setAttribute('class' , 'submitbutton')
    addstationbutton.setAttribute('type' , 'button')
    addstationbutton.setAttribute('onclick' , 'poststation()')
    addstationbutton.innerText = 'Add Station'

    var buttondiv = document.createElement('div')
    buttondiv.setAttribute('class' , 'flexrow')
    buttondiv.appendChild(addstationbutton)

    addstation.appendChild(stationnamediv)
    addstation.appendChild(stationposdiv)
    addstation.appendChild(buttondiv)
    
}

async function getstationdata(){
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
                    resolve(response.data.stations)
                }else{
                    openpopupfail(response.msg)
                }
            }
        });
    })
    var response = await promise1
    return response
}

 async function startup() {  
    await getstationdata()
    $('#stationbutton').addClass('selected');
    $('#addstationbutton').addClass('selected');
    $('.contentlevel1').hide()
    $('.contentlevel2').hide()
    $('#stationcontent').show()
    $('#addstation').show()

    generateaddstation()
 }

 const url = "http://localhost:8080/RailwayManagement/"


 function openpopupfail(msg){
    var ppfail = document.getElementById('ppfail')
    document.getElementById('failresponse').innerText = msg
    ppfail.classList.add('openpopup')
}

function openpopupsuccess(msg){
    var ppfail = document.getElementById('ppsuccess')
    document.getElementById('successresponse').innerText = msg
    ppfail.classList.add('openpopup')
}