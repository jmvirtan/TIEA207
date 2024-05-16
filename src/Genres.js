import React, { useEffect, useState } from 'react';
import './App.css';


function Genre(props) {
  const [isChosen, setIsChosen] = useState(false);
  return (
    <div
      className={isChosen ? "Genre-selected" : "Genre"}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(229, 229, 229, 0.6), rgba(64, 64, 64, 0.8)),url(${props.url})`
      }}
      onClick={() => {
        setIsChosen(current => !current);
        props.onClick();
      }}
    >
      <p>
        {props.name}
      </p>
    </div>
  );
}

function Genres(props) {
  const [genres, setGenres] = useState([]);
  const [covers, setCovers] = useState([]);

  useEffect(() => {
    async function getRandomCovers(genres) {
      let offset = 0;
      let offsetMax = 0;
      const coverAmount = 5 * genres.length;

      await fetch("http://localhost:3001/https://api.igdb.com/v4/covers/count", {

        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.REACT_APP_CLIENT_ID,
          Authorization: process.env.REACT_APP_AUTHORIZATION,
        },
        body: "where url != null;"
      })
        .then((response) => response.json())
        .then((data) => {
          offsetMax = data.count - (coverAmount);
          offset = Math.floor(Math.random() * offsetMax);
        })
        .catch((err) => console.log(err));


      fetch("http://localhost:3001/https://api.igdb.com/v4/covers", {

        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.REACT_APP_CLIENT_ID,
          Authorization: process.env.REACT_APP_AUTHORIZATION,
        },
        body: `fields url; where url != null; limit ${coverAmount}; offset ${offset};`
      })
        .then((response) => response.json())
        .then((data) => setCovers(data))
        .catch((err) => console.log(err));


    }
    async function queryGenres() {
      await fetch("http://localhost:3001/https://api.igdb.com/v4/genres", {

        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Client-ID': process.env.REACT_APP_CLIENT_ID,
          Authorization: process.env.REACT_APP_AUTHORIZATION,
        },
        body: "fields id, name; limit 500;"
      })
        .then((response) => response.json())
        .then((data) => {
          getRandomCovers(data);
          setGenres(data);
        })
        .catch((err) => console.log(err));


    }
    queryGenres();
  }, []);

  return (
    <div className="Genres-wrapper">
      {genres.map((genre, i) => {
        const genreID = genre.id;
        const coverIndex = 5 * i;
        return <Genre
          key={genreID}
          name={genre.name}
          url={covers[coverIndex] ? covers[coverIndex].url.replace("t_thumb", "t_720p") : null}
          onClick={() => props.onClick(genreID)}
        />;
      })}
    </div>
  )
}

export default Genres;
