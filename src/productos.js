// Frontend (React) - ProductosPage.jsx
import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net';


function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productoEdit, setProductoEdit] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    id_categoria: '',
    descripcion: '',
    estado: 'A'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      if (!response.ok) throw new Error('Error al cargar productos');
      
      const data = await response.json();
      setProductos(data);
      setLoading(false);

      // Initialize DataTable
      setTimeout(() => {
        if ($.fn.DataTable && !$.fn.DataTable.isDataTable('#productosTable')) {
          $('#productosTable').DataTable({
            language: {
              url: 'https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json',
            },
            destroy: true
          });
        }
      }, 0);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEdit = (producto) => {
    setProductoEdit({ ...producto });
  };

  const handleUpdateProducto = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${productoEdit.id_articulo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoEdit),
      });
      
      if (!response.ok) throw new Error('Error al actualizar producto');

      const updatedProducto = await response.json();
      setProductos(prev => 
        prev.map(prod => 
          prod.id_articulo === updatedProducto.id_articulo ? updatedProducto : prod
        )
      );
      setProductoEdit(null);
      fetchProductos(); // Refresh table
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateProducto = async (e) => {
    e.preventDefault();
  
    // Validación previa al envío
    if (!nuevoProducto.id_categoria || !nuevoProducto.descripcion) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }
  
    try {
      const response = await fetch('/api/crearProductos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_categoria: nuevoProducto.id_categoria,
          descripcion: nuevoProducto.descripcion,
          estado: nuevoProducto.estado || 'A',
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Producto creado con éxito!');
        setShowCreateModal(false);
        setNuevoProducto({}); // Limpia los campos del formulario
        // Opcional: Actualiza la lista de productos
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Error al crear producto. Por favor, intenta de nuevo.');
    }
  };
  
  

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar producto');

      setProductos(prev => prev.filter(prod => prod.id_articulo !== id));
      fetchProductos(); // Refresh table
    } catch (err) {
      alert(err.message);
    }
  };

  const renderEditModal = () => (
    <div className="modal" style={{display: productoEdit ? 'block' : 'none'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Producto</h5>
            <button onClick={() => setProductoEdit(null)} className="close">&times;</button>
          </div>
          <form onSubmit={handleUpdateProducto}>
            <div className="modal-body">
              <div className="form-group">
                <label>ID Categoría</label>
                <input 
                  type="number" 
                  name="id_categoria" 
                  className="form-control"
                  value={productoEdit?.id_categoria || ''} 
                  onChange={(e) => setProductoEdit(prev => ({...prev, id_categoria: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input 
                  type="text" 
                  name="descripcion" 
                  className="form-control"
                  value={productoEdit?.descripcion || ''} 
                  onChange={(e) => setProductoEdit(prev => ({...prev, descripcion: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select 
                  name="estado" 
                  className="form-control"
                  value={productoEdit?.estado || ''} 
                  onChange={(e) => setProductoEdit(prev => ({...prev, estado: e.target.value}))}
                >
                  <option value="A">Activo</option>
                  <option value="I">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setProductoEdit(null)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderCreateModal = () => (
    <div className="modal" style={{ display: showCreateModal ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear Nuevo Producto</h5>
            <button onClick={() => setShowCreateModal(false)} className="close">&times;</button>
          </div>
  
          <form onSubmit={handleCreateProducto}>
            <div className="modal-body">
              <div className="form-group">
                <label>ID Categoría</label>
                <input
                  type="number"
                  name="id_categoria"
                  className="form-control"
                  value={nuevoProducto.id_categoria || ''}
                  onChange={(e) =>
                    setNuevoProducto((prev) => ({
                      ...prev,
                      id_categoria: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  className="form-control"
                  value={nuevoProducto.descripcion || ''}
                  onChange={(e) =>
                    setNuevoProducto((prev) => ({
                      ...prev,
                      descripcion: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  name="estado"
                  className="form-control"
                  value={nuevoProducto.estado || 'A'}
                  onChange={(e) =>
                    setNuevoProducto((prev) => ({
                      ...prev,
                      estado: e.target.value,
                    }))
                  }
                >
                  <option value="A">Activo</option>
                  <option value="I">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Crear Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>
      <button 
        className="btn btn-success mb-3" 
        onClick={() => setShowCreateModal(true)}
      >
        Nuevo Producto
      </button>

      <table id="productosTable" className="table table-striped">
        <thead>
          <tr>
            <th>ID Artículo</th>
            <th>ID Categoría</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id_articulo}>
              <td>{producto.id_articulo}</td>
              <td>{producto.id_categoria}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.estado === 'A' ? 'Activo' : 'Inactivo'}</td>
              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEdit(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(producto.id_articulo)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderEditModal()}
      {renderCreateModal()}
      <form action='http://localhost:5000/api/productos/filter'>
          <input name='id' type="text "value={"20"}></input>
          <input type='submit'></input>
      </form>
    </div>
  );
}

export default ProductosPage;