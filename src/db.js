const mysql = require('mysql');

const connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'nene1987',
	database:'irriga'
});

connection.connect(error => {
  if (error) throw error;
    console.log("Sucessfully connected to the database");
});

connection.query('select * from user', (err, results) => {
  if(err) throw err;
    console.log(results);
});

/*
connection.query('create table userteste (id int(11) primary key auto_increment, name varchar(200)) engine=innodb;', (err, results) => {
    if(err) throw err;
      console.log(results);
});
*/


module.exports = connection;


