import mysql from "mysql";

// const poolconnection = mysql.createPool({
//   host: "127.0.0.1",
//   user: "root",
//   database: "shipping",
// });
const poolconnection = mysql.createPool({
  host: '193.203.184.63', // Replace with your host name
  user: 'u219507986_branch',      // Replace with your database email
  password: 'F6]jPtO$K#t',      // Replace with your database password    ///df-opcity-home
  database: 'u219507986_branch'
});

export default poolconnection;
