import mysql from 'mysql2/promise' ;
process.loadEnvFile();

export const conexion = await mysql.createConnection({
    host: process.env.HOST_BASE,
    user: process.env.USER_BASE,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    multipleStatements: true   
});
