const express = require('express')
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 3000;
const connect = require('./schemas');
connect();
const boardRouter = require("./routers/board");
app.use('/api', [boardRouter]);

app.set('views', __dirname + '/views'); //경로 설정 부분
app.set('view engine', 'ejs'); //view engine으로 ejs를 사용할것

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/posting', (req, res) => {
    res.render('posting');
})

app.get('/detail', (req, res) => {
  res.render('detail');
})
app.get('/modify', (req, res) => {
  res.render('modify');
})



app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})