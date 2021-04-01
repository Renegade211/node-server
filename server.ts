import express from 'express'
import firebase from 'firebase/app';
import 'firebase/database';
const cors = require('cors')
const cron = require('cron').CronJob
const rp = require('request-promise-native')
const swaggerUi = require('swagger-ui-express')
const options = require('./openapi')
require('dotenv').config()

firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_ID,
    appId: process.env.APP_ID
})

const app: express.Application = express()

interface TRM {
  rate: number,
  source: string,
  target: string,
  time: string
}

function writeData(data: Array<TRM>, type: string) {
  const time = new Date()
    data.forEach((item: TRM) => {
      firebase.database().ref(`/${type}/${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`).set({
        rate: item.rate,
        source: item.source,
        target: item.target,
        time: item.time
      })
    });
}

const job = new cron('0 7 * * *', async function() {
  try {
    const data = await rp({
      uri: "https://api.sandbox.transferwise.tech/v1/rates?source=USD&target=UYU",
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    })
    writeData(JSON.parse(data), 'data')
  } catch(err) {
    console.log(err)
  }
})

job.start()

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/trm', async (req, res) => {
  const {source, target} = req.body;
  try {
      const data = await rp({
      uri: `https://api.sandbox.transferwise.tech/v1/rates?source=${source}&target=${target}`,
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    })
  writeData(JSON.parse(data), 'request')
  res.send("Success")
  } catch(err) {
    console.log(err)
  }
})

app.get('/trm', (req, res) => {
    const data: Array<TRM> = []
    firebase.database().ref('data/').on('value', (snapshot) => {
      data.push(snapshot.val())
    })
    res.send(data)
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(options))

app.listen(3000, () => console.log('API on port 3000'))