// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import React from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import moment from "moment"

// converts an epoch time to an HH:MM representation
function epoch_to_hours_minutes(epoch_time) {
	var hourMinuteTime = moment.unix(epoch_time);
	return hourMinuteTime.format("hh:mmA");
}

// strips extra quotes from a timeboard value
function strip_quotes(timeboard_value) {
	return timeboard_value.replace(/"/g, '');
}

class Timeboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    	timeboardEntries: [{}],
    	errorGettingTimeboardData: ''
    };
  }

  componentDidMount() {
  	axios.get("http://localhost:4000/timeboard")
  	.then(res => {
  		var timeboardEntries = res.data;
  		this.setState({ timeboardEntries });
  	})
  	.catch(err => {
  		var errorGettingTimeboardData = err;
  		this.setState({ errorGettingTimeboardData });
  	})
  }

  render() {
  	if (this.state.errorGettingTimeboardData) {
  		return (<p>Error getting MBTA timeboard data, please try again.</p>);
  	} else {
    	return (
    		<div>
    			<table>
    			<thead>
    				<tr>
    					<th>Train #</th>
    					<th>Track</th>
    					<th>Status</th>
    					<th>Departure Time</th>
    					<th>Origin</th>
    					<th>Minutes Late</th>
    					<th>Destination</th>
    				</tr>
    			</thead>
    			<tbody>
    			{this.state.timeboardEntries.map(function(entry) {
    				return (
    				<tr>
    					<td>{entry.trip ? strip_quotes(entry.trip) : ''}</td>
    					<td>{entry.track ? strip_quotes(entry.track) : 'TBD'}</td>
	    				<td>{entry.status ? strip_quotes(entry.status) : ''}</td>
    					<td>{entry.scheduledtime ? epoch_to_hours_minutes(entry.scheduledtime) : ''}</td>
    					<td>{entry.origin ? strip_quotes(entry.origin) : ''}</td>
    					<td>{entry.lateness ? parseInt(entry.lateness)/60 : 0}</td>
    					<td>{entry.destination ? strip_quotes(entry.destination) : ''}</td>
    				</tr>)
    			})}
    		</tbody>
    		</table>
    	</div>)
    }
  }
}

ReactDOM.render(
  <Timeboard/>,
  document.getElementById("mbta-timeboard")
)

