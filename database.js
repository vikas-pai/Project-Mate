import mysql from 'mysql2'
const connection=mysql.createConnection({
    host:"localhost",
    database:"project_mate",
    user:"root",
    password:"mysql1234database"
});
// module.exports=connection;

export default connection;