# Inarow

__For å teste med mer enn 5 brukere må man åpne en annen nettleser (f.eks firefox eller edge)__

## installasjon av Node.js
1. last ned og åpne Node.js fra https://nodejs.org/en/
2. kjør node -version i cmd (--version i terminal)
3. last ned Node.js exec vscode extension
4. åpne cmd og kjør npm install express --save, npm install multer --save og npm install sharp --save
4. kjør app.js ved å trykke f8, og avslutt med f9

</br>

### To do:
* ~~sende data fra spiller til server (bare oppdateringer)~~
* ~~server oppdaterer spillere på hvert move~~
* ~~oversette gamestring fra array til string og tilbake~~
* ~~separere brukere~~ og holde styr på hvem sin tur det er.
* sørge for at to brukere med samme id ikke kan eksistere
* ~~lage metode for å beholde navn serverid med localstorage (eller session)~~
* ~~unngå at samme bruker kan logge seg inn flere ganger samtidig~~
* oppdatere hvor mange spillere som er med, og hvor mange som venter på å bli med. Slags køsystem
* ~~backend server. node.js~~
* ~~chat, lett å lage etter vanlig gameupdate~~
* lage egene spillrom, hvor man kan endre innstillinger
* ~~innlogging og lagre passord i database~~
* endre fra sessionstorage til localstorage (debug)
* lagre board-klassen i lobby
* spar plass ved uglify og beautify (burde lagre originalfilene et sted) https://beautifier.io/ og https://skalman.github.io/UglifyJS-online/
* skrive om post til en enkel funskjon med path og message istedenfor å lage en million ulike?
* skrive om auth slik at man kan være på nettsiden uten å ha logget seg inn


Elo: 
* Ea = 1/(1+(10**((Rb-Ra)/400)))
    * R er rating
    * E er forventet utfall
* Ra = Ra+K(Sa - Ea)
    * R er rating
    * K er en kostant som kontrollerer hvor sensitiv ratingen blir
    * E er forventet utfall
    * Sa er det faktiske utfallet
