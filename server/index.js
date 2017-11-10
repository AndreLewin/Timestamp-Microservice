const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const moment = require('moment');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Configuring webpack 
const config = require('../webpack.dev.config');
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {colors: true}
}));

app.get('/:date', (req, res) => {
  // Get the date from the URL
  const rawDate = req.params.date;
  
  const supportedFormats = [
    'YYYY-MM-DD', 'DD-MM-YYYY',
    'YYYY/MM/DD', 'MM/DD/YYYY',
    'MMMM DD, YYYY', 'DD MMMM, YYYY',
    'MMMM DD YYYY', 'DD MMMM YYYY'
  ];
  
  // Check if the given date is a unix timestamp (number only)
  // It will be interpreted as milliseconds  
  const isUnixTimestamp = /^[0-9]*$/.test(rawDate);
  /// console.log("Is it a number? " + isUnixTimestamp);
  
  // If it is an Unix Timestamp, use it directly,
  // or parse the date with the supported formats
  const date = isUnixTimestamp ? moment(parseInt(rawDate)) : moment(rawDate, supportedFormats);
  /// console.log("What is the parsed unix date? " + date);
  
  // Format the answer
  const answer = {
    unix: date.isValid() ? date.format('x') : null,
    natural: date.isValid() ? date.format('MMMM D, YYYY') : null
  }
  
  // Send the answer to the user
  res.json(answer);
});


// listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
