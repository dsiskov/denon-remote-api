
module.exports = () => {
	return {
		settings: settings,
		execute: execute
	}
}

// todo: ip address can come from client
// constants
const avr_ip_address = 'http://192.168.1.10' //todo: process.env.
const MAIN_ZONE = "MAIN ZONE"

// urls
const avr_settings_url = `${avr_ip_address}/goform/formMainZone_MainZoneXml.xml`
const push_to_avr_url = `${avr_ip_address}/MainZone/index.put.asp`

// actions
const SET_FIP_RADIO = "cmd0=PutZone_InputFunction%2FIRADIO&cmd1=aspMainZone_WebUpdateStatus%2F"

// internal request header
function getHeadersForZone(zone) {
	return {
		headers: { 'Access-Control-Allow-Origin': '*', "X-Requested-With": "XMLHttpRequest", "Cookie": "ZoneName=" + zone }
	}
}

// -> settings
async function settings(req, res) {
	console.log('retrieve avr settings')
	let response = await axios.get(avr_settings_url, { withCredentials: true }, getHeadersForZone(MAIN_ZONE))
	console.log(response)
}

// -> execute
async function execute(req, res) {
	const avrCommand = req.body.command
	console.log(`command ${avrCommand}`)
	let response = await axios.post(push_to_avr_url, avrCommand, getHeadersForZone(MAIN_ZONE))
	console.log(response)
}
