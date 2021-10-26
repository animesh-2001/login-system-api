const express = require("express");
const app = express();
const router = require("./Routes/route");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const session = require("express-session");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.use(cors({
    origin:"*",
    methods:["GET","POST"],
    credentials:true
}))

app.use(cookieParser());
app.use(session({
    key:"userid",
    secret:process.env.SECRET_TOKEN,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:60 * 60 * 48,
    }
}))


app.use("/api",router);

// Set Port
app.set('port', (process.env.PORT || "7000"));
app.listen(app.get('port'), function() {
    console.log('Server started on port '+app.get('port'));
});
