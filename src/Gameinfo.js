import React from 'react';
import './App.css';
import { SlMagnifierAdd } from 'react-icons/sl';
import { CgCloseO } from 'react-icons/cg';


function joinArrayProperties(array, prop) {
	if (!array) return "N/A";
	const propArray = [];
	for (const obj of array) {
		propArray.push(obj[prop]);
	}
	return propArray.join(", ");
}


function Gameinfo(props) {
	const game = props.game;

	if (game !== null) {
		let date = new Date(game.first_release_date * 1000);
		let dateString = date.toDateString();
		if (dateString === "Invalid Date") {
			dateString = "N/A";
		}
		else {
			dateString = dateString.slice(3);
		}
		let companies = "N/A";
		if (game.involved_companies) {
			const companyNames = [];
			for (const involved of game.involved_companies) {
				companyNames.push(involved.company.name);
			}
			companies = companyNames.join(", ");
		}

		return (
			<div className="Game-info" ref={props.infoRef}>
				<CgCloseO onClick={props.onClose} className="GameInfoClose" />
				{game.cover &&
					<div className="Cover-info">
						<a target="_blank" href={game.cover.url.replace("t_thumb", "t_1080p")}>
							<img alt={game.name} src={game.cover.url.replace("t_thumb", "t_720p")} />
						</a>
						<SlMagnifierAdd className="CoverZoomButton" />
					</div>}
				<div className="Game-info-title">
					<h1>{game.name}</h1>
					<h2>{dateString}</h2>
					<h3>{companies}</h3>
					<div>{joinArrayProperties(game.platforms, "name")}</div>
					<p>{joinArrayProperties(game.genres, "name")}</p>
				</div>
				<div className="Game-info-text">
					<p className="Summary">{game.summary}</p>
					<div className="Summary">{game.websites && game.websites.map((site, i) => {
						return (
							<p key={`site${i}`}>
								<a target="_blank" href={site.url}>{site.url}</a>
							</p>
						)
					})}</div>
				</div>
				<div className="Game-info-screenshots">
					<div>{game.videos && game.videos.map((vid, i) => {
						return (
							<iframe key={`vid${i}`} className="Youtube" src={`https://www.youtube.com/embed/${vid.video_id}`} title="YouTube video player" frameBorder="0" allow="fullscreen"></iframe>
						)
					})}
						{game.screenshots && game.screenshots.map((screen, i) => {
							return (
								<a key={`screen${i}`} target="_blank" href={screen.url.replace("t_thumb", "t_1080p")}>
									<img alt="" src={screen.url.replace("t_thumb", "t_720p")} />
								</a>)
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default Gameinfo;
