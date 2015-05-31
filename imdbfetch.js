var http = require("http");
var cheerio = require("cheerio");

var movie = {};

if(process.argv[2]) {
    url = process.argv[2]; // Retrieve movie link from command line arguments.
}
else {
    console.error("No movie link provided");
    return;
}
//var url = process.argv[2]; 

var photos_postfix = "mediaindex"; // Link postfix for movie photos.

/* This functions modifies photos link for full size images.
    args: {
        link: Target IMDb photo link.
    }
*/
function link_modifier(link) {
	if(link) {
		return link.slice(0, link.indexOf("@")) + "@.jpg";    // Removes file postfix for the full size image.
	}
}

/* This function fetches data from the specified url.
    args: {
        url: Page url,
        callback: Callback function to pass fetched result
    }
*/
function fetch(url, callback) {
	http
		.get(url, function (res) {
			data = "";
			res.on("data", function (chunk) {
				data += chunk;  // Adds recieved chunk to previously loaded ones.
			});
			res.on("end", function () {
				callback(data); // Calls the specified callback function when all datas are fetched.
			});				
		})
		.on("error", function () { // In case of failure to load the page.
			callback(null);
		});
};

/* Calling our function to process the movie page. */
fetch(url, function (data) {
	if(data) { // If there is any data we proceed.
		var $ = cheerio.load(data);   // Initializing cheerio.
		movie.name = $("span.itemprop[itemprop='name']").html();    // Movie name.
		movie.year = $("h1.header span.nobr a").text(); // Movie release date.
		movie.rating = $("div.star-box.giga-star div.titlePageSprite.star-box-giga-star").text();   // Movie rating.
		movie.desc = $("p[itemprop='description']").text(); // Movie description.
        
		fetch(url + photos_postfix, function (photos) {   // Now we bring first page of photos of the movie
			if(photos) {
                movie.photos = [];
				var $_I = cheerio.load(photos); // Initializing cheerio for the photos page.
				var photos = $_I("div#main div#media_index_thumbnail_grid a img");
                /* Processing 5 first photos of the movie. */
				for(var i = 0; i < 5; i++) {
                    movie.photos.push({
                        photo_alt: $(photos[i]).attr("alt"),  // Photo description.
                        photo_link: link_modifier($(photos[i]).attr("src"))  // Photo full size link.
                    });
				}
                
                console.log(movie); // Print out the result.
			}
			else {
				console.error("Error occurred while loading photos page.");
			}
		});
	}
	else {
		console.error("No data available.");
	}
});
