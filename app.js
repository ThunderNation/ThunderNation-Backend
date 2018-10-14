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

app.post("/addUser", (req, res) => {

    var userId = req.body.username;
    var user = db.collection('users').doc(userId);

    var setUser = user.set({
        achievements: ["Joined the Community"],
        country: req.body.country,
        email: req.body.email,
        password: req.body.password,
        level: 1,
        points: 0,
        zipcode: req.body.zipcode,
        name: req.body.name
    });

    res.send("Successfully Created the user");

});

app.post("/login", (req, res) => {

    var userId = req.body.username;
    var password = req.body.password;

    db.collection('users').doc(userId).get()
    .then((snapshot) => {    
        
        if(password == snapshot.data().password){
            res.send({"status" : "Successful Login"});
        }else{
            res.status(401).send({"status" : "Error"});
        }
        
    })
    .catch((err) => {
        res.status(400).send("Error");
        console.log('Error getting documents', err);
    });
    
});

app.get("/profile", (req, res) => {

    var userId = req.header('username');
    db.collection('users').doc(userId).get()
    .then((snapshot) => {    
        
        res.send(snapshot.data());
    })
    .catch((err) => {
        res.status(400).send("Error");
        console.log('Error getting documents', err);
    });

});

app.get("/profile", (req, res) => {

    var userId = req.header('username');
    db.collection('users').doc(userId).get()
    .then((snapshot) => {    
        
        res.send(snapshot.data());
    })
    .catch((err) => {
        res.status(400).send("Error");
        console.log('Error getting documents', err);
    });

});

app.get("/getAllUsers", (req, res) => {

    db.collection('users').get()
    .then((snapshot) => {
        var response = []
        snapshot.forEach((doc) => {
            // console.log(doc.id, '=>', doc.data());
            var body = {
                'username' : doc.id,
                'profile' : _.pick(doc.data(), "name", "email", "country", "zipcode")
            }
            response.push(body)
        });
        res.send(response);
    })
    .catch((err) => {
        res.status(400).send("Error");
        console.log('Error getting documents', err);
    });

});

app.get("/test", (req, res) => {

    db.collection('users').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
            var x = doc.id
            var body = {
                x : doc.data()
            }
            res.send(body);
        });
    })
    .catch((err) => {
        res.status(400).send("Error");
        console.log('Error getting documents', err);
    });


});

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});