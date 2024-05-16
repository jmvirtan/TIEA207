import React, { useState } from 'react';
import './App.css';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { SiWindowsxp } from 'react-icons/si';
import { FaPlaystation } from 'react-icons/fa';
import { SiNintendoswitch } from 'react-icons/si';
import { FaXbox } from 'react-icons/fa';
import { AiFillApple } from 'react-icons/ai';
import { AiFillAndroid } from 'react-icons/ai';

import GamerSvg from './gamersvg.svg';

function Platform(props) {
  return (
    <div className={props.chosen ? "Platform-selected" : "Platform"}
      onClick={props.onClick}
    >
      {props.logo}
      <div>{props.name}</div>
    </div>
  );
}

function Platforms(props) {
  const initialState = [
    { name: "PC (Windows)", id: [6], chosen: false, logo: <SiWindowsxp className="RandomizeIcon" /> },
    { name: "PlayStation 4/5", id: [48, 167], chosen: false, logo: <FaPlaystation className="RandomizeIcon" /> },
    { name: "Nintendo Switch", id: [130], chosen: false, logo: <SiNintendoswitch className="RandomizeIcon" /> },
    { name: "Xbox Series X/S", id: [169], chosen: false, logo: <FaXbox className="RandomizeIcon" /> },
    { name: "Android / iOS", id: [39, 34], chosen: false, logo: [<AiFillAndroid key={39} className="RandomizeIcon" />, <AiFillApple key={34} className="RandomizeIcon" />] }
  ]
  const [chosenPlatforms, setChosenPlatforms] = useState([]);
  const [platformButtons, setPlatformButtons] = useState(initialState);

  function handlePlatformClick(platform) {
    platform.chosen = !platform.chosen;
    const idArray = platform.id;
    const currentPlatforms = chosenPlatforms.slice();
    let platformIndex = -1;

    for (const id of idArray) {
      for (let i = 0; i < currentPlatforms.length; i++) {
        const platformID = currentPlatforms[i];
        if (platformID === id) {
          platformIndex = i;
          currentPlatforms.splice(platformIndex, 1);
          break;
        }
      }
    }

    if (platformIndex < 0) {
      const newPlatforms = currentPlatforms.concat(idArray);
      setChosenPlatforms(newPlatforms);
      props.onClick(newPlatforms);
    }
    else {
      setChosenPlatforms(currentPlatforms);
      props.onClick(currentPlatforms);
    }

  }

  function resetPage() {
    setPlatformButtons(initialState);
    setChosenPlatforms([]);
    props.resetPage();
  }

  return (
    <div className="Header">
      <img className="GamerLogo" src={GamerSvg} alt="GamerLogo" onClick={() => window.location.reload()} />
      <div className="Header-Platforms">
        <p>Search by<br />platforms:</p>
        <div className={chosenPlatforms.length < 1 ? "RandomizeIndicator" : "RandomizeIndicator-Faded"}
          onClick={() => {
            if (chosenPlatforms.length > 0) {
              setPlatformButtons(initialState);
              setChosenPlatforms([]);
              props.onClick(chosenPlatforms);
            }
          }}>
          <GiPerspectiveDiceSixFacesRandom className="RandomizeIcon" />
          <br />All Platforms
        </div>
        {platformButtons.map(platform => {
          const platformID = platform.id[0];
          return <Platform
            key={platformID}
            name={platform.name}
            chosen={platform.chosen}
            logo={platform.logo}
            onClick={() => handlePlatformClick(platform)}
          />;
        })}
      </div>
    </div>
  )
}

export default Platforms;
