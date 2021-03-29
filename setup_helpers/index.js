// This is a file to seed the campgrounds database in Mysql instead of mongodb
require("dotenv").config();
const Campground = require("../models/Campground.js");
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelpers");
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

Campground.deleteAll()
  .then(([rows, metadata]) => {
    // add data back in
    for (let i = 0; i < 50; i++) {
      const price = parseFloat(
        `${Math.floor(Math.random() * 99 + 1)}.${Math.floor(
          Math.random() * 99 + 1
        )}`
      );
      const random1000 = Math.floor(Math.random() * 1000);
      const title = `${sample(descriptors)} ${sample(places)}`;
      const image = `https://source.unsplash.com/collection/483251`;
      const description = lorem.generateSentences(5);
      const location = `${cities[random1000].city}, ${cities[random1000].state}`;
      const camp = new Campground(
        null,
        title,
        image,
        price,
        description,
        location
      );
      camp.save();
    }
  })
  .catch((error) => {
    console.log(error);
  });
