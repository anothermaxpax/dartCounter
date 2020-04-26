var express = require('express');
var app = express();
var multer  = require('multer')
var upload = multer({dest: 'uploades/'})
app.use(express.static('public'));
app.use(express.json());

app.get("/", function (req, res, next) {
    res.redirect("/main.html");
})
app.post("/api/result", function (req, res) {
    if (req.body != null && saveResults(req.body)) {
        res.status(201).send(req.body);
    } else {
        res.status(400).send("Bad Request");
    }

})

app.post("/api/register", upload.single('avatar') ,(req, res) => {
    if (req.body != null && registerUser(req)) {
        res.status(201).send(req.body);
    } else {
        res.status(400).send("Bad Request");
    }
});

var server = app.listen(8080, function () {
    console.log("Example app listening at port %s", server.address().port)
})

function saveResults(data) {
    console.log(data);
    return true;
}

function registerUser(req) {
    return true;
}