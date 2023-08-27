const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.static('/src/web/public'));

// Начальная страница
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/web/gameboard.html');
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});