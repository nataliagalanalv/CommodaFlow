import { Hardware, HardwareStatus, IHardware } from '../models/Hardware.js';

export const hardwareService = {
  // 1. Obtener todo el inventario desde la DB
  getAll: async (): Promise<IHardware[]> => {
    return await Hardware.find().sort({ createdAt: -1 });
  },
  
  // 2. Buscar por ID (Mongo usa _id, pero Mongoose lo gestiona con findById)
  getById: async (id: string): Promise<IHardware | null> => {
    return await Hardware.findById(id);
  },
  
  // 3. Crear en la base de datos real
  create: async (data: Partial<IHardware>): Promise<IHardware> => {
    // Ya no necesitamos Math.random(), Mongo genera el ID automáticamente
    const newHardware = new Hardware({
      ...data,
      status: data.status || 'available'
    });
    return await newHardware.save();
  },
  
  // 4. Actualizar estado con validación
  updateStatus: async (id: string, newStatus: HardwareStatus): Promise<IHardware | null> => {
    return await Hardware.findByIdAndUpdate(
      id, 
      { status: newStatus }, 
      { 
        new: true,           // Para que devuelva el objeto ya actualizado
        runValidators: true  // Para que respete el enum del Modelo
      }
    );
  }
};