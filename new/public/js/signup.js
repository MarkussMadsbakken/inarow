var nameinput = document.getElementById("username");
var passinput = document.getElementById("password");
var submitbutton = document.getElementById("submitbutton")

var errormsg = document.getElementById("errormsg");

passinput.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        let nameinputvalue = document.getElementById("username").value;
        let passinputvalue = document.getElementById("password").value;
        document.getElementById("password").value = "";
        sendNewUser(nameinputvalue, passinputvalue);
    }
})

submitbutton.addEventListener("click",function(){
    let nameinputvalue = document.getElementById("username").value;
    let passinputvalue = document.getElementById("password").value;
    document.getElementById("password").value = "";
    sendNewUser(nameinputvalue, passinputvalue);
})

//sende ny bruker til serveren
async function sendNewUser(username, password){
    result = await sha256(password);
    publishNewUser(username,result);
}

//sjålet fra stackoverflow
async function sha256(message) { //metode for å hashe en string
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function publishNewUser(username, password){
    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST","/signup/"+ username + "/" + password,true); //man setter url til meldingen
    xhp.send();

    xhp.timeout = 2000;
  
    xhp.onload = () => {
        if(xhp.response.includes("user created")){
            publishLogin(username, password);

        } else {
            errormsg.innerHTML = (xhp.response);
        }
    }
    
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      console.log("timeout, try again");
    }
  }


function publishLogin(username, password){
    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
    xhp.open("POST","/login/"+ username + "/" + password,true); //man setter url til meldingen
    xhp.setRequestHeader("Content-Type", "application/json")
    xhp.send(JSON.stringify({"username": username, "password": password}));

    xhp.timeout = 2000;
  
    xhp.onload = () => {

      if (xhp.response.includes("login")){
        localStorage.setItem("username",xhp.response.split(":")[1])
        window.location = "/"

      } else {
        errormsg.innerHTML = (JSON.parse(xhp.response)["message"]); //parse og display error. Passport outputter alltid json
        }
      }
    
    xhp.ontimeout = (e) =>{ //connection timed out
      console.log("timeout, try again");
    }
  }