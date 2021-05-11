// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')
const { Console } = require('console')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  //console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  //console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  // Create variables to store the user entered year and genre in memory
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre


  //checks to see if the user did not enter a year or a genre. Returns an error if true
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Error! Be sure to enter a year and genre` // a string of data
    }
  }

  //User has entered a year and genre. Return an object with the number of results and the movie title, year released, and genre
  else {
    //creates an object to hold the number of results and movie array
    let returnValue = {
      numResults: 0,
      movies: []
    }

    //loop throught the csv to pull the movies that meet the year and genre requirements
    for (let i=0; i < moviesFromCsv.length; i++) {
      
      //Store the current movie to memory
      let currentMovie = moviesFromCsv[i]
      
      //check to see if the current movie contains the user entered year and genre. Converts genre to lower case to account for potential variation in user entered genre
      if (currentMovie.genres.toLowerCase().includes(genre.toLowerCase()) && currentMovie.startYear.includes(year)){
        
        //Checks to see if the movie has a runtime
        if(currentMovie.runtimeMinutes != `\\N`){
          //Movie has the required genre, release year, and has a runtime. It meets all criteria to be added to the returnValue object
          
          //increse numResults by 1
          returnValue.numResults = returnValue.numResults + 1

          //Create an object to contain the movie title, release year and genres
          let movieObject = {
            title: currentMovie.primaryTitle,
            releaseYear: currentMovie.startYear,
            genres: currentMovie.genres
          }

          //push the movie object to the movies array in the return value object
          returnValue.movies.push(movieObject)
        }
      }
      
    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}