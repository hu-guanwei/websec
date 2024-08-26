const express = require('express');
const app = express();

app.get('/data', (req ,res) => {

	const callback = req.query.callback;
	const data = {"top secret": "666"};
	res.setHeader('Content-Type', 'application/javascript');

	if (callback) {	
		res.send(`${callback}(${JSON.stringify(data)});`);
	} else {
		res.send(JSON.stringify(data));
	}
});

app.listen(3000, () => {
	console.log('to get data, go localhost:3000/data');
})
