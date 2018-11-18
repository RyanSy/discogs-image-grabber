require('dotenv').config();
const request = require('sync-request');
const fs = require('fs');
const download = require('image-downloader');
const inventory = require('./inventory.js');

function getInfo(upc) {
    console.log('getInfo(' + upc + ') called');
    // get info from discogs
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
    if (jsonResponse.results === undefined || jsonResponse.results[0] === undefined) {
        console.log('error getting info\n');
        // write errors to _errors.txt
        fs.appendFileSync('_errors.txt', upc + '\n', (err) => {
            if (err) throw err;
        });
        // write blank space to _image-files.txt
        fs.appendFileSync('_image-files.txt', '\n', (err) => {
        if (err) throw err;
        });
        // write 'Imported from ShopKeep' to _categories.txt
        fs.appendFileSync('_categories.txt', 'Imported from ShopKeep\n', (err) => {
        if (err) throw err;
    });
        return;
    }
    let id = jsonResponse.results[0].id;
    let title = jsonResponse.results[0].title;
    let titleNoSpaces = (title.replace(/\s/g, '')).toLowerCase();
    let image = jsonResponse.results[0].cover_image;
    let label = jsonResponse.results[0].label;
    let catno = jsonResponse.results[0].catno;
    let year = jsonResponse.results[0].year;
    let genre = (jsonResponse.results[0].genre).replace(/,/g, ', ');
    let style = jsonResponse.results[0].style;

    // download image
    let options = {
            url: image,
            headers: {
                'User-Agent': 'DiscogsImageGrabber/1.0'
            },
            dest: 'data/images/' + titleNoSpaces + '.jpg'                  
        }
    async function downloadIMG() {
        try {
            const { filename, image } = await download.image(options);
            
        } catch (e) {
            console.error(e)
        }
    }
    downloadIMG()
    
    // write image names to _image-files.txt
    fs.appendFileSync('_image-files.txt', (titleNoSpaces + '.jpg\n'), (err) => {
        if (err) throw err;
    });
            
    // write genres to _genres.txt
    fs.appendFileSync('_categories.txt', ('Shop/Vinyl/' + genre + ',\n'), (err) => {
        if (err) throw err;
    });
    
    // write tracklist to file
    function getMasterInfo(id) {
        console.log('getMasterInfo(' + id + ') called');
        let res2 = request('GET', 'https://api.discogs.com/masters/' + id, {
            headers: {
            'user-agent': 'discogs-info-grabber'
            },
            qs: {
            'token': process.env.ACCESS_TOKEN
            }
        });
        let json2 = JSON.stringify(res2.body);
        let bufferOriginal2 = Buffer.from(JSON.parse(json2).data);
        let jsonResponse2 = JSON.parse(bufferOriginal2.toString('utf8'));
        if (jsonResponse2 === undefined) {
            console.log('error getting master info\n');
            return;
        }
        let tracklist = jsonResponse2.tracklist;
        // for (let track of tracklist) {
        //     fs.appendFileSync(title + '.txt', '<li>' + track.title + '</li>', (err) => {
        //       if (err) throw err;
        //       return;
        //     });
        // }
    }
    getMasterInfo(id);
    
    console.log('done\n');
} // end getInfo() function

for (let product of inventory) {
    getInfo(product);
}
