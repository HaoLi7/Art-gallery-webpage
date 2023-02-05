const User = require("./userModel.js");
const Artwork = require("./artworkModel.js");
const Artist = require("./artistModel.js");
const Workshop = require("./workshopModel.js");
const Notification = require("./notificationModel.js");
const { ObjectId } = require("bson");

/*
* Handle most of simple jobs of sending page when recieve get requests
*/
function sendPages(req, res, next) {
    if (req.url === "/") {res.render("pages/home.pug",{session: req.session});}
    if (req.url === "/artworks/search") {res.render("pages/searchArtworks.pug",{session: req.session});}
    if (req.url === "/artworks/add") {res.render("pages/addArtwork.pug",{session: req.session});}
    if (req.url === "/workshops/add") {res.render("pages/addWorkshop.pug",{session: req.session});}
    if (req.url === "/artists/followed") {
        User.findOne({username:req.session.username}, function(err,uResult){
            if (err) throw err;
            let artistsArry = uResult.followedArtists;
            Artist.find({_id:artistsArry}, function(err,aResult) {
                if (err) throw err;
                res.render("pages/followedArtists.pug",{session: req.session, artists:aResult});
            });
        });
    }
    if (req.url === "/artworks/liked") {
        User.findOne({username:req.session.username}, function(err,uResult){
            if (err) throw err;
            let artworksArry = uResult.likedArtworks;
            Artwork.find({_id:artworksArry}, function(err,aResult) {
                if (err) throw err;
                res.render("pages/likedArtworks.pug",{session: req.session, artworks:aResult});
            });
        });
    }
    if (req.url === "/notifications") {
        User.findOne({username:req.session.username}, function(err,uResult){
            if (err) throw err;
            Notification.find({_id:uResult.notifications}, function(err,nResult) {
                if (err) throw err;
                res.render("pages/notifications.pug",{session: req.session, notifications:nResult});
            });
        });
    }
}

/*
* Authentication process, let user log in
*/
function login(req, res, next) {
    let username = req.body.username;
	let password = req.body.password;

    User.findOne({username:username}, function(err,result) {
        if (err) throw err;
        if(result != null) { 
            if(result.password === password) {
                req.session.loggedin = true;
                req.session.username = result.username;
                req.session.patron = true;
                res.status(201).send("Log in successfully.");
            }else {
                res.status(401).send("Invalid password or username.");
            }
        }else {
            res.status(401).send("Invalid password or username.");
        }
    });
}

function logout(req, res, next) {
    if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = undefined;
		res.status(200).send("Logged out.");
	} else {
		res.status(200).send("You cannot log out because you aren't logged in.");
	}   
}

function signup(req, res, next) {
    let username = req.body.username;
	let password = req.body.password;

    User.findOne({username:username}, function(err,result) {
        if(result != null) { 
            res.status(401).send("Username exsits.")
        }else {
            const newUser = new User({
                username: username,
                password: password,
                patron: true
            })
            newUser.save(function(err) {
                if (err) { console.log(err); }
            })
            res.status(201).send("Sign up successfully, now please log in");
        }
    });
}

/*
* Switch user account type, but firstly it makes sure that user at least adds one artwork before user
* wants to switch to artist account
*/
function switchType(req, res, next) {
    User.findOne({username:req.session.username}, function(err,result){
        if (err) throw err;
        if (req.session.patron === true && result.addedArtworks.length <= 0) {
            res.status(200).send("You have not added any artworks, please add one.");
        }else {
            req.session.patron = !req.session.patron;
            res.status(200).send("Switch account successfully.");
        }
    });
}

/*
* Seach artworks from database based on user's request
*/
function searchArtworks(req,res,next) {
    let query = req.body;
    let artworks= [];
    Artwork.find(query, function (err,result){
        for (let i = 0; i < result.length;i++) {
            artworks.push(result[i]);
        }
        res.json(artworks);
    });
}

/*
* Show all artworks when user send a GET request, show part of artworks when user
* selects options and clicks the filter button and send a PUT request
*/
function showArtworks(req,res,next) {
    if (req.method === "GET") {
        Artwork.find({}, function(err,result) {
            if (err) throw err;
            let medium = [];
            let category = [];
            for (each of result) {
                if (!medium.includes(each.medium)) {
                    medium.push(each.medium);
                }
                if (!category.includes(each.category)) {
                    category.push(each.category);
                }
            }
            let options = {medium:medium, category:category}
            res.render("pages/artworks.pug",{session: req.session, artworks:result, options:options})
        });
    }else if (req.method === "PUT") {
        Artwork.find(req.body, function(err,result) {
            if (err) throw err;
            res.status(200).json(result);
        });
    }
}

/*
* When user click a single one artwork's link, this function will find it in database and send the page to client side
*/
function showSingleArtwork(req,res,next) {
    Artwork.findOne({_id:ObjectId(req.params.id)}, function(err,aResult) {
        if (err) throw err;
        Artist.findOne({name:aResult.artist}, function(err,bResult) {
            if (err) throw err;
            res.render("pages/singleArtwork.pug",{session: req.session, artwork:aResult, artistId:bResult._id})
        })
    });
}

/*
* Increment the like number of specific artwork document and add it into user's liked artworks array in user document
*/
function like(req,res,next) {
    Artwork.findOne({_id:ObjectId(req.body.id)}, function(err,aResult){
        if (err) throw err;
        User.findOne({username:req.session.username}, function(err,uResult) {
            if (err) throw err;
            if (uResult.addedArtworks.includes(aResult._id)) {
                res.status(400).send("You are not allowed to like the artwork you added");
            }else if (!uResult.likedArtworks.includes(aResult._id)) {
                uResult.likedArtworks.push(aResult._id);
                uResult.save();
                aResult.likeNum++;
                aResult.save();
                res.status(200).send("Liked");
            }
        });
    });
}

/*
* Remove the like from this artwork and update the artwork document
*/
function unlike(req,res,next) {
    Artwork.findOne({_id:ObjectId(req.body.id)}, function(err,aResult){
        if (err) throw err;
        if (aResult.likeNum > 0) {aResult.likeNum--;}
        aResult.save();
        User.findOne({username:req.session.username}, function(err,uResult) {
            if (err) throw err;
            if (uResult.likedArtworks.includes(aResult._id)) {
                uResult.likedArtworks.remove(aResult._id);
                uResult.save()
                res.status(200).send("Unliked");
            }
        });
    });
}

/*
* Find the artist and workshops belong to the artist in database, and send back render page
*/
function showSingleArtist(req,res,next) {
    Artist.findOne({_id:ObjectId(req.params.id)}, function(err,aresult){
        if (err) throw err;
        Workshop.find({host:aresult.name}, function(err,bresult) {
            if (err) throw err;
            res.render("pages/artist.pug",{session: req.session, artist:aresult,workshops:bresult});
        });
    });
}

/*
* Find who is the artist that user follow and add its notifications to user's documents
*/
function follow(req,res,next) {
    Artist.findOne({_id:ObjectId(req.params.id)}, function(err,aresult){
        if (err) throw err;
        User.findOne({username:req.session.username}, function(err,bresult) {
            if (err) throw err;
            if (!bresult.followedArtists.includes(aresult._id)) {
                bresult.followedArtists.push(aresult._id);
                Notification.find({fromId:aresult._id},function(err,cresult) {
                    if (err) throw err;
                    for(let each of cresult) {
                        bresult.notifications.push(each._id)
                    }
                    bresult.save();
                });
                res.status(201).send("Follow successfully");
            }
        });
    });
}

/*
* Reverse process of follow
*/
function unfollow(req,res,next) {
    Artist.findOne({_id:req.body.id}, function(err,aresult){
        if (err) throw err;
        User.findOne({username:req.session.username}, function(err,bresult) {
            if (err) throw err;
            if (bresult.followedArtists.includes(aresult._id)) {
                bresult.followedArtists.remove(aresult._id);
                Notification.find({fromId:aresult._id},function(err,cresult) {
                    if (err) throw err;
                    for(let each of cresult) {
                        bresult.notifications.remove(each._id)
                    }
                    bresult.save();
                });
                res.status(200).send("Unfollow successfully");
            }
        });
    });
}

/*
* Find if added artwork exsits in the database, if not, add it, then update artist document, create new notifications
* add this artwork to user's document, keep every thing related to new artwork to be up to date
*/
function addArtwork(req,res,next) {
    Artwork.findOne({name:req.body.name},function(err,result) {
        if (err) throw err;
        if (result === null) {
            Artwork.create(req.body, function(err, newDoc) {
                if (err) throw err;
                artistUpdate(req.body.artist, req.body.name, newDoc._id);
                User.findOne({username:req.session.username}, function(err,result) {
                    if (err) throw err;
                    result.addedArtworks.push(newDoc._id);
                    result.save();
                });
            });
            res.status(201).send("Add successfully");
        }else {
            res.status(400).send("Artwork already exists");
        }
    });
}

/*
* Update artist document, and create new notifications, if this artist is not in the database, create a new document
*/
function artistUpdate(artist, artworkName, _id) {
    Artist.findOne({name:artist}, function(err,result) {
        if (err) throw err;
        if (result === null) {
            Artist.create({name:artist,artworks:[{artworkName:artworkName,id:ObjectId(_id)}]},function(err,newDoc){
                if (err) throw err;
                notificationUpdate(artist, artworkName, newDoc._id);
            });
        }else {
            result.artworks.push({artworkName:artworkName,id:ObjectId(_id)});
            result.save();
            notificationUpdate(artist, artworkName, result._id)
        }
    })
    
}

/*
* Create new notifications, and add it to array in document
*/
function notificationUpdate(artist, artworkName, _id) {
    Notification.findOne({fromId:ObjectId(_id)}, function(err,result) {
        if (err) throw err;
        if (result === null) {
            Notification.create({from:artist,fromId:ObjectId(_id),content:[`${artist} has a new artwork: ${artworkName}`]})
        }else {
            result.content.push(`${artist} has a new artwork: ${artworkName}`);
            result.save();
        }
    })
}

/*
* Add workshop based on the artist name of user's first added artwork
*/
function addWorkshop(req,res,next) {
    User.findOne({username:req.session.username}, function(err,aresult){
        if (err) throw err;
        Artwork.findOne({_id:aresult.addedArtworks[0]},function(err,bresult){
            if (err) throw err;
            let newDoc = req.body;
            newDoc.host = bresult.artist;
            Workshop.create(newDoc);
            res.status(201).send("Add successfully");
        });
    });
}

module.exports = {
    sendPages, login, logout, signup, switchType, unfollow, searchArtworks, showArtworks, showSingleArtwork, 
    like, unlike, showSingleArtist, follow, unfollow, addArtwork, addWorkshop
};