# IMDb Fetch
This is a simple script to extract info and photos of a IMDb movie using [cheerio](https://github.com/cheeriojs/cheerio).

## Usage
**Step 1: Install Dependencies**
<br/>First do an npm install.
```bash
# NPM
npm install    
```

**Step 2: Run**
<br/>Now you can give the movie link as a command line argument like this to extract the information.
```bash
node imdbfetch.js http://www.imdb.com/title/tt2562232/
```

**Step 3: Results**
<br/>
```
{ name: 'Birdman: Or (The Unexpected Virtue of Ignorance)',
  year: '2014',
  rating: ' 7.9 ',
  desc: '\nA washed-up actor, who once played an iconic superhero, battles his ego and attempts to recover his family, his career and himself in the days leading up to the opening of his Broadway play.',
  photos: 
   [ { photo_alt: 'Still of Michael Keaton in Birdman: Or (The Unexpected Virtue of Ignorance) (2014)',
       photo_link: 'http://ia.media-imdb.com/images/M/MV5BMzIwMDM4MDM5N15BMl5BanBnXkFtZTgwMDUwNTY4MjE@.jpg' },
     { photo_alt: 'Birdman: Or (The Unexpected Virtue of Ignorance) (2014)',
       photo_link: 'http://ia.media-imdb.com/images/M/MV5BOTkyMTk5ODIzOF5BMl5BanBnXkFtZTgwMzkxNTY4MjE@.jpg' },
     { photo_alt: 'Birdman: Or (The Unexpected Virtue of Ignorance) (2014)',
       photo_link: 'http://ia.media-imdb.com/images/M/MV5BMzA5MTc3MTc1NV5BMl5BanBnXkFtZTgwMzAyNTY4MjE@.jpg' },
     { photo_alt: 'Birdman: Or (The Unexpected Virtue of Ignorance) (2014)',
       photo_link: 'http://ia.media-imdb.com/images/M/MV5BMjM1MDMyNTkyN15BMl5BanBnXkFtZTgwNTMyNTY4MjE@.jpg' },
     { photo_alt: 'Still of Michael Keaton in Birdman: Or (The Unexpected Virtue of Ignorance) (2014)',
       photo_link: 'http://ia.media-imdb.com/images/M/MV5BMTkzMjY1NjUxMl5BMl5BanBnXkFtZTgwMTUyNTY4MjE@.jpg' } ] 
}
```