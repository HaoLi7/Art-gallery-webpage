const pug = require("pug");
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session)
const sessionStore = new MongoDBStore({
    uri: 'mongodb://localhost:27017/project-HaoLi',
    collection: 'sessions'
    });

const func = require("./serverFunctions.js")

mongoose.connect('mongodb://127.0.0.1/project-HaoLi', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', startServer);

function startServer() {
    app.set("view engine", "pug");
    app.set("views", "./public/views");
    app.use(express.static("public"));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.use(session(
        { 
        secret: "artworks",
        resave: true,
        saveUninitialized: false,
        store: sessionStore 
        }));

    app.get("/", func.sendPages);
    app.get("/artists/followed",func.sendPages)
    app.get("/artworks/liked",func.sendPages);
    app.get("/artworks/search",func.sendPages);
    app.get("/notifications",func.sendPages);
    app.get("/artworks/add",func.sendPages);
    app.get("/workshops/add",func.sendPages);
    app.get("/artists/:id",func.showSingleArtist);
    app.get("/logout",func.logout);
    app.get("/artworks",func.showArtworks);
    app.get("/artworks/:id",func.showSingleArtwork);

    app.put("/switchType", func.switchType);
    app.put("/artists/unfollow",func.unfollow)
    app.put("/like",func.like);
    app.put("/unlike",func.unlike);
    app.put("/artworks",func.showArtworks);
    app.put("/artworks/search",func.searchArtworks);

    app.post("/login", func.login);
    app.post("/signup", func.signup);
    app.post("/artists/:id/follow",func.follow);
    app.post("/artworks/add",func.addArtwork);
    app.post("/workshops/add",func.addWorkshop);

    app.listen(3000);
    console.log("server running on port 3000");
}