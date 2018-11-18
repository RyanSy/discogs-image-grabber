require('dotenv').config();
const request = require('sync-request');
const fs = require('fs');

function getInfo(upc) {
    let res = request('GET', 'https://api.discogs.com/database/search', {
        headers: {
        'user-agent': 'DiscogsImageGrabber/1.0'
        },
        qs: {
        'q': upc,
        'per_page': 1,
        'format': 'Vinyl',
        'token': process.env.ACCESS_TOKEN
        }
    });
    let json = JSON.stringify(res.body);
    let bufferOriginal = Buffer.from(JSON.parse(json).data);
    let jsonResponse = JSON.parse(bufferOriginal.toString('utf8'));
    let id = jsonResponse.results[0].id;
    let title = jsonResponse.results[0].title;
    let titleNoSpaces = (title.replace(/\s/g, '')).toLowerCase();
    let image = jsonResponse.results[0].cover_image;
    let format = (jsonResponse.results[0].format).toString().replace(/,/g, ', ');
    let label = (jsonResponse.results[0].label).toString().replace(/,/g, ', ');
    let catno = jsonResponse.results[0].catno;
    let year = jsonResponse.results[0].year;
    let genre = (jsonResponse.results[0].genre).toString().replace(/,/g, ', ');
    let style = (jsonResponse.results[0].style).toString().replace(/,/g, ', ');
    // fs.appendFileSync(jsonResponse.results[0].title);
    
    
    // write product descriptions to _descriptions.txt
    fs.appendFileSync('_descriptions.txt', '<ul><li>Format: ' + format + '</li><li>Label: ' + label + '</li><li>Catalog Number: ' + catno + '</li><li>Year: ' + year + '</li><li>Genre: ' + genre + '</li><li>Style: ' + style + '</li></ul>')
    
    // write categories to _categories.txt
    // if (genre.length === 1) {
    //     fs.appendFileSync('testAPI.txt', 'Shop/Vinyl/' + jsonResponse.results[0].genre[0] + '\n', (err) => {
    //         if (err) throw err;
    //     });
    // } else if  (genre.length > 1) {
    //     for (var i = 0; i < (genre.length - 1); i++) {
    //         fs.appendFileSync('testAPI.txt', 'Shop/Vinyl/' + jsonResponse.results[0].genre[i] + ';', (err) => {
    //             if (err) throw err;
    //         });    
    //     }
    //     var j = genre.length - 1;
    //     fs.appendFileSync('testAPI.txt', 'Shop/Vinyl/' + jsonResponse.results[0].genre[j]);
    // } 
    fs.appendFileSync('testAPI.txt', format, (err) => {
        if (err) throw err;
    });
    
    // fs.appendFileSync(jsonResponse.results[0].label);
    // fs.appendFileSync(jsonResponse.results[0].catno);
    // fs.appendFileSync(jsonResponse.results[0].year);
    // fs.appendFileSync(jsonResponse.results[0].genre);
    // fs.appendFileSync(jsonResponse.results[0].style);
    
}

getInfo(680899008112);

