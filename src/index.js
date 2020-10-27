const express = require('express');
const app = express();

//Config
app.set('port', process.env.PORT || 3000);


app.use(express.json());

// Routes
app.use(require('./routes/routes'));

app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
});