const express = require('express');
const app = express();

app.get('/data', (req ,res) => {

	const callback = req.query.callback;
	const data = {"top secret": "666"};

	if (callback) {
		res.send(`${callback}(${JSON.stringify(data)});`);
	} else {
		res.setHeader('Content-Type', 'application/javascript');
		res.send(JSON.stringify(data));
	}
});

app.listen(3000, () => {
	console.log('to data, go localhost:3000/data');
})
