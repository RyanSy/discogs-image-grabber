require('dotenv').config();
var axios = require('axios');
var fs = require('fs');

var queryArray = ["Delicate Steve ‎- Positive Force", "Kevin Devine & The Goddamn Band - Bubblegum", "Fucked Up - Couple Tracks", "Amy (The Original Soundtrack)", "Jansch", "Bert - Birthday Blues", "Tricky - Knowle West Boy", "Minutemen - What Makes A Man Start Fires?", "The Monochrome Set - Strange Boutique", "Ted Nugent - Cat Scratch Fever", "Listen", "Whitey! The Sounds of Black Power 1967-1974", "Loma - A Soul Music Love Affair", "Volume Two: Get In The Groove 1965-68", "Loma - A Soul Music Love Affair", "Volume Three: Sad", "Sad Feeling 1964-68", "Elton John - Goodbye Yellow Brick Road (used NM)", "Shylmagoghnar- Transience", "(Smog) - Rain On Lens", "2Pac - 2Pacalypse Now", "13th Floor Elevators - Bull Of The Woods", "13th Floor Elevators - Easter Everywhere", "10cc - Deceptive Bends (NM)", "50 Cent - Best Of", "(Les Nouveaux) Jaguards - Pour Le Danse (NM)", "10cc - Look Hear? (NM)", "2Pac - All Eyez On Me", "311 - From Chaos", "6Lack - Free 6Lack"];

var query;
var imageUrl;
var genre;

// add setTimeout
// make this async
queryArray.forEach(function(query) {
  query = query;
  var queryModified = encodeURI(query.replace(/\s/g, '+'));
  console.log(queryModified);
  axios({
    method: 'get',
    url: 'https://api.discogs.com/database/search?q=' + queryModified + '&per_page=1&token=' + process.env.ACCESS_TOKEN,
    headers: {
      'User-Agent': 'image-grabber'
    }
  })
    // this should await initial get request
    .then(function(response) {
      imageUrl = response.data.results[0].cover_image;
      genre = response.data.results[0].genre[0];
      console.log('\n');
      console.log(query);
      console.log('imageUrl: ', imageUrl);
      console.log('genre: ', genre);
      axios({
        method: 'get',
        url: imageUrl,
        responseType: 'stream'
      })
        .then(function(response) {
          // if response is null, copy query to a seperate csv file
          response.data.pipe(fs.createWriteStream('../images/' + query + '.jpg'));
          return;
        })
        .catch(function(error) {
          console.log(error);
        })
    })
    .catch(function(error) {
      console.log(error);
    });
});
