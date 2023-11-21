import express from 'express';
import { SERVER_PORT } from './constants/app.constans.js'
import db from './models/index.cjs'
const app = express()

const { products, users } = db;
const product = await products.findAll();
const user = await users.findAll();

console.log({ product: product.map((product) => product.toJSON()), user: user.map((user) => user.toJSON()) })


app.listen(SERVER_PORT, () => {
    console.log(`Example app listening on port ${SERVER_PORT}`)
})