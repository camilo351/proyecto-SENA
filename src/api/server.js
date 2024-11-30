const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Sena_nodo_galapa',
    password: '123456',
    port: 5432,
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para obtener todos los proveedores
app.get('/api/proveedores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM nodo_galapa.proveedor ORDER BY empresa');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).send('Error en la consulta');
    }
});

// Ruta para agregar un nuevo proveedor
app.post('/api/proveedores', async (req, res) => {
    const { empresa, contacto, tipo, email, telefono, direccion, id_usuario_registra } = req.body;

    // Validar datos requeridos
    if (!empresa || !contacto || !tipo || !email || !telefono || !direccion) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    try {
        const result = await pool.query(`
            INSERT INTO nodo_galapa.proveedor (
                id_proveedor,
                empresa,
                contacto,
                tipo,
                email,
                telefono,
                direccion,
                estado,
                fecha_registro,
                ultima_compra
            ) VALUES (
                nextval('nodo_galapa.proveedor_id_seq'),
                $1, $2, $3, $4, $5, $6, 'A', CURRENT_TIMESTAMP, $7
            ) RETURNING *
        `, [empresa, contacto, tipo, email, telefono, direccion, ultima_compra]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al agregar proveedor:', error);
        res.status(500).send('Error al agregar el proveedor');
    }
});

// Ruta para actualizar un proveedor
app.put('/api/proveedores/:id', async (req, res) => {
    const { id } = req.params;
    const { empresa, contacto, tipo, email, telefono, direccion } = req.body;

    // Validar datos requeridos
    if (!empresa || !contacto || !tipo || !email || !telefono || !direccion) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    try {
        const result = await pool.query(`
            UPDATE nodo_galapa.proveedor 
            SET 
                empresa = $1,
                contacto = $2,
                tipo = $3,
                email = $4,
                telefono = $5,
                direccion = $6
            WHERE id_proveedor = $7
            RETURNING *
        `, [empresa, contacto, tipo, email, telefono, direccion]);

        if (result.rows.length === 0) {
            return res.status(404).send('Proveedor no encontrado');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).send('Error al actualizar el proveedor');
    }
});

