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
  
  const acceptedFormats = [
    'YYYY-MM-DD', 'DD-MM-YYYY',
    'YYYY/MM/DD', 'MM/DD/YYYY',
    'MMMM DD, YYYY', 'DD MMMM, YYYY',
    'MMMM DD YYYY', 'DD MMMM YYYY'
  ];
  
  // Parse the date using moment.js
  const date = moment(rawDate, acceptedFormats);
  
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
