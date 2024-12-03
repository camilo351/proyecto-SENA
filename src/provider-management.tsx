import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import "../src/api/server-providers"

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

const BACKEND_URL = 'http://localhost:5000/api/server-provedores';

const ProviderManagement = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [filter, setFilter] = useState({ estado: 'all', tipo: 'all' });
  const [formData, setFormData] = useState({
    empresa: '',
    contacto: '',
    tipo: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BACKEND_URL);
      setProviders(response.data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (currentProvider) {
        await axios.put(${BACKEND_URL}/${currentProvider.id_proveedor}, formData);
        toast({ title: "Proveedor actualizado" });
      } else {
        await axios.post(BACKEND_URL, {
          ...formData,
          id_usuario_registra: 1  // Reemplazar con usuario actual
        });
        toast({ title: "Proveedor creado" });
      }
      fetchProviders();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el proveedor",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (provider) => {
    setCurrentProvider(provider);
    setFormData({
      empresa: provider.empresa,
      contacto: provider.contacto,
      tipo: provider.tipo,
      email: provider.email,
      telefono: provider.telefono,
      direccion: provider.direccion,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(${BACKEND_URL}/${id});
      fetchProviders();
      toast({ title: "Proveedor eliminado" });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proveedor",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setCurrentProvider(null);
    setFormData({
      empresa: '',
      contacto: '',
      tipo: '',
      email: '',
      telefono: '',
      direccion: '',
    });
  };

  const filteredProviders = providers.filter(p => 
    (filter.estado === 'all' || p.estado === filter.estado) &&
    (filter.tipo === 'all' || p.tipo === filter.tipo)
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Proveedores</CardTitle>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proveedor
          </Button>
        </CardHeader>

        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Select 
              onValueChange={(val) => setFilter(prev => ({ ...prev, estado: val }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="A">Activo</SelectItem>
                <SelectItem value="I">Inactivo</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(val) => setFilter(prev => ({ ...prev, tipo: val }))}
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map(provider => (
                <TableRow key={provider.id_proveedor}>
                  <TableCell>{provider.empresa}</TableCell>
                  <TableCell>{provider.contacto}</TableCell>
                  <TableCell>{provider.tipo}</TableCell>
                  <TableCell>{provider.email}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(provider)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(provider.id_proveedor)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                name="empresa"
                placeholder="Empresa"
                value={formData.empresa}
                onChange={handleInputChange}
              />
              <Input
                name="contacto"
                placeholder="Contacto"
                value={formData.contacto}
                onChange={handleInputChange}
              />
              <Select
                value={formData.tipo}
                onValueChange={(val) => setFormData(prev => ({ ...prev, tipo: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Madera">Madera</SelectItem>
                  <SelectItem value="Herramientas">Herramientas</SelectItem>
                  <SelectItem value="Insumos">Insumos</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
              <Input
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleInputChange}
                className="col-span-4"
              />
            </div>

            <Button onClick={handleSubmit}>
              {currentProvider ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderManagement;