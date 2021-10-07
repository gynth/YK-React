const express = require('express');
const app3128 = express();
const Ai = require('./Ai/ai');
const cors = require('cors');

// const soap = require('soap'); 

global.REC_SCALENUMB = null;

app3128.use(express.json({
  limit: '100mb'
}));
app3128.use(express.urlencoded({ 
  limit: '100mb',
  extended: false 
})); 
app3128.use(cors()); 

app3128.use('/Ai', Ai);

const port3128 = 3128;
app3128.listen(port3128, () => {
  console.log(`AiServer on port: ${port3128}..`)
});  
      