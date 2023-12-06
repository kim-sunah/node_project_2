import express from 'express';
import { SERVER_PORT } from './constants/app.constans.js'
import { apiRouter } from './routers/index.js';


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));//프론트엔드에서 api를 호출할 때 form 태그를 이용해 데이터를 넘길 때 이 옵션을 사용해야 데이터를 넘길 수 있음
app.use('/api', apiRouter)


app.listen(SERVER_PORT, () => {
    console.log(`Example app listening on port ${SERVER_PORT}`)
})