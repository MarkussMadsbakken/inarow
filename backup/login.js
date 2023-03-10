var http = require('http');
var url = require('url');
var fs = require('fs');
var fe = ".html"
var path = require("path");
var util = require('util')

var port = 3000
var express = require('express');
var app = express();

var lobby = {}
var users = {"f":{"username": "f"}}; //initierer brukere

//starte server
app.listen(port)
console.log("server started: http://localhost:"+port);

//css
app.use(express.static(__dirname));

//innlogget
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//loginpage
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'login.html'));
  });

//login
app.post("/login/:username/:password", (req,res) => {
    let username = req.params["username"]
    let password = req.params["password"] //henter verdier
    //sender respons 
    checkPassword(username,password,res);
  })

/* prøvde å fikse ett veldig spesifikt problem
app.post("/tokenAuth/:token", (req,res) => {
  Object.keys(users).forEach(user => {
    if (user === req.params["token"]){ //hvis brukeren eksisterer
      res.send("auth");
      return
    }
  });
  res.send("no_auth"); //hvis det ikke finnes noen bruker med token
})
*/

//signup
app.get('/signup', function(req,res){
    res.sendFile(path.join(__dirname, 'signup.html'));
})

app.post('/signup/:username/:password', (req,res) =>{
    //henter verdier
    let username = req.params["username"];
    let password = req.params["password"];

    addUser(username, password, res);
})
app.post('/logout/:token', (req,res) => {
  logOut(req.params["token"]);
  res.send("logout"); 
})

app.get('/game/:lobbyId', (req,res) => {
  let lobbyId = req.params["lobbyId"]
  if (!lobby.hasOwnProperty(lobbyId)){
    res.sendFile(path.join(__dirname, 'gameNotFound.html'))
  } else {
    res.sendFile(path.join(__dirname, 'game.html'))
  }
})

//joine lobby
app.post('/gameAuth/:lobbyId/:token',(req,res) =>{
  let lobbyId = req.params["lobbyId"];
  let token = req.params["token"];

  if (!users.hasOwnProperty(token)){ //hvis ingen bruker har token
    res.send("no_token")
    return;
  } else if (!lobby.hasOwnProperty(lobbyId)){ //lobbyen burde finnes, men just in case
    res.send("no_game");
    return;
  }

  //legg til bruker i brukere som er med i lobbyen
  res.send(addUserToLobby(token, lobbyId))
})

//lage lobby
app.post('/creategame/:token',(req,res) => {
  res.send(createLobby(req.params["token"]))
})

//vise lobbyer til brukeren
app.post('/getgames/:token', (req,res) => {
  var tempGames = "{"
  Object.keys(lobby).forEach(game => {
    tempGames = tempGames +'"'+game+'":{"users":"test","owner":"'+lobby[game]["owner"]+'"}' +","
  });
  tempGames = tempGames.substring(0,tempGames.length - 1); //fjerner komma fra siste element6
  tempGames = tempGames + "}" //legger til } på slutten
  res.send(tempGames) //sender antall games tilbake til brukeren
  kickUser(req.params["token"]) //hvis man fetcher games, betyr det at man ikke er i game lenger. sjekk dette hvis bugs!
})

createLobby("f") //debug

var databasePath = __dirname+"/very_secure_database.txt"; //hvor databasen ligger

const readFile = util.promisify(fs.readFile) //gjør at man kan gjøre noe med dataen etter den er hentet

function readDatabase(){
  // lese database
  return readFile(databasePath, 'utf8')
}

function appendDatabase(appendData){
  readDatabase().then(data =>{
    //finner hvor dataen skal skrives
    let endpos = data.search("--end");
    let prevdata = data.slice(0,endpos-4);
    let afterData = data.slice(endpos-3,endpos)
    let lastData = data.slice(endpos)
    
    data = prevdata + '\n'+"    ,"+appendData +"\n" +afterData + lastData; //metode for å sette inn data
    
    fs.writeFile(databasePath, data, err => { //skriver dataen
      if (err) { //hvis man ikke klarer å skrive til databasen
        console.error(err);
        return err;
      } else {
        console.log("data written \n")
        return "user added successfully"
      }
    })
  })
}

function fetchData(){ //henter ut data i et leselig format
  return readDatabase().then(data =>{
    //finner hvor dataen skal leses
    let beginpos = data.search("--begin");
    let endpos = data.search("--end");
    data = data.slice("--begin".length + beginpos,endpos);
    data = JSON.parse(data);

    return data //returnerer data
  })
}

function countJSONLength(data){ //teller antall ULIKE keys i et JSON objekt
  var count = 0
  for (let key in data){
    if(data.hasOwnProperty(key))
      count++;
  }
  return count;
}

function logOut(token){
  deleteLobby(token);//sletter lobby
  setTimeout(() =>{ //venter med å slette user, til deletelobby har slettet
    console.log("deleting: " + token)
    delete users[token];
  },"500")

}

async function checkPassword(username, userpassword,res){ //sjekker passord med verdi lagret i databasen

    //unngå at programmet kræsjer hvis verdiene ikke kan brukes
    if (typeof username == 'undefined'|| typeof userpassword == 'undefined'){
        res.send("input is undefined");
        return;
    }

    let db = await fetchData() //venter til data er hentet fra databasen

    //sjekker at brukernavnet finnes i databasen:
    if (!db.hasOwnProperty(username)){
        res.send("username does not exist");
        return;
    }

    if (db[username].password === userpassword){ //sjekker om passorder stemmer med det fra brukeren
      let found = false
      Object.values(users).forEach(user => {
        if (username === user["username"]){
          res.send("user already logged in");
          found = true;
        }
      });
      if (found){return} //fordi man ikke kan returnere ut av en foreach
      //lager ny token
      let newToken = generateToken();
      users[newToken] = {"username": username};
      res.send("login:" + newToken)
        
    } else {
        res.send("wrong username or password");
        return;
    }
}

//lager en ny token
function generateToken(){
  let length = 12
  let result = "";
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charlenght = char.length;
  let i = 0;

  while (i < length){
    result += char.charAt(Math.floor(Math.random()*charlenght));
    i += 1;
  }
  return result;
}

//lage lobbyId
function generateLobbyId(){
  let length = 4;
  let result = "";
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charlenght = char.length;
  let i = 0;

  while (i < length){
    result += char.charAt(Math.floor(Math.random()*charlenght));
    i += 1;
  }
  return result;
}

async function addUser(username, userpassword, res){ //legger til bruker
  //unngå at programmet kræsjer hvis verdiene ikke kan brukes
  if (typeof username == 'undefined'|| typeof userpassword == 'undefined'){
    res.send("input is undefined");
    return;
  }
  let db = await fetchData() //venter til data er hentet fra databasen

  //sjekker at brukernavnet ikke finnes i databasen:
  if (db.hasOwnProperty(username)){
    res.send("username already exists");
    return;
  }
  
  //unngå at noen spammer serveren full av tomme brukere
  if (countJSONLength(db) >= 20){
    res.send("brukere er foreløpig begresnet til 20, send melding på teams til Markus Stuevold Madsbakken");
    return;
  }

  res.send(appendDatabase(
    '"' + username + '": {"password": "' + userpassword + '"}'
  ));
}


//når brukeren starter serveren, lages det en eventlistener
app.get("/serverMessages/:token", async function(req, res){
  res.set({
    'Cache-Control': 'no-cache', 
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  })
  res.flushHeaders(res,req);


  //sjekker om brukeren har en token/er logget  inn
  let token = req.params["token"];
  if (!users.hasOwnProperty(token)){
    console.log("user without valid token");
    res.write(`data:{"message":"no_token","messageType":"err"}\n\n`); //sender error message
    return; //avslutter uten å lagre res
  }
  
  users[token]["res"] = res;
  if (users[token].hasOwnProperty("timeout")){
    console.log(token + " timed out, but reestablished connection")
    clearTimeout(users[token]["timeout"]) //clearer timeout
  }
  
  console.log("user listening to events: " + token); //dette slettes serverside
  req.on("close",function(){
    try { //funny try catch block i love him so much :)
    //venter 30000 ms og sletter bruker
    users[token]["timeout"] = setTimeout(() => {
      kickUser(token);
      deleteLobby(token);

      setTimeout(() =>{ //venter med å slette user, til deletelobby har slettet
        console.log("deleting: " + token)
        delete users[token];
      },"500")
    }, "5000")} catch {
    //hvis brukeren av en eller annen grunn ikke har token:
    res.write(`data:{"message":"no_token","messageType":"err"}\n\n`); //sender error message
    }
  })
})

//lage og slette lobby
function createLobby(token){ //lager lobby
  if (users[token].hasOwnProperty("lobbyId")){ //hvis brukeren allerede har ett game
    console.log("has lobby")
    return "err: has_game"
  }
  users[token]["lobbyId"] = generateLobbyId();
  console.log(users[token]["username"] + " has made a game with id " + users[token]["lobbyId"]);
  lobby[users[token]["lobbyId"]] = {"owner":users[token]["username"]} //lagrer lobby i listen
  lobby[users[token]["lobbyId"]]["users"] = {} //lagrer tom array til brukere
  return "id:" + users[token]["lobbyId"];
}

function deleteLobby(token){ //sletter lobby
  try {if (!users[token].hasOwnProperty("lobbyId")){ //hvis brukeren ikke har lobby
    console.log("no lobby")
    return "err: no_lobby"
  }}catch {
    //hvis brukeren ikke har token
    return "err: no_token"
  }
  console.log(users[token]["username"] + " has deleted a game with id " + users[token]["lobbyId"]);
  let deletedLobby = users[token]["lobbyId"];

  //sletter lobby
  delete lobby[users[token]["lobbyId"]]
  delete users[token]["lobbyId"];
  return "deleted: " + deletedLobby;
}

function kickUser(token){
  Object.values(lobby).forEach(game => {
    if (game.users.hasOwnProperty(token)){
      delete game["users"][token]
    }
  });
}

async function addUserToLobby(token, lobbyId){
  kickUser(token); //kicker slik at brukeren ikke er med i to games samtidig
  lobby[lobbyId]["users"][token] = users[token]["username"] //lagrer token og brukernavn i lobbyen
  console.log(lobby)
  return "auth" //returnerer
}

//vi lagrer token som slags id, vi trenger ikke resid.
//når man skal listene til event listener, trenger man id, og man blir "kicka" hvis man ikke har token.
//users[token][res].write(servermessage)


//hvis man bytter fane (kanskje også hvis man mister connection?)  skjer ikke "close" før serveren stopper å motta pings fra bruker, og tar dermed mye lengre tid


//dictionary med lobbyId og game class
//dette dictionariet lages når spillet starter, og slettes når spillet er ferdig
//funksjonen må også sjekke om et spill allerede finnes, og throw err

//logout bug er fikset på en jævla retard måte men det fungerer. Fiks det i fremtiden.

//hvis man logger inn, går tilbae til /login, kræsjer serveren. Kanskje logge ut evt bruker når get /login? Eller automatisk logge på med samme id?

//fjern sendingdata!!! Var kun brukt for å unngå at man sender duplicate data, men er en dust måte å gjøre det på

//make game hanger av og til? klarer ikke å finne ut av hvorfor

//hvis bruker logger men game er i progress, må man vente med å slette lobby til spillet er ferdig