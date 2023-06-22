const http = require("http");

const express = require("express");
const flash = require("express-flash");
const session = require("express-session");
const bodyParser = require('body-parser');

const authRoutes = require("./routes/auth");

const PORT = 3003;
const app = express();

app.use(bodyParser.urlencoded({extended : false}));
// send details from frontend to backend
app.set("views", "views");
app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(authRoutes);

const server = http.createServer(app);
app.listen(PORT);
