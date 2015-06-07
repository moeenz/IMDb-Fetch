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
        movie.date = $($("meta[itemprop='datePublished']")[0]).attr("content"); // Movie release date.
        movie.contentrating = $($("meta[itemprop='contentRating']")[0]).attr("content");
		movie.rating = $("div.star-box.giga-star div.titlePageSprite.star-box-giga-star").text().trim();   // Movie rating.
		movie.description = $("p[itemprop='description']").text(); // Movie description.
        movie.genre = "" + $($("span[itemprop='genre']")[0]).text() + ", " + $($("span[itemprop='genre']")[1]).text();
        movie.poster = $($("img[itemprop='image']")[0]).attr("src");

        movie.roles = [];
        movie.roles.push({
            name: $($("div[itemprop='director'] a span")[0]).text(),
            role: "director"
        });
        movie.roles.push({
            name: $($("div[itemprop='creator'] a span")[0]).html(),
            role: "writer"
        });


        var cast_list = $("div#titleCast table tr");

        for (var j = 1; j < 8; j++) {
            name = $(cast_list[j]).find("td span.itemprop[itemprop='name']").text();

            cast_role = $(cast_list[j]).find("td.character div a");
            role = "" + $(cast_role[0]).text() + ($(cast_role[1]).length > 0 ? " / " + $(cast_role[1]).text() : "");

            movie.roles.push({
                role: role,
                name: name
            });
        }

        fetch(url + photos_postfix, function (photos) {   // Now we bring first page of photos of the movie
			if(photos) {
                movie.photos = [];
				var $_I = cheerio.load(photos); // Initializing cheerio for the photos page.
				var photos = $_I("div#main div#media_index_thumbnail_grid a img");
                // Processing 5 first photos of the movie.
				for(var i = 0; i < 5; i++) {
                    movie.photos.push({
                        photo_alt: $(photos[i]).attr("alt"),  // Photo description.
                        photo_thumb: $(photos[i]).attr("src"), // Photo thumbnail.
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
