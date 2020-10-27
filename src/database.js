const mysql = require('mysql');

var db_config = {
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'b5b97b4b915e7c',
    password: '1d5e609f',
    database: 'heroku_27cfacabd12c18d',
    port: 3306
};
 
var mysqlConnection = mysql.createConnection(db_config);

function handleDisconnect(){

    mysqlConnection = mysql.createConnection(db_config);

    mysqlConnection.connect(function (err) {
        if(err) {
            console.log(err);
            setTimeout(handleDisconnect, 2000);
        }
        setInterval(function () { mysqlConnection.query('SELECT 1'); }, 5000);
    });

    setInterval(function () { mysqlConnection.query('SELECT 1'); }, 5000);
    mysqlConnection.on('error', function(err) {
        console.log('db error', err);
        if(err.code == 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    })
}
handleDisconnect();



module.exports = mysqlConnection;