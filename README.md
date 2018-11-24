Discogs Image Grabber is a tool that searches the Discogs database for a specific release and downloads the main image for that release. To make things easier and faster, the first image url from the first result is downloaded. Genres, image file names and release info are also downloaded to txt files for copying and pasting into a csv file. Requests to the Discogs API are made synchronously so they remain in order.

Index.js is a simple example of using the Google Sheets API - will eventually refactor to integrate directly with Google Sheets.
