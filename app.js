const express= require('express');
const bodyParser=require('body-parser');
var cors = require('cors'); 

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3000; 

app.use("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});