import { corsOptions } from '*/config/cors'
import { env } from '*/config/environtment'
import { connectDB } from '*/config/mongodb'
import { apiV1 } from '*/routes/v1'
import cors from 'cors' //https://viblo.asia/p/cors-la-gi-cors-voi-nodejs-Qbq5QyyL5D8
import express from 'express'

connectDB()
    .then(() => {
        console.log('Connected successfully to database server!')
    })
    .then(() => bootServer())
    .catch(error => {
        console.error(error)
        process.exit(1)
    })

const bootServer = () => {
    const app = express()

    app.use(cors(corsOptions))

    //Enable req.body data
    app.use(express.json())

    //use APIs v1
    app.use('/v1', apiV1)

    app.listen(env.APP_PORT, env.APP_HOST, () => {
        console.log(`Hello. I'm running at ${env.APP_HOST}:${env.APP_PORT}/`)
    })

}