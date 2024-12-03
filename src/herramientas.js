import React, { useEffect } from "react";
import $ from "jquery";
import "datatables.net";

const Herramientas = () => {
  useEffect(() => {
    // Inicializar DataTable
    $("#tablaPrestamos").DataTable();
    // Limpiar la tabla cuando el componente se desmonte
    return () => {
      $("#tablaPrestamos").DataTable().destroy(true);
    };
  }, []);

  return (
    <div>
      <h1>Registro de Préstamos</h1>
      <table id="tablaPrestamos" className="display">
        <thead>
          <tr>
            <th>Nombre del Aprendiz</th>
            <th>Ficha del Curso</th>
            <th>Fecha de Prestación</th>
            <th>Fecha de Devolución</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Juan Pérez</td>
            <td>123456</td>
            <td>2024-12-01</td>
            <td>2024-12-15</td>
          </tr>
          <tr>
            <td>María Gómez</td>
            <td>654321</td>
            <td>2024-11-25</td>
            <td>2024-12-05</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTableComponent;