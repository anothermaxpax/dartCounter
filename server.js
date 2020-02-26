var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(express.json());
app.get("/", function (req, res, next) {
    res.redirect("/main.html");
})
app.post("/api/result", function (req, res) {
    if(req.body != null && saveResults(req.body)){
        res.status(201).send(req.body);
    } else {
        res.status(400).send("Bad Request");
    }
    
})

app.post("/api/register", function(req,res){
    console.log(req.body);
    console.log(req.body.name);
    res.status(201).send(JSON.stringify({"status": "successfull"}))
})

var server = app.listen(80, function () {
    console.log("Example app listening at port %s",  server.address().port)
})

function saveResults(data){
    console.log(data);
    return true;
}