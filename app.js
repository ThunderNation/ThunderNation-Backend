const express= require('express');
const bodyParser=require('body-parser');
var cors = require('cors'); 
var _ = require('lodash');

//Firebase Stuff
var admin = require("firebase-admin");
var serviceAccount = require("./secret/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://thundernation-04.firebaseio.com"
});
// const firestore = new Firestore();
// const settings = {/* your settings... */ timestampsInSnapshots: true};
// firestore.settings(settings);
var db = admin.firestore();
//-----

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3000; 

app.get("/", (req, res) => {
    res.status(200).send("Hello World");
});

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});