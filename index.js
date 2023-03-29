const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')

const LineService = require("./services/line-message")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


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

// Create or Update an item

const lineConfig = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const lineService = new LineService(lineConfig)

app.get("/ping", (req, res) => {
    return res.send("OK").end()
})

app.post("/vision-api", lineService.middleware, async (req, res) => {
    console.log("Line Vision Api Webhook")
    try{
        const result = await Promise.all( req.body.events.map(event => handleEvent.handleEvent(event)) )
        res.json(result).end()
    }catch(e){
        console.error(e)
        res.send("Happen Error").end()
    } 
} )

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler found' }).end()
})

// Start the server
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})