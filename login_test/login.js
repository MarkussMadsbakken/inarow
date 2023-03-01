var nameinput = document.getElementById("username");
var passinput = document.getElementById("password");

var errormsg = document.getElementById("errormsg");

var sendingData = false;

passinput.addEventListener("keydown",function(event){
    if (event.key === "Enter"){
        let nameinputvalue = document.getElementById("username").value;
        let passinputvalue = document.getElementById("password").value;
        document.getElementById("password").value = "";
        sendLogin(nameinputvalue, passinputvalue);
    }
})

//Hashe clientside
//Serveren eller hackere kan ikke få tak i passordet direkte, men kan lett stjele hashen
//Bedre metode: https://security.stackexchange.com/questions/25585/is-my-developers-home-brew-password-security-right-or-wrong-and-why
async function sendLogin(username, password){
    result = await sha256(password);
    publishLogin(username,result)
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

function publishLogin(username, password){
    if (sendingData){return;}
    sendingData = true;
  
    var xhp = new XMLHttpRequest(); // initierer en ny request
    xhp.responseType = 'text';
  
    xhp.open("POST","/login/"+ username + "/" + password,true); //man setter url til meldingen
    xhp.send();

    xhp.timeout = 2000;
  
    xhp.onload = () => {
      sendingData = false;
      errormsg.innerHTML = (xhp.response);
    }
    
    xhp.ontimeout = (e) =>{ //connection timed out, resend
      console.log("timeout, try again");
    }
  }

//sende en token til bruker på login, burde holdes styr på i databasen. For at meldinger skal gå igjennom, må denne tokenen attaches til alle post requests, og valideres av serveren.
//altså lese token, og sjekke om den stemmer med brukeren. 
//dette er fucka insecure men igjen bryr vi oss ikke veldig om sikkerhet