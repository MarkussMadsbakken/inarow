/* tester = [[],[],[0],[[]]]
function leggtilNull(liste) {
    console.log(liste)
    const a = liste.length
    
    for (let i = 0; i < a; i++) {
        underList = liste[i]
        console.log(underList)
        
        if (typeof(underList)=="object") {
            underList = leggtilNull(underList)  
        }
        else {
            liste.push(0) 
        }
        console.log(underList)
        console.log(liste)
        
    }
    if (liste.length == 0) {
        liste.push(0)
    }
    return liste
}
ny = leggtilNull(tester)
console.log(ny, "2sdcwcw")
function fjernNull(liste) {
    console.log(liste)
    const a = liste.length
    
    for (let i = 0; i < a; i++) {
        underList = liste[i]
        console.log(underList)
        
        if (typeof(underList)=="object") {
            underList = fjernNull(underList)  
        }
        else {
            liste.pop()
        }
        console.log(underList)
        console.log(liste)
        
    }
    return liste
}
console.log(fjernNull(ny)) */



function listToString(liste, num = 0) {
    let CodeArray = ["!","@", "#", "$", "%", "&", "/", "(", ")", "="]
    let listToStringEle = ""

    for (let i = 0; i < liste.length; i++) {
        underList = liste[i]
        
        if (typeof(underList)=="object") {
            newEle = listToString(underList, num+1)
        }
        else if (typeof(underList)=="string" || typeof(underList=="int") ){
            newEle = underList 
        }
 
        
        if ((i != liste.length - 1) || (liste.length == 1))  {
            listToStringEle += newEle + CodeArray[num]  
        }
        else {
            listToStringEle += newEle
        }

    }
    if (liste.length == 0) {
        listToStringEle = CodeArray[num]
    }
    return listToStringEle
}


function stringToList(enTextString, num = 0) {
    let CodeArray = ["!","@", "#", "$", "%", "&","/", "(", ")","="]  

    if (enTextString.length == 1) {
        return []
    }

    else if (enTextString.includes(CodeArray[num])) {
        let splittaOpp = enTextString.split(CodeArray[num])
        for (let underList of splittaOpp) {

            if (CodeArray.map(CodeArray => underList.includes(CodeArray)).includes(true)) {

                newUnderList = stringToList(underList, num+1)
                
                splittaOpp.splice(splittaOpp.indexOf(underList), 1, newUnderList)
            }
            else if (underList == "") {
                if (splittaOpp.length> 1)
               { 
            }
                splittaOpp.splice(splittaOpp.indexOf(underList), 1)
 
            }
            else{
                newUnderList = parseInt(underList)
                splittaOpp.splice(splittaOpp.indexOf(underList), 1, newUnderList)
            }
        }
        return splittaOpp
    }
    else if (CodeArray.map(CodeArray => enTextString.includes(CodeArray)).includes(true)) {
        splittaOppe = stringToList(enTextString, num+1)
        return [splittaOppe]
        
    }

    return "teksten kan ikke gjøre om til liste" + enTextString + CodeArray.map(CodeArray => enTextString.includes(CodeArray)).includes(true)
}

let canvas = document.getElementById("rowgame")
var ctx = canvas.getContext("2d");
let cs = window.getComputedStyle(canvas);
canvas.width = 1000
canvas.height = 500
let ww = canvas.width
let wh = canvas.height
let cw = cs.getPropertyValue("width").replace("px","")
let ch = cs.getPropertyValue("height").replace("px","")
let sw = cw/ww
let sh = ch/wh
const wp =  1//4/5
let dim = [5,5]
let tile_size = Math.min(ww*wp/dim[0], wh*wp/dim[1])
let tile_color = "rgb(100, 100, 100)"
let board = []
for (let i = 0; i < dim[0]; i++) {
    board.push([])
}
let turn = 0
let player_info = 
[{color: "rgb(200,50,50)",name: "Rød"},
{color: "rgb(50,200,50)",name: "Grønn"},
{color: "rgb(50,50,200)",name: "Blå"}]
let players = 2
let winn_l = 4

function c_click(event) {
    let cw = cs.getPropertyValue("width").replace("px","")
    let ch = cs.getPropertyValue("height").replace("px","")
    let sw = cw/ww
    let sh = ch/wh
    let x = event.clientX/sw - ww/2 + dim[0]/2*tile_size;
    let y = event.clientY/sh - wh/2 - dim[1]/2*tile_size;
    let collum = Math.floor(x/tile_size)
    
    sendClick(String(collum), "test")
    //place()
}
function place(collum) {
    if (collum >= 0 && collum < dim[0]) {
        if (board[collum].length < dim[1]) {
            if (board[collum] == -1){
                console.log(board)
                board[collum] = []
                console.log(board)
            }
            board[collum].push(turn)
            turn ++
            if (turn >= players) {
                turn = 0
            }
        }
    }
    Draw()
    console.log(board);
    updateBoard(listToString(board));
}
function test_win() {
    for (let i = 0; i < board.length; i++) {
        const collum = board[i];
        for (let j = 0; j < collum.length; j++) {
            const tile = collum[j];
            if (dim[0]-i >= winn_l) {
                var test = true
                for (let h = 0; h < winn_l; h++) {
                    if (board[i+h].length > j) {
                        if (board[i+h][j] != tile) {
                            test = false
                        }
                    } else {test = false}
                }
                if (test) {return tile}
            }
            if (collum.length-j >= winn_l) {
                var test = true
                for (let h = 0; h < winn_l; h++) {
                    if (board[i][j+h] != tile) {
                        test = false
                    }
                }
                if (test) {return tile}
            }
            if (dim[0]-i >= winn_l) {
                var test = true
                for (let h = 0; h < winn_l; h++) {
                    if (board[i+h].length > (j+h)) {
                        if (board[i+h][j+h] != tile) {
                            test = false
                        }
                    } else {test = false}
                }
                if (test) {return tile}
            }
            if (dim[0]-i >= winn_l) {
                var test = true
                for (let h = 0; h < winn_l; h++) {
                    if (board[i+h].length > (j-h) && (j-h) >= 0) {
                        if (board[i+h][j-h] != tile) {
                            test = false
                        }
                    } else {test = false}
                }
                if (test) {return tile}
            }
        }
    }
    test = true
    for (let i = 0; i < board.length; i++) {
        if (board[i].length < dim[1]) {test = false}
    }
    if (test) {return "Likt"}

    return false
}

function Draw() {
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ww, wh);

    // draw all tiles
    for (let i = 0; i < dim[0]; i++) {
        for (let j = 0; j < dim[1]; j++) {
            Rect(tile_color, ww/2 - dim[0]*tile_size/2 + i*tile_size, wh/2 - dim[1]*tile_size/2 + j*tile_size, tile_size, tile_size)
        }
    }
    // draw all pieeeecesss
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            Circle(player_info[board[i][j]].color, ww/2 - dim[0]/2*tile_size + i*tile_size + tile_size/2, wh/2 + dim[1]/2*tile_size - j*tile_size - tile_size/2, tile_size*3/8)
        }
    }

    let resultat = test_win()
    if (resultat !== false) {
        if (resultat == "Likt") {
            txt = "Likt"
        } else {txt = String(player_info[resultat].name) + " vant!"}
        console.log(txt)
    }
    
    
    
}
function Circle(color, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
}
function Rect(color, x, y, u, v) {
    ctx.beginPath()
    //set color
    ctx.rect(x, y, u, v)
    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
}


sendingData = false
function sendClick(message, token) {
    if (sendingData){return;} //for å stoppe å lage flere requests samtidig
    sendingData = true;
  
    console.log("sending data");
    var xhp = new XMLHttpRequest(); // initierer en ny request

    xhp.responseType = 'text';

    xhp.open("POST","/boardupdate/" + token + "/" + message,true); //man setter url til meldingen
    xhp.send();
  
    xhp.timeout = 2000;
  
    xhp.onload = () => {
      sendingData = false;
    }
    xhp.ontimeout = (e) =>{ //connection timed out, resend
        console.log("timout for " + message)
    }
}

function updateBoard(newBoard) {
    board = stringToList(newBoard)
    update_Overview(test_players)
    Draw()
}

//template for å sende meldinger til server, og motta svar

var source = new EventSource("/serverMessages");
source.addEventListener("message", message => {
  var message = JSON.parse(message.data); //gjør om til dictionary
  console.log(message)
  //console.log("type: "+message.messageType)
  //console.log("message: "+message.message) 
  if (message.messageType === "text"){
    console.log(message.message.message) //message er er dataen inn, message er datataen fra serveren, og message er teksten ut
  } else if(message.messageType === "chat"){
    console.log(message.message.name +": "+ message.message.chatMessage); //rare navn men det er sånn det blir 
    displayChat(message.message)
  } else if (message.messageType === "id"){
    
  } else if (message.messageType === "boardUpdate") {
    turn = parseInt(message.message.turn)
    updateBoard(message.message.board)
  } else if (message.messageType === "boardMake") {
    dim = stringToList(message.message.dim)
    tile_size = Math.min(ww*wp/dim[0], wh*wp/dim[1])
    form.style.visibility = "hidden"
    canvas.style.visibility = "visible"
  }
})

var sendingData = false;

function sendData(message){
  if (sendingData){return;} //for å stoppe å lage flere requests samtidig
  sendingData = true;

  console.log("sending data");
  var xhp = new XMLHttpRequest(); // initierer en ny request

  xhp.open("POST","/"+message,true); //man setter url til meldingen
  xhp.send();

  xhp.timeout = 2000;

  xhp.onload = () => {
    sendingData = false;
  }

  xhp.ontimeout = (e) =>{ //connection timed out, resend
    console.log("timout for " + message)
    
    //resend
    console.log("resending data");
    var backupxhp = new XMLHttpRequest(); // initierer en ny request

    backupxhp.open("POST","/"+message,true);
    backupxhp.send();

    backupxhp.onload = () => {
      sendingData = false; //kanskje vise melding om connection issues
    }

    backupxhp.ontimeout = (e) => { //connection terminated, refresh page
      console.log("connection timed out");
    }
  }
}

//display chat
function displayChat(chatMessage){
  chat.push(chatMessage)
  if (chat.length > 50){
    chat.shift();
  }

  document.getElementById("msgContainer").innerHTML = "";
  var prevChatter = "";

  chat.forEach(chatMessage => { //display meldinger
    if (prevChatter === chatMessage.name){ //hvis meldingen sendes av samme person, sendes ikke navn og meldingene legges rett under hverandre (liten space ekstra space i css)
      document.getElementById("msgContainer").innerHTML = document.getElementById("msgContainer").innerHTML + "<div class = 'chatElement'>" + chatMessage.chatMessage + "</div>"
    }
    else{ //ny melding fra en annen person
      document.getElementById("msgContainer").innerHTML = document.getElementById("msgContainer").innerHTML + "<div class = 'chatElement'> <div class = 'chatName'>"+  chatMessage.name + ":"+ "</div> " + chatMessage.chatMessage + "</div>"
    }
    
    prevChatter = chatMessage.name //lagrer navn
  }); //vet ikke hvordan men dette fungerer
}

function requestKeepId(){
  var xhp = new XMLHttpRequest(); // initierer en ny request

  xhp.open("POST","/idRequest",true); //man setter url til meldingen
  xhp.send();
  xhp.timeout = 2000;
  
  xhp.onload = () => {
    if (xhp.responseText === "notAvailable"){
      console.log("id already taken, keeping generated by server")
    } else{
      sessionStorage.setItem("id",xml.responseText)
    }
    console.log(sessionStorage.getItem("id"))
  }
}
// id, irrelevant?
function doFirst(){
  if (sessionStorage.getItem("id") === null || sessionStorage.getItem("name")) {


    if (!(sessionStorage.getItem("id") === null)){
      requestKeepId();
    }
  }

  //sjekke om id finnes
}

var getName = document.getElementById("getName");

getName.addEventListener("keydown",function(event){
  if (event.key === "Enter"){
    sessionStorage.setItem("name",document.getElementById("getName").value);
    getName.value = ""; 
    console.log(sessionStorage.getItem("name"))
    document.getElementById("popup").style.visibility = "hidden";
  }
})

window.addEventListener("load", doFirst, false);


//--------------------- Form -----------------------
var startingGame = false;
form = document.getElementsByClassName("lobbyForm")[0]
form.addEventListener("submit", start_game)
function start_game(event) {
    event.preventDefault()

    if (startingGame){return;} //for å stoppe å lage flere requests samtidig
    startingGame = true;

    var message = "/game_start/" + String(form.x.value) + "/" + String(form.y.value) + "/" + String(form.l.value)
    console.log(message)

    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.open("POST",message,true); //man setter url til meldingen
    xhp.send();
    xhp.timeout = 2000;
    xhp.onload = () => {
        sendingData = false;
    }
    xhp.ontimeout = (e) =>{ //connection timed out, resend
        console.log("timout for " + message)
        //resend
        console.log("resending data");
        var backupxhp = new XMLHttpRequest(); // initierer en ny request
        backupxhp.open("POST","/"+message,true);
        backupxhp.send();
    
        backupxhp.onload = () => {
          sendingData = false; //kanskje vise melding om connection issues
        }
        backupxhp.ontimeout = (e) => { //connection terminated, refresh page
          console.log("connection timed out");
        }
    }
}
//--------------------- Oversikt --------------------
test_players = ["P1", "P2", "P3"]
ov = document.getElementsByClassName("playerOverview")[0]
function update_Overview(list) {
    txt = ""
    console.log(turn)
    for (let i = 0; i < list.length; i++) {
        k = (i+turn)%list.length
        _txt = list[k]
        // if txt == your name: txt = "(you)" 
        txt += "<div><p>" + list[k] + " (" + (k+1)*100 + ")</p><div class='color_indicator' style='background-color:" + player_info[k].color + ";'></div></div>"
    }
    ov.innerHTML = txt
}