const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'Postgres',  // Asegúrate de que este usuario exista en tu base de datos
    host: 'localhost',
    database: 'SenaNodoGalapa',  // Verifica que esta base de datos exista
    password: '123456',  // Asegúrate de que la contraseña sea correcta
    port: 5432,
});

// Manejador de errores en la conexión del pool
pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Función de validación de datos de proveedor
const validateProviderData = (data) => {
    const requiredFields = ['empresa', 'contacto', 'tipo', 'email', 'telefono', 'direccion'];
    return requiredFields.every(field => 
        data[field] && data[field].trim() !== ''
    );
};

// Obtener todos los proveedores
app.get('/api/proveedores', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id_proveedor,
                p.empresa,
                p.contacto,
                p.tipo,
                p.email,
                p.telefono,
                p.direccion,
                p.estado,
                p.ultima_compra
            FROM nodo_galapa.proveedor p
            ORDER BY p.empresa
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ error: 'Error al obtener los proveedores' });
    }
});

// Obtener un proveedor por ID
app.get('/api/proveedores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM nodo_galapa.proveedor WHERE id_proveedor = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener proveedor:', error);
        res.status(500).json({ error: 'Error al obtener el proveedor' });
    }
});

// Crear nuevo proveedor
app.post('/api/proveedores', async (req, res) => {
    const client = await pool.connect();
    
    if (!validateProviderData(req.body)) {
        return res.status(400).json({ error: 'Datos de proveedor inválidos' });
    }

    try {
        const {
            empresa,
            contacto,
            tipo,
            email,
            telefono,
            direccion,
            id_usuario_registra
        } = req.body;

        await client.query('BEGIN');

        const result = await client.query(`
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
                id_usuario_registra
            ) VALUES (
                nextval('nodo_galapa.proveedor_id_seq'),
                $1, $2, $3, $4, $5, $6, 'A', CURRENT_TIMESTAMP, $7
            ) RETURNING *
        `, [empresa, contacto, tipo, email, telefono, direccion, id_usuario_registra]);

        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear proveedor:', error);
        res.status(500).json({ error: 'Error al crear el proveedor' });
    } finally {
        client.release();
    }
});

// Actualizar proveedor
app.put('/api/proveedores/:id', async (req, res) => {
    const client = await pool.connect();
    
    if (!validateProviderData(req.body)) {
        return res.status(400).json({ error: 'Datos de proveedor inválidos' });
    }

    try {
        const { id } = req.params;
        const {
            empresa,
            contacto,
            tipo,
            email,
            telefono,
            direccion,
            estado
        } = req.body;

        await client.query('BEGIN');

        const result = await client.query(`
            UPDATE nodo_galapa.proveedor 
            SET 
                empresa = $1,
                contacto = $2,
                tipo = $3,
                email = $4,
                telefono = $5,
                direccion = $6,
                estado = $7
            WHERE id_proveedor = $8
            RETURNING *
        `, [empresa, contacto, tipo, email, telefono, direccion, estado, id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({ error: 'Error al actualizar el proveedor' });
    } finally {
        client.release();
    }
});

// Eliminar proveedor
app.delete('/api/proveedores/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        
        await client.query('BEGIN');
        
        const result = await client.query(
            'DELETE FROM nodo_galapa.proveedor WHERE id_proveedor = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        await client.query('COMMIT');
        res.json({ mensaje: 'Proveedor eliminado exitosamente' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({ error: 'Error al eliminar el proveedor' });
    } finally {
        client.release();
    }
});

// Configuración del puerto del servidor
const port = 5000;
app.listen(port, () => {
    console.log(`Server corriendo en el puerto http://localhost:${port}`);
});

// Manejo de errores globales
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});
