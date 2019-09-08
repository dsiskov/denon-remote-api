const axios = require('axios')
const parseString = require('xml2js').parseString;
const stringify = require('querystring').stringify;

module.exports = () => {
	return {
		settings: settings,
		execute: execute
	}
}

// todo: ip address can come from client
// constants
const MAIN_ZONE = "MAIN ZONE"

// urls
const avr_settings_url = `${process.env.AVR_URL}/goform/formMainZone_MainZoneXml.xml`
const push_to_avr_url = `${process.env.AVR_URL}/MainZone/index.put.asp`

// internal request header
function getHeadersForZone(zone) {
	return {
		headers: { 'Access-Control-Allow-Origin': '*', "X-Requested-With": "XMLHttpRequest", "Cookie": "ZoneName=" + zone }
	}
}

// -> settings
async function settings(req, res) {
	console.log('retrieving avr settings')
	let response = await axios.get(avr_settings_url, { withCredentials: true }, getHeadersForZone(MAIN_ZONE))
	parseString(response.data, (err, result) => {
		if (err) {
			res.sendStatus(400, { error: `Failure while getting settings ${err}` })
		} else {
			console.log(result.item);
			console.log(result.item.MasterVolume)

			const masterVolume = 80 + parseFloat(result.item.MasterVolume[0].value);
			const selection = result.item.InputFuncSelect[0].value[0];
			const mute = result.item.Mute[0].value === 'on';
			const power = result.item.Power[0].value[0];

			res.send({ result: { power, masterVolume, selection, mute } })
		}
	});
}

// -> execute
async function execute(req, res) {
	const command = req.body.command
	const commandParameter = req.body.commandParameter
	console.log(`executing command ${command}, with parameter: ${commandParameter}`)

	let avrCommand = ''

	// todo: read from constants
	switch (command) {
		case 'toggle-power':
			avrCommand = `PutZone_OnOff/${commandParameter}`
			break;
		case 'set-master-volume':
			const avrVolume = commandParameter - 80;
			avrCommand = `PutMasterVolumeSet/${avrVolume}`;
			break;
		case 'set-input':
			avrCommand = `PutZone_InputFunction/${commandParameter}`;
			break;

		default:
			res.sendStatus(500)
	}
	try {
		let response = await axios.post(push_to_avr_url, stringify({ cmd0: avrCommand }), getHeadersForZone(MAIN_ZONE))
		console.log(response)
		res.send(200);
	}
	catch (ex) {
		const errorString = ex.printStackTrace();
		console.log(`error: \r\n${errorString}`)
		res.status(500).send({ error: errorString })
	}
}
