var keys = require('./key');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var args = process.argv;
var command = args[2];
var param = args[3];

function processInput(command, param) {
    switch (command) {
        case 'my-tweets':
            myTweets();
            break;

        case 'spotify-this-song':
            spotifyThisSong(param);
            break;

        case 'movie-this':
            movieThis(param);
            break;

        case 'do-what-it-says':
            doWhatItSays();
            break;

        default:
            logOutput('Entry not recognized');
            break;
    }
}

function myTweets() {

    var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });
    var params = { screen_name: 'mitch_wodka' };

    client.get('statuses/user_timeline', params, function(error, tweets) {
        if (error) {
            console.log(error);
            return;
        } else {
            for (i = 0; i < tweets.length; i++) {
                logOutput(i + 1 + ") " + tweets[i].text);
            }
        }
    });
}

function spotifyThisSong(str) {

    spotify.search({ type: 'track', query: str }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var firstResult = data.tracks.items[0];
        logOutput('Artist: ' + firstResult.artists[0].name);
        logOutput('Track: ' + firstResult.name);
        logOutput('Album: ' + firstResult.album.name);
        logOutput('Preview link: ' + firstResult.preview_url);
    });
}

function movieThis(movieName) {

    var queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&tomatoes=true&r=json';
    if (movieName != null) {
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // Year the movie came out.
                logOutput('Released: ' + JSON.parse(body)['Year']);
                // IMDB Rating of the movie.
                logOutput("Rating: " + JSON.parse(body)["imdbRating"]);
                // Country where the movie was produced.
                logOutput("Country: " + JSON.parse(body)["Country"]);
                // Language of the movie.
                logOutput("Language: " + JSON.parse(body)["Language"]);
                // Plot of the movie.
                logOutput("Plot: " + JSON.parse(body)["Plot"]);
                // Actors in the movie.
                logOutput("Actors: " + JSON.parse(body)["Actors"]);
                // Rotten Tomatoes Rating.
                logOutput("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
                // Rotten Tomatoes URL.
                logOutput("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
            }
        });
    } else {
        request('http://www.omdbapi.com/?t=mr nobody&y=&plot=short&tomatoes=true&r=json', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // Year the movie came out.
                logOutput('Released: ' + JSON.parse(body)['Year']);
                // IMDB Rating of the movie.
                logOutput("Rating: " + JSON.parse(body)["imdbRating"]);
                // Country where the movie was produced.
                logOutput("Country: " + JSON.parse(body)["Country"]);
                // Language of the movie.
                logOutput("Language: " + JSON.parse(body)["Language"]);
                // Plot of the movie.
                logOutput("Plot: " + JSON.parse(body)["Plot"]);
                // Actors in the movie.
                logOutput("Actors: " + JSON.parse(body)["Actors"]);
                // Rotten Tomatoes Rating.
                logOutput("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
                // Rotten Tomatoes URL.
                logOutput("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
            }
        });
    }
}

function doWhatItSays() {
	
    fs = require('fs')
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }

        var input = data.split(',');
        var command = input[0];
        var param = input[1];

        processInput(command, param);
    });
}

processInput(command, param);

function logOutput(str) {
    fs.appendFile('output.txt', str + '\n', function (err) {
        if (err) throw err;
        console.log(str);
    });
}