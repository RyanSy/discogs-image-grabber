require('dotenv').config();
const request = require('sync-request');
const fs = require('fs');
const download = require('image-downloader');
const inventory = require('./inventory.js');

function getInfo(release) {
  console.log('getInfo(' + release + ') called');
  // get info from discogs
  let releaseModified = encodeURI(release.replace(/\s/g, '+'));
  let releaseFormatted = release.replace(/[^a-zA-Z0-9]/g, '');
  let releaseNoSpaces = releaseFormatted.replace(/\s/g, '').toLowerCase();
  let res = request('GET', 'https://api.discogs.com/database/search', {
    headers: {
      'user-agent': 'DiscogsImageGrabber/1.0'
    },
    qs: {
      'q': releaseModified,
      'per_page': 1,
      'format': 'Vinyl',
      'token': process.env.ACCESS_TOKEN
    }
  });
  let json = JSON.stringify(res.body);
  let bufferOriginal = Buffer.from(JSON.parse(json).data);
  let jsonResponse = JSON.parse(bufferOriginal.toString('utf8'));
  if (jsonResponse.results === undefined || jsonResponse.results[0] === undefined) {
    console.log('error getting info\n');
    // write errors to _errors.txt
    fs.appendFileSync('_errors.txt', release + '\n', (err) => {
      if (err) throw err;
    });
    // write blank space to _descriptions.txt
    fs.appendFileSync('_descriptions.txt', '\n', (err) => {
      if (err) throw err;
    });
    // write 'Imported from ShopKeep' to _categories.txt
    fs.appendFileSync('_categories.txt', 'Imported from ShopKeep\n', (err) => {
      if (err) throw err;
    });
    // write blank space to _image-files.txt
    fs.appendFileSync('_image-files.txt', '\n', (err) => {
      if (err) throw err;
    });
    return;
  }
  let releaseUrl = jsonResponse.results[0].resource_url;
  let title = jsonResponse.results[0].title;
  let imageName = (title.replace(/[^a-zA-Z0-9]/g, '')).toLowerCase();
  let image = jsonResponse.results[0].cover_image;
  let format = (jsonResponse.results[0].format).toString().replace(/,/g, ', ');
  let label = (jsonResponse.results[0].label).toString().replace(/,/g, ', ');
  let catno = jsonResponse.results[0].catno;
  let year = jsonResponse.results[0].year;
  let genreArray = jsonResponse.results[0].genre;
  let genre = (jsonResponse.results[0].genre).toString().replace(/,/g, ', ');
  let style = (jsonResponse.results[0].style).toString().replace(/,/g, ', ');

  // write product descriptions to _descriptions.txt
  fs.appendFileSync('_descriptions.txt', '<ul><li>Format: ' + format + '</li><li>Label: ' + label + '</li><li>Catalog Number: ' + catno + '</li><li>Year: ' + year + '</li><li>Genre: ' + genre + '</li><li>Style: ' + style + '</li></ul>\n');

  // write genres to _categories.txt
  if (genreArray.length === 1) {
      fs.appendFileSync('_categories.txt', 'Shop/Vinyl/' + genreArray[0] + '\n', (err) => {
          if (err) throw err;
      });
  } else {
      for (var i = 0; i < (genreArray.length - 1); i++) {
          fs.appendFileSync('_categories.txt', 'Shop/Vinyl/' + genreArray[i] + ';', (err) => {
              if (err) throw err;
          });
      }
      var j = genreArray.length - 1;
      fs.appendFileSync('_categories.txt', 'Shop/Vinyl/' + genreArray[j] + '\n');
  }

  // write image names to _image-files.txt
  fs.appendFileSync('_image-files.txt', (releaseNoSpaces + '.jpg\n'), (err) => {
    if (err) throw err;
  });

  // download image
  let options = {
    url: image,
    headers: {
      'User-Agent': 'Dig/1.0'
    },
    dest: 'images/' + releaseNoSpaces + '.jpg'
  };
  async function downloadIMG() {
    try {
      const {
        filename,
        image
      } = await download.image(options);

    } catch (e) {
      console.error(e);
    }
  }
  downloadIMG();

  console.log('done\n');
} // end getInfo() function

for (let product of inventory) {
  getInfo(product);
}
