import { Router } from 'express';
import { AxiosInstance } from "axios";

const routes = Router();
const axios = require('axios');
/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Express Babel' });

});

/* et une fonction par api */
async function getJokes(url) {
  try {
    const response = await axios.get(url);
    let theJoke = response.data.joke
    if (response.data.joke == undefined) {
      theJoke = response.data.setup + " " + response.data.delivery
    }
    return theJoke
  } catch (error) {
    return error
  }
}

async function getCatFacts(url) {
  try {
    const response = await axios.get(url);
    return response.data.text
  } catch (error) {
    return error
  }
}

async function getPosRizom(url) {
  try {
    const response = await axios.get(url, {
      params:{
        q: "41+rue+du+port+Lille"
      }
    });
    return { "lat": response.data["features"][0]["geometry"]["coordinates"][1], "lgn": response.data["features"][0]["geometry"]["coordinates"][0]}
  } catch (error) {
    return error
  }
}

async function getBeer(url) {
  try {
    const response = await axios.get(url);
    return {"name" : response.data[0].name, "description": response.data[0].description} 
  } catch (error) {
    return error
  }
}

async function getTacosRecipes(url) {
  try {
    const response = await axios.get(url);
    return response.data["condiment"]["recipe"]
  } catch (error) {
    return error
  }
}

/**
  * mon get
  * GET 
  * /hi 

  */
routes.get('/hi', (req, res) => {
  /*une variable par url et donc par api */
  const urlPunk = "https://api.punkapi.com/v2/beers/random";
  const urlCatFacts = "https://cat-fact.herokuapp.com/facts/random";
  const urlGouvGeo = "https://api-adresse.data.gouv.fr/search/"
  const urlJoke = "https://sv443.net/jokeapi/v2/joke/Programming"
  const urlTaco = "http://taco-randomizer.herokuapp.com/random/"

  /*une promise par requete  */
  const promiseJoke = getJokes(urlJoke);
  const promiseCatFactsOne = getCatFacts(urlCatFacts);
  const promiseCatFactsTwo = getCatFacts(urlCatFacts);
  const promiseCatFactsThree = getCatFacts(urlCatFacts);
  const promiseBeer = getBeer(urlPunk);
  const promiseGPS = getPosRizom(urlGouvGeo);
  const promiseTaco = getTacosRecipes(urlTaco) ;

  Promise.all([promiseJoke, promiseCatFactsOne, promiseCatFactsTwo, promiseCatFactsThree, promiseBeer, promiseGPS, promiseTaco]).then(function(values) {
    const finalAnswer = {"gps": values[5], "joke" : values[0], "catFact" : [values[1], values[2], values[3] ] , "beer": values[4], "taco" : values[6]}
    res.send(finalAnswer)
  });
});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

export default routes;
