'use strict';

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
const port = process.env.port || 8080; 

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

app.get("/getChartData", (req, res) => {

    var body = {
        'labels' : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        'datasets' : [
            {
                'label' : 'My First Dataset',
                'data' : [65, 59, 80, 81, 56, 55, 40]
            },
            {
                'label' : 'My Second Dataset',
                'data' : [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    }
    res.send(body);

});

app.get("/getChartData2", (req, res) => {

    var body = {
        'labels' : ['Fossil Fuels', 'Nuclear', 'Renewable', 'Other Sources'],
        'datasets': [
            {
                'label':'Fossil Fuels 2017',
                'data': [62.7]
            },
            {
                'label':'Nuclear 2017',
                'data': [20.0]
            },
            {
                'label':'Renewable 2017',
                'data': [17.1]
            },
            {
                'label':'Other Sources 2017',
                'data': [0.2]
            }
        ]
            
    }
    res.send(body);

});

app.get("/getChartData3", (req, res) => {

    var body = {
        'labels' : [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
        'dataset' : [{
            'label': 'Renewable Usage Since 2000',
            'data': [11.06, 10.80, 9.38, 7.70, 8.90, 9.15, 8.85, 8.82, 
                    9.49, 8.49, 9.25, 10.5, 10.36, 12.52, 12.22, 12.69, 13.19, 13.35, 14.94, 17.12]
        }]
    }
    res.send(body);

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

app.post("/newPost", (req, res) => {

    db.collection('forums').doc().get()
    .then((snapshot) => {    
        
        var createdAt = new Date();
        var forum = db.collection('forums').doc();
        var setForum = forum.set({
            'author': req.body.author,
            'title': req.body.title,
            'content': req.body.content,
            'lightbulbs': 0,
            'uniqueViews': 0,
            'createdAt': createdAt
        });
    
        res.status(200).send({"status": "Successfully Created the forum posts"});
        
    })
    .catch((err) => {
        res.status(400).send("Error");
        console.log('Error user does not exist.', err);
    });

});

app.get("/getAllForums", (req, res) => {

    db.collection('forums').get()
    .then((snapshot) => {
        var response = []
        snapshot.forEach((doc) => {
            // console.log(doc.id, '=>', doc.data());
            var body = {
                'forumId' : doc.id,
                'forumInfo' : doc.data()
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

app.get("/getForum", (req, res) => {

    db.collection('forums').doc(req.header('forumId')).get()
    .then((snapshot) => {   
        res.send(snapshot.data());
    })
    .catch((err) => {
        res.status(400).send("Error");
        console.log('Error getting documents', err);
    });

});

app.post("/addComment", (req, res) => {

    db.collection('users').doc(req.body.author).get()
    .then((snapshot) => {    
        
        var createdAt = new Date();
        var comment = db.collection('responses').doc(req.body.forumId).collection('comments').doc();
        var setComment = comment.set({
            'author': req.body.author,
            'comment': req.body.comment,
            'lightbulbs': 0,
            'createdAt': createdAt
        });
    
        res.status(200).send({"status": "Successfully added the comments"});
        
    })
    .catch((err) => {
        res.status(400).send("Error");
        console.log('Error user does not exist.', err);
    });

});

app.get("/viewComments", (req, res) => {

    db.collection('users').doc(req.header('userId')).get()
    .then((snapshot) => {    
        
        var createdAt = new Date();
        var comment = db.collection('responses').doc(req.header('forumId')).collection('comments').get()
        .then((snapshot) => {
            var response = []
            snapshot.forEach((doc) => {
                // console.log(doc.id, '=>', doc.data());
                var body = {
                    'commentId' : doc.id,
                    'commentInfo' : doc.data()
                }
                response.push(body)
            });
            res.send(response);
        })
        .catch((err) => {
            res.status(400).send("Error");
            console.log('Error getting documents', err);
        });
    })
    .catch((err) => {
        res.status(400).send("Error");
        console.log('Error user does not exist.', err);
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

module.exports = app;
