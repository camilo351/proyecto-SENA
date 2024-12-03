import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProvidersApp from './provedores';
import ProductosPage from './productos';
import Herramientas from './herramientas';
import './principal.css';

function Dashboard() {
    return (
        <div className="main-content">
            <div className="cards-container">
                <div className="card">
                    <h3 className="card-title">Proveedores</h3>
                    <div className="card-value">25</div>
                    <div className="card-subtitle">↑ 5 este mes</div>
                </div>
                <div className="card">
                    <h3 className="card-title">Tipos de Madera</h3>
                    <div className="card-value">12</div>
                    <div className="card-subtitle">Stock: 85%</div>
                </div>
                <div className="card">
                    <h3 className="card-title">Herramientas</h3>
                    <div className="card-value">150</div>
                    <div className="card-subtitle">15 en mantenim.</div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart">
                    <h3 className="card-title">Consumo de Materiales</h3>
                    {/* Aquí iría el código para el gráfico de barras */}
                </div>
                <div className="chart">
                    <h3 className="card-title">Distribución de Inventario</h3>
                    {/* Aquí iría el código para el gráfico circular */}
                </div>
            </div>

            <div className="table-container">
                <h3 className="card-title">Últimas Transacciones</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Proveedor</th>
                            <th>Material</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2024-11-04</td>
                            <td>Maderas del Valle</td>
                            <td>Roble</td>
                            <td>Entregado</td>
                        </tr>
                        <tr>
                            <td>2024-11-03</td>
                            <td>Herramientas Pro</td>
                            <td>Sierra Eléctrica</td>
                            <td>En Proceso</td>
                        </tr>
                        <tr>
                            <td>2024-11-03</td>
                            <td>Pinturas Express</td>
                            <td>Barniz</td>
                            <td>Pendiente</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button className="float-button">+</button>
        </div>
    );
}

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Router>
            <div className={`app ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <header className="header">
                    <div className="menu-toggle" onClick={toggleSidebar}>☰</div>
                    <h1 className="header-title">Sistema de Gestión - Manufactura SENA</h1>
                    <input type="text" className="search-bar" placeholder="Buscar recursos, proveedores..." />
                    <div className="header-icons">
                        <div className="header-icon">👤</div>
                        <div className="header-icon">⚙️</div>
                    </div>
                </header>

                <div className="container">
                    <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                        <div className="menu-item">
                            <Link to="/" onClick={toggleSidebar}>
                                📊 <span>Dashboard</span>
                            </Link>
                        </div>
                        <div className="menu-item">
                            <Link to="/providers" onClick={toggleSidebar}>
                                🏢 <span>Proveedores</span>
                            </Link>
                        </div>
                        <div className="menu-item">
                            <Link to="/productos" onClick={toggleSidebar}>
                                📦 <span>Inventario</span>
                            </Link>
                        </div>
                        <div className="menu-item">
                            <Link to="/" onClick={toggleSidebar}>
                                🔧 <span>Herramientas</span>
                            </Link>
                        </div>
                        <div className="menu-item">
                            📋 <span>Órdenes</span>
                        </div>
                        <div className="menu-item">
                            📈 <span>Reportes</span>
                        </div>
                        <div className="menu-item">
                            👥 <span>Empleados</span>
                        </div>
                    </nav>

                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/providers" element={<ProvidersApp />} />
                            <Route path="/productos" element={<ProductosPage />} />
                            <Route path="/herramientas" element={<Herramientas />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;
