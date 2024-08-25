const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send(`
<!doctype html>
<html>
    <h1> JSONP example </h1>
    <div id="jsonp data"></div>

    <script>
    function handleFunction(data) {
        const divElement = document.getElementById('jsonp data');
        divElement.innerHTML = JSON.stringify(data);
    }
    </script>

    <script src="http://localhost:3000/data?callback=handleFunction">
    </script>
</html>
`)
})

app.listen(3001, () => {
    console.log("running on part 3001");
})
