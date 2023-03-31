
import express from "express"
import lineSdk from "@line/bot-sdk"

import { makeConfig } from "./backbone/make-config"
import { makeServices } from "./backbone/make-services"

const app = express()

//app.use(express.json())
//app.use(express.urlencoded({ extended: true }))


// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################


const config = makeConfig()
makeServices(config).then(services => {
    const { lineMessage } = services

    app.get("/hello", (req, res) => {
        return res.send("Hello").end()
    })

    app.post("/vision-api", lineMessage.middleware, async (req, res) => {
        console.log("Line Vision Api Webhook")
        try{
            const events = req.body.events as lineSdk.MessageEvent[]
            const result = await Promise.all( events.map(event => lineMessage.handleEvent(event)) )
            res.json(result).end()
        }catch(e){
            console.error(e)
            res.send("Happen Error").end()
        } 
    } )

    app.post("/admin/vision-api", async(req, res) => {

    })

    // Catch all handler for all other request.
    app.use('*', (req, res) => {
        res.json({ msg: 'no route handler found' }).end()
    })

    // Start the server
    const port = process.env.PORT || 3000

    app.listen(port, () => {
        console.log(`index.js listening on ${port}`)
    })
})