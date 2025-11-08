-- Para crear usuarios por se quiere testear notificaciones 

-- 1. Crear un usuario Administrador (tipo_usuario = 1)
-- Este usuario recibirá notificaciones cuando se creen reservas
INSERT INTO usuarios (nombre, apellido, nombre_usuario, tipo_usuario, contrasenia, celular, activo)
VALUES ('Admin', 'Prueba', 'tu_email@gmail.com', 1, 'password123', 1234567890, 1);

-- 2. Crear un usuario Normal (tipo_usuario = 3)
-- Este usuario recibirá confirmación cuando haga una reserva
INSERT INTO usuarios (nombre, apellido, nombre_usuario, tipo_usuario, contrasenia, celular, activo)
VALUES ('Usuario', 'Prueba', 'tu_email@gmail.com', 3, 'password123', 1234567890, 1);

-- 3. Verificar los usuarios creados
SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, activo 
FROM usuarios 
WHERE nombre_usuario = 'tu_email@gmail.com';

-- 4. Si necesitas eliminar los usuarios de prueba después:
DELETE FROM usuarios WHERE nombre_usuario = 'tu_email@gmail.com';

-- Procedimiento almacenado para obtener reporte de reservas por mes

DELIMITER $$

CREATE PROCEDURE reporte_reservas_por_mes()
BEGIN
    SELECT 
        DATE_FORMAT(fecha_reserva, '%Y-%m') AS mes,
        COUNT(*) AS total_reservas,
        SUM(importe_total) AS total_recaudado
    FROM reservas
    GROUP BY mes
    ORDER BY mes DESC;
END $$

DELIMITER ;


-- Después comprobar con:

CALL reporte_reservas_por_mes();