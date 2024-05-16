import React, { useRef, useState } from 'react';
import './App.css';
import Gameinfo from './Gameinfo';


function Game(props) {
  return (
    <li className="Gallery-image" onClick={props.onClick}>
      <img alt={props.name} src={props.url.replace("t_thumb", "t_720p")} />
    </li>
  )
}

function Games(props) {
  const [selectedGame, setSelectedGame] = useState(null);
  const ref = useRef(null);

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setSelectedGame(null);
    }
  };

  return (
    <div className="Games-wrapper">
      <ul className="Games-gallery">
        {props.games.map(game => {
          return (
            game.cover &&
            <Game
              key={game.id}
              name={game.name}
              url={game.cover.url}
              onClick={() => setSelectedGame(game)}
            />
          )
        })}
      </ul>
      {selectedGame &&
        <div className="Game-info-container" onClick={(event) => handleClickOutside(event)}>
          <Gameinfo infoRef={ref} onClose={() => setSelectedGame(null)} game={selectedGame} />
        </div>
      }
    </div>
  )
}

export default Games;
