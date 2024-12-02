import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './provedores.css';

function ProvidersApp() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentProvider, setCurrentProvider] = useState(null);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:5000/api/proveedores';
    const CURRENT_USER_ID = 1;

    const initialFormState = {
        empresa: '',
        contacto: '',
        email: '',
        telefono: '',
        tipo: '',
        direccion: '',
        ultima_compra: null // Added this field to match server-side requirements
    };

    const [formData, setFormData] = useState(initialFormState);

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Error al obtener los proveedores');
            const data = await response.json();
            setProviders(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // Log the data being sent to help debug
            console.log('Creating provider:', formData);

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    ...formData, 
                    id_usuario_registra: CURRENT_USER_ID 
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al crear el proveedor');
            }

            const newProvider = await response.json();
            console.log('Provider created:', newProvider);

            fetchProviders();
            setModalOpen(false);
            setFormData(initialFormState);
            setError(null);
        } catch (err) {
            console.error('Create provider error:', err);
            setError(err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/${currentProvider.id_proveedor}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Error al actualizar el proveedor');
            fetchProviders();
            setModalOpen(false);
            setCurrentProvider(null);
            setFormData(initialFormState);
        } catch (err) {
            setError(err.message);
        }
    };

    const openEditModal = (provider) => {
        setCurrentProvider(provider);
        setFormData({
            empresa: provider.empresa,
            contacto: provider.contacto,
            email: provider.email,
            telefono: provider.telefono,
            tipo: provider.tipo,
            direccion: provider.direccion,
            ultima_compra: provider.ultima_compra
        });
        setModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentProvider(null);
        setFormData(initialFormState);
        setModalOpen(true);
    };

    const columns = [
        { name: 'Empresa', selector: (row) => row.empresa, sortable: true },
        { name: 'Contacto', selector: (row) => row.contacto, sortable: true },
        { name: 'Email', selector: (row) => row.email },
        { name: 'Teléfono', selector: (row) => row.telefono },
        { name: 'Tipo', selector: (row) => row.tipo, sortable: true },
        { name: 'Estado', selector: (row) => (row.estado === 'A' ? 'Activo' : 'Inactivo'), sortable: true },
        {
            name: 'Acciones',
            cell: (row) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => openEditModal(row)}>Editar</button>
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gestión de Proveedores</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={openCreateModal}>Nuevo Proveedor</button>
            <DataTable
                columns={columns}
                data={providers}
                progressPending={loading}
                pagination
                responsive
            />
            {modalOpen && (
                <div className="modal">
                    <form onSubmit={currentProvider ? handleUpdate : handleCreate}>
                        <h2>{currentProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
                        <input 
                            name="empresa" 
                            value={formData.empresa} 
                            onChange={handleInputChange} 
                            placeholder="Empresa" 
                            required 
                        />
                        <input 
                            name="contacto" 
                            value={formData.contacto} 
                            onChange={handleInputChange} 
                            placeholder="Contacto" 
                            required 
                        />
                        <input 
                            name="email" 
                            type="email"
                            value={formData.email} 
                            onChange={handleInputChange} 
                            placeholder="Email" 
                            required 
                        />
                        <input 
                            name="telefono" 
                            value={formData.telefono} 
                            onChange={handleInputChange} 
                            placeholder="Teléfono" 
                            required 
                        />
                        <select 
                            name="tipo" 
                            value={formData.tipo} 
                            onChange={handleInputChange} 
                            required
                        >
                            <option value="">Seleccionar Tipo</option>
                            <option value="Producto">Producto</option>
                            <option value="Servicio">Servicio</option>
                        </select>
                        <input 
                            name="direccion" 
                            value={formData.direccion} 
                            onChange={handleInputChange} 
                            placeholder="Dirección" 
                            required 
                        />
                        <input 
                            name="ultima_compra" 
                            type="date" 
                            value={formData.ultima_compra || ''} 
                            onChange={handleInputChange} 
                            placeholder="Última Compra" 
                        />
                        <div className="modal-actions">
                            <button type="submit">
                                {currentProvider ? 'Actualizar' : 'Crear'}
                            </button>
                            <button type="button" onClick={() => setModalOpen(false)}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ProvidersApp;