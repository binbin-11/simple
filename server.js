// express 라이브러리 사용법
// 이해할 필요는 없고, 그냥 사용하면 됨. 
const express = require('express')
const app = express()

// css, Js, 이미지 파일들 세팅하는 폴더 생성
app.use(express.static(__dirname + '/public'))

//#######template engin - EJS 사용 예정
// EJS(템플릿엔진) 세팅 
app.set('view engine', 'ejs') 

//#### 요청.body 사용 가능
app.use(express.json())
app.use(express.urlencoded({extended:true})) 


app.listen(8080 , ()=> {
    console.log("http://localhost:8080 에서 서버 실행중")
})

// 해당 html로 이동
app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html')
})

// 특정 URL 적으면 여기로 데이터 보내줌
// app.get('/news', (요청, 응답) => {
//     응답.send('오늘 비옴')
// })

// => == function 문법 동일
app.get('/shop', function(요청, 응답) {
    응답.send('쇼핑 페이지임')
})

app.get('/about', function(요청, 응답) {
    응답.sendFile(__dirname + '/about.html')
})



//######## MongoDB
// user가 데이터 입출력하도록 검열하는 역할
// mongodb 세팅 
const { MongoClient } = require('mongodb')

let db
const url = 'mongodb+srv://nhd2525:Y3ouyh8Dj1IkQ3ep@cluster0.nhovsgn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')

  // app.listen(8080, () => {
  //   console.log('http://localhost:8080 에서 서버 실행중')
  // })

}).catch((err)=>{
  console.log(err)
})

app.get('/news', ()=>{
    db.collection('post').insertOne({title : '테스트'})
})

//await 다음줄 실행하기 전에 잠깐 기다림
app.get('/list', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray();
  console.log(result);

  //응답.send(result[0].title)

  // ejs 파일 세팅
  응답.render('list.ejs', {posts : result})
})

app.get('/write', (요청, 응답) => {
  응답.render('write.ejs')
})

app.post('/add', async (요청, 응답) => {

  try {
    await db.collection('post').insertOne({ title : 요청.body.title, content : 요청.body.content })
    응답.redirect('/list'); // 다른 페이지로 이동 가능
    //응답.send('작성완료')
 } catch (e) {
    console.log(e)
    응답.send('DB에러남')
 } 
})