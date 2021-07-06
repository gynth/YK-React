const express = require('express');
const app = express();
const Mysql = require('./db/Mysql/Mysql');
const Milestone = require('./Milestone/Milestone');
const WebReq = require('./WebReq/WebReq');
const cors = require('cors');

app.use(express.json());
app.use(cors());

//#region Mysql요청

app.use('/Mysql', Mysql);

//#endregion

//#region YK스틸 웹요청

app.use('/YK', WebReq);

//#endregion

//#region YK스틸 MILESTONE

app.use('/MILESTONE', Milestone);

//#endregion

const port = 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}..`)
});  