const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Configuration for PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Sena_nodo_galapa',
    password: '123456',
    port: 5432, 
});

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Adjust to your React app's port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Request body:', req.body);
    next();
});

// Route to get all providers
app.get('/api/proveedores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM nodo_galapa.proveedor ORDER BY empresa');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ error: 'Error en la consulta', details: error.message });
    }
});

// Route to add a new provider
app.post('/api/proveedores', async (req, res) => {
    const { 
        empresa, 
        contacto, 
        tipo, 
        email, 
        telefono, 
        direccion, 
        ultima_compra = null 
    } = req.body;

    // Validate required fields
    const requiredFields = [empresa, contacto, tipo, email, telefono, direccion];
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const result = await pool.query(
            `
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
            `,
            [empresa, contacto, tipo, email, telefono, direccion, ultima_compra]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al agregar proveedor:', error);
        res.status(500).json({ 
            error: 'Error al agregar el proveedor', 
            details: error.message 
        });
    }
});

// Route to update a provider
app.put('/api/proveedores/:id', async (req, res) => {
    const { id } = req.params;
    const { empresa, contacto, tipo, email, telefono, direccion, ultima_compra } = req.body;

    // Validate required fields
    const requiredFields = [empresa, contacto, tipo, email, telefono, direccion];
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const result = await pool.query(
            `
            UPDATE nodo_galapa.proveedor 
            SET 
                empresa = $1,
                contacto = $2,
                tipo = $3,
                email = $4,
                telefono = $5,
                direccion = $6,
                ultima_compra = $7
            WHERE id_proveedor = $8
            RETURNING *
            `,
            [empresa, contacto, tipo, email, telefono, direccion, ultima_compra, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({ 
            error: 'Error al actualizar el proveedor', 
            details: error.message 
        });
    }
});

// Start the server
const PORT = 5000; // Changed from 5432 to avoid conflict with PostgreSQL port
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});