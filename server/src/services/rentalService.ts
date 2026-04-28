import { hardwareService } from './hardwareService.js';

export const rentalService = {
  createRental: async (rentalData: any) => {
    // 1. Buscamos si el equipo existe y está disponible
    const hardware = hardwareService.getById(rentalData.hardwareId);
    
    if (!hardware) throw new Error("Equipo no encontrado");
    if (hardware.status !== 'available') throw new Error("El equipo no está disponible para alquiler");

    // 2. Aquí guardarías el alquiler en tu array de rentals o DB...
    const newRental = { ...rentalData, id: Date.now().toString() };

    // 3. ACTUALIZACIÓN AUTOMÁTICA: Cambiamos el estado del hardware
    hardwareService.updateStatus(rentalData.hardwareId, 'rented');

    return newRental;
  }
};