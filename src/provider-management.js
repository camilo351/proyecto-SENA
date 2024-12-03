import React, { useState } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProviderManagement = () => {
  const [providers, setProviders] = useState([
    {
      id: 1,
      company: "Maderas del Valle",
      contact: "Juan Pérez",
      email: "juan@maderasdelvalle.com",
      phone: "123-456-7890",
      type: "Madera",
      address: "Calle Principal 123",
      status: "Activo",
      lastPurchase: "2024-11-01"
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState({
    status: "all",
    type: "all"
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    type: "",
    address: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleSubmit = () => {
    if (editingProvider) {
      setProviders(prev => prev.map(provider => 
        provider.id === editingProvider.id 
          ? { ...provider, ...formData }
          : provider
      ));
    } else {
      setProviders(prev => [...prev, {
        ...formData,
        id: Date.now(),
        status: "Activo",
        lastPurchase: new Date().toISOString().split('T')[0]
      }]);
    }
    handleCloseModal();
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setFormData(provider);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProvider(null);
    setFormData({
      company: "",
      contact: "",
      email: "",
      phone: "",
      type: "",
      address: ""
    });
  };

  const filteredProviders = providers.filter(provider => {
    const statusMatch = selectedFilter.status === "all" || provider.status === selectedFilter.status;
    const typeMatch = selectedFilter.type === "all" || provider.type === selectedFilter.type;
    return statusMatch && typeMatch;
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Proveedores</CardTitle>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Proveedor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProvider ? "Editar Proveedor" : "Agregar Nuevo Proveedor"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input
                    name="company"
                    placeholder="Nombre de la Empresa"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    name="contact"
                    placeholder="Nombre del Contacto"
                    value={formData.contact}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Select
                    value={formData.type}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Madera">Madera</SelectItem>
                      <SelectItem value="Herramientas">Herramientas</SelectItem>
                      <SelectItem value="Insumos">Insumos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Input
                    name="address"
                    placeholder="Dirección"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <Button onClick={handleSubmit}>
                  {editingProvider ? "Guardar Cambios" : "Guardar Proveedor"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Select
              value={selectedFilter.status}
              onValueChange={(value) => setSelectedFilter(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedFilter.type}
              onValueChange={(value) => setSelectedFilter(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Madera">Madera</SelectItem>
                <SelectItem value="Herramientas">Herramientas</SelectItem>
                <SelectItem value="Insumos">Insumos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Empresa</th>
                  <th className="text-left p-4">Contacto</th>
                  <th className="text-left p-4">Tipo</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Última Compra</th>
                  <th className="text-left p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((provider) => (
                  <tr key={provider.id} className="border-b">
                    <td className="p-4">{provider.company}</td>
                    <td className="p-4">
                      <div>{provider.contact}</div>
                      <div className="text-sm text-gray-500">{provider.email}</div>
                    </td>
                    <td className="p-4">{provider.type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        provider.status === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="p-4">{provider.lastPurchase}</td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(provider)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderManagement;
