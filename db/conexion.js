import mysql from 'mysql2/promise' ;

export const conexion = await mysql.createConnection({
    host: 'localhost',
    user: 'reserva',
    database: 'reserva',
    password: 'reserva24.',
    multipleStatements: true   
})
