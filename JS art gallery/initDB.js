const fs = require("fs");
const mongoose = require("mongoose");
const Artwork = require("./artworkModel.js");
const User = require("./userModel.js");
const Artist = require("./artistModel.js");
const Workshop = require("./workshopModel.js");
const Notification = require("./notificationModel.js");

let aws = [];

const loadData = async () => {
  fs.readFile("./gallery.json", function(err, data) {
    if(err){
        console.log("Read .json file error")
        return;
    }
    aws = JSON.parse(data);
  });

  await mongoose.connect('mongodb://localhost:27017/project-HaoLi');
  await mongoose.connection.dropDatabase();
	let awsDB = aws.map( aw => new Artwork(aw));
	await Artwork.create(awsDB);

  let names = [];
  for (let i of aws) {
    names.push(i.artist);
    await Workshop.create({host:i.artist});
  }

  let ar = []
  for (let j = 0;j < names.length;j++) {
    await Artwork.findOne({artist:names[j]}, async function (err,aresult) {
      await Workshop.findOne({host:names[j]},async function (err,bresult) {
        let artist = {name:aresult.artist, artworks:[{artworkName:aresult.name,id:aresult._id}],workshops:[bresult._id]}
        ar.push(artist)
      }).clone();
    }).clone();
  }
  let arDB = ar.map( a => new Artist(a));
	await Artist.create(arDB);
  await Artist.find({},async function(err,aresult){
    for (let each of aresult) {
      Notification.create({from:each.name,fromId:each._id});
    }
  }).clone();
  
}

loadData()
  .then((result) => {
	console.log("Closing database connection.");
    mongoose.connection.close();
  })
  .catch(err => console.log(err));