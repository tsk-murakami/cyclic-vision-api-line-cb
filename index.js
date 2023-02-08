const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')
const {loadTFLiteModel} = require('tfjs-tflite-node');
const tf = require('@tensorflow/tfjs-node')
const Jimp = require('jimp');
const fs = require('fs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let model
let labels = []

const loadModel = async () => {
    model = await loadTFLiteModel('./model.tflite');
    console.log(model)
}
const loadLabels = () => {
    const _labels = fs.readFileSync("./labels.txt")
    labels = _labels.toString().split("\n")
}
//loadLabels()
//loadModel()

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

function compare( a, b ){
    var r = 0;
    if( a.probability < b.probability ){ r = 1; }
    else if( a.probability > b.probability ){ r = -1; }
  
    return r;
}

app.get("/ping", (req, res) => {
    return res.send("OK").end()
})

app.get('/predict', async (req, res) => {
    const image = await Jimp.read("./kokin_2.jpeg");
    image.cover(224, 224, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

    const NUM_OF_CHANNELS = 3;
    let values = new Float32Array(224 * 224 * NUM_OF_CHANNELS);

    let i = 0;
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
        pixel.r = pixel.r / 127.0 - 1;
        pixel.g = pixel.g / 127.0 - 1;
        pixel.b = pixel.b / 127.0 - 1;
        pixel.a = pixel.a / 127.0 - 1;
        values[i * NUM_OF_CHANNELS + 0] = pixel.r;
        values[i * NUM_OF_CHANNELS + 1] = pixel.g;
        values[i * NUM_OF_CHANNELS + 2] = pixel.b;
        i++;
    });

    const outShape = [224, 224, NUM_OF_CHANNELS];
    let img_tensor = tf.tensor3d(values, outShape, 'int32');
    img_tensor = img_tensor.expandDims(0);
    const predictions = await model.predict(img_tensor).dataSync();
    const items = []
    for (let i = 0; i < predictions.length; i++) {
        const label = labels[i];
        const probability = predictions[i];
        console.log(`${label}: ${probability}`);
        items.push({
            label, probability
        })
    }
    const sorted = items.sort(compare)

    res.json(items).end()
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