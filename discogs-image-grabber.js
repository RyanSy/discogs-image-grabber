require('dotenv').config();
const request = require('request');
const download = require('image-downloader');

/*
to do:
set timeout to perform 60 requests per minute as per discogs rate limit
use array of product titles for search queries
*/

var searchQuery = 'Nas - Illmatic';
var searchQueryModified = searchQuery.replace(/\s/g, '+');

// get image url
var options = {
  url: 'https://api.discogs.com/database/search?q=' + searchQueryModified + '&per_page=1&token=' + process.env.ACCESS_TOKEN,
  headers: {
    'User-Agent': 'request'
  }
};
request(options, function(error, response, body) {
  console.log('error: ', error);
  console.log('status code: ', response.statusCode);
  var jsonBody = JSON.parse(body);
  console.log('body:\n ', jsonBody.results[0].cover_image);
  var imageUrl = jsonBody.results[0].cover_image;

  // download image
  var options2 = {
    url: imageUrl,
    dest: '../images/' + searchQuery + '.jpg',
    headers: {
      'User-Agent': 'request'
    }
  };
  download.image(options2)
    .then(({filename, image}) => {
      console.log('file saved to ', filename);
    })
    .catch((err) => {
      console.error(err);
    });
});
