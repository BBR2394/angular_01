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

async function getJokes(url) {
  try {
    const response = await axios.get(url);
    let theJoke = response.data.joke //| response.data.setup + response.data.delivery
    console.log(response.data.joke);
    if (response.data.joke == undefined) {
      console.log("C EST UNDEFINEIED")
      theJoke = response.data.setup + " " + response.data.delivery
    }
    console.log(response.data.setup, "  ", response.data.delivery)
    return theJoke
  } catch (error) {
    //console.error(error);
    return error
  }
}

async function getCatFacts(url) {
  try {
    const response = await axios.get(url);
    console.log(response.data.text);
    return response.data.text
  } catch (error) {
    //console.error(error);
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
    console.log(response.data);
    return { "lat": response.data["features"][0]["geometry"]["coordinates"][1], "lgn": response.data["features"][0]["geometry"]["coordinates"][0]}
  } catch (error) {
    //console.error(error);
    return error
  }
}

async function getBeer(url) {
  try {
    const response = await axios.get(url);
    console.log("la biere ! : ", response.data[0].name, " description : ", response.data[0].description);
    return {"name" : response.data[0].name, "description": response.data[0].description} 
    //return ["beer":{"name" : response.data[0].name, "description": response.data[0].description} ]
  } catch (error) {
    //console.error(error);
    return error
  }
}

async function getTacosRecipes(url) {
  try {
    const response = await axios.get(url);
    //console.log(response.data);
    return response.data["condiment"]["recipe"]
  } catch (error) {
    //console.error(error);
    return error
  }
}

/**
  * mon get
  * GET 
  * /hi 

  */
routes.get('/hi', (req, res) => {
  //res.render('index', { title: 'Express Babel' });
  const urlPunk = "https://api.punkapi.com/v2/beers/random";
  const urlCatFacts = "https://cat-fact.herokuapp.com/facts/random";
  const urlGouvGeo = "https://api-adresse.data.gouv.fr/search/"
  const urlJoke = "https://sv443.net/jokeapi/v2/joke/Programming"
  const urlTaco = "http://taco-randomizer.herokuapp.com/random/"
  let theJoke = ""
  let theCatsFacts = ""
  let theBeer = ""
  let final = "Resultat nous avons : \n"

  // axios.get(urlJoke, {
  //   params: {
  //     type: "Programming"
  //   }
  // })
  // .then(function (response) {
  //   //theJoke = response.data.joke
  //   console.log("-> reponse JOKE la blague est : ", response.data.joke);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // })
  // .then(function () {
  //   // always executed
  //   final += theJoke
  // });  

  // axios.get(urlCatFacts)
  // .then(function (response) {
  //   //theCatsFacts = response.data.text
  //   console.log("-> reponse Cat Facts la cats facts : ", response.data.text);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // })
  // .then(function () {
  //   // always executed
  //   final += theCatsFacts
  // });  
  
  // ca marche
  // axios.get(urlPunk)
  // .then(function (response) {
  //   console.log("-> reponse PUNK nome biere :", response.data[0].name, " description : ", response.data[0].description);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // })
  // .then(function () {
  //   // always executed
  // });  

  // axios.get(urlGouvGeo)
  // .then(function (response) {
  //   console.log("reponse ", response.data, " et la cats fcats", response.data.text);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // })
  // .then(function () {
  //   // always executed
  // });  

  // axios.get(urlTaco)
  // .then(function (response) {
  //   console.log("reponse TACO  et le taco : ", response.data.condiment.recipe);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // })
  // .then(function () {
  //   // always executed
  // });  

  const promiseJoke = getJokes(urlJoke);
  const promiseCatFactsOne = getCatFacts(urlCatFacts);
  const promiseCatFactsTwo = getCatFacts(urlCatFacts);
  const promiseCatFactsThree = getCatFacts(urlCatFacts);
  const promiseBeer = getBeer(urlPunk);
  const promiseGPS = getPosRizom(urlGouvGeo);
  const promiseTaco = getTacosRecipes(urlTaco) ;
  const finalRes = "--> et au foinal nous avons : \n" + theJoke + '\n' + theCatsFacts + '\n'
  console.log(finalRes)
  console.log(final)
  console.log("ET LA C4EST LA FIN")
  Promise.all([promiseJoke, promiseCatFactsOne, promiseCatFactsTwo, promiseCatFactsThree, promiseBeer, promiseGPS, promiseTaco]).then(function(values) {
    const finalAnswer = {"gps": values[5], "joke" : values[0], "catFact" : [values[1], values[2], values[3] ] , "beer": values[4], "taco" : values[6]}
    console.log("ICI LE promise : ", values);
    //const toSendAsResponse = { "gps": promiseGPS, "beer": promiseBeer}
    console.log(finalAnswer)
    //console.log("la reponse a envoyer : \n", toSendAsResponse)
    res.send(finalAnswer)
  });
  //const theJokes = getJokes(urlJoke);
  //const catsFacts = getCatFacts(urlCatFacts);
  //console.log("dans le get hi  : ", theJokes.data, "  cat facts ", catsFacts.data);
  //res.send("bonjour route hi")

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
