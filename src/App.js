import React from "react";
import './App.css';
import Genres from './Genres';
import Platforms from './Platforms';
import Games from './Games'
import TopScroll from './TopScroll'

const gameAmount = 20;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  initialState = {
    chosenPlatforms: [],
    chosenGenres: [],
    offsets: [],
    games: [],
    scrolled: false,
    infoText: "Choose a genre",
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
    return () => {
      window.removeEventListener("scroll", this.handleScroll)
    }
  }

  handleScroll() {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

    if (bottom && !this.state.scrolled) {
      this.setState({
        scrolled: true,
      })
      this.getRandomGames(gameAmount, this.state.chosenGenres, this.state.chosenPlatforms, this.state.offsets, this.state.games);
    }
  }

  handlePlatformClick(chosenPlatforms) {
    this.setState({
      chosenPlatforms: chosenPlatforms,
      games: [],
    })
    this.getRandomGames(gameAmount, this.state.chosenGenres, chosenPlatforms, [], []);
  }

  handleGenreClick(id) {
    const chosenGenres = this.state.chosenGenres.slice();
    let genreIndex = -1;

    for (let i = 0; i < chosenGenres.length; i++) {
      const genreID = chosenGenres[i];
      if (genreID === id) {
        genreIndex = i;
        chosenGenres.splice(genreIndex, 1);
        break;
      }
    }

    if (genreIndex < 0) {
      chosenGenres.push(id);
    }

    this.setState({
      chosenGenres: chosenGenres,
      games: [],
      infoText: chosenGenres.length > 0 ? "Searching for games..." : "Choose a genre",
    })

    this.getRandomGames(gameAmount, chosenGenres, this.state.chosenPlatforms, [], []);
  }

  /**
   * Hakee satunnaisia pelejä
   * @param {*} gameAmount Haettavien pelien määrä
   * @param {*} genres haettavat genret(id)
   * @param {*} platforms haettavat platformit(id)
   * @param {*} offsets nykyiset offsetit
   * @param {*} games nykyiset pelit
   * @returns 
   */
  async getRandomGames(gameAmount, genres, platforms, offsets, games) {
    const offsetsCopy = Array.from(offsets);
    const gamesCopy = Array.from(games);
    if (genres.length < 1) {
      this.setState({
        chosenPlatforms: platforms,
        offsets: offsetsCopy,
        games: gamesCopy,
      });
      return;
    }

    let offsetMax = 0;
    let platformCondition = "";
    if (platforms.length > 0) {
      platformCondition = ` & platforms = (${platforms.join()}) `
    }
    await fetch('http://localhost:3001/https://api.igdb.com/v4/games/count', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Client-ID': process.env.REACT_APP_CLIENT_ID,
        Authorization: process.env.REACT_APP_AUTHORIZATION,
      },
      body: `where genres = [${genres.join()}]${platformCondition} & category = (0, 8, 9, 10) & cover > 0;`
    })
      .then((response) => response.json())
      .then((data) => offsetMax = data.count)
      .catch(err => {
        console.error(err)
      })

    let startIndex = offsetsCopy.length;
    getRandomOffsets(gameAmount, offsetsCopy, offsetMax);

    while (startIndex < offsetsCopy.length) {
      let multiBody = "";
      const newIndex = startIndex + 10;
      for (let i = startIndex; i < offsetsCopy.length && i < newIndex; i++) {
        const offset = offsetsCopy[i];
        multiBody = `${multiBody}query games "game${i}" {fields *, cover.url, release_dates.date,
          involved_companies.company.name, platforms.name, genres.name, platforms.name, videos.video_id,
          screenshots.url, websites.url; where genres = [${genres.join()}]${platformCondition} & category = (0, 8, 9, 10)
          & cover > 0 ; limit 1; offset ${offset};};`
      }
      if (multiBody !== "") {
        fetch('http://localhost:3001/https://api.igdb.com/v4/multiquery', {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept: 'application/json',
            'Client-ID': process.env.REACT_APP_CLIENT_ID,
            Authorization: process.env.REACT_APP_AUTHORIZATION,
          },
          body: multiBody
        })
          .then((response) => response.json())
          .then((data) => {
            for (const game of data) {
              gamesCopy.push(game.result[0]);
            }
            if (gamesCopy.length === offsetsCopy.length && this.state.chosenGenres.length > 0) {
              this.setState({
                chosenPlatforms: platforms,
                games: gamesCopy,
                offsets: offsetsCopy,
                scrolled: false,
              });
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
      startIndex = newIndex;
    }

    if (offsetsCopy.length < 1) {
      this.setState({
        chosenPlatforms: platforms,
        games: gamesCopy,
        offsets: offsetsCopy,
        infoText: "No games found",
      });
    }
  }

  render() {
    return (
      <div className="App">
        <TopScroll />
        <Platforms resetPage={() => this.setState(this.initialState)} onClick={(id) => this.handlePlatformClick(id)} />
        <Genres onClick={(id) => this.handleGenreClick(id)} />
        {this.state.games.length > 0 ?
          <Games games={this.state.games} />
          : <div className="Info-Text" >{this.state.infoText}</div>
        }
      </div>
    );
  }
}

/*
* Antaa taulukossa halutun määrän satunnaisia offset-arvoja
* @param {*} amount luotavien offsettien määrä
        * @param {*} currentOffsets jo haetut offsetit
        * @param {*} max offsetin yläraja
        * @returns Taulukko offsettejä
        */
function getRandomOffsets(amount, offsets, max) {
  if (amount > max) {
    for (let i = 0; i < max; i++) {
      if (isValueUnique(offsets, i)) offsets.push(i);
    }
    return offsets;
  }
  const maxOffsets = offsets.length + amount;

  const min = 0;
  for (let i = offsets.length; i < maxOffsets && i < max; i++) {
    let rand = getRandomInt(min, max);
    //jos ei ole uniikki, arvotaan uusi
    while (!isValueUnique(offsets, rand)) {
      rand = getRandomInt(min, max);
    }
    offsets.push(rand);
  }
  return offsets;
}

/**
* Antaa satunnaisen kokonaisluvun halutulta väliltä [min, max]
* @param {*} min
* @param {*} max
* @returns satunnainen kokonaisluku väliltä [min, max]
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
* Tarkistaa, onko arvo uniikki, ts. voiko sen lisätä taulukkoon
* @param {*} array Taulukko, johon halutaan lisätä
* @param {*} newValue Arvo, joka halutaan lisätä
* @returns True, jos arvo on uniikki, muuten false
*/
function isValueUnique(array, newValue) {
  let isUnique = true;
  for (const value of array) {
    isUnique = !(value === newValue);
    if (!isUnique) break;
  }

  return isUnique;
}

export default App;
