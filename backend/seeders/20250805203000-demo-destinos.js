'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('destinos', [
      {
        nombre: 'Centro de Disposición Final Norte',
        descripcion: 'Centro autorizado para la disposición final de residuos peligrosos en la zona norte',
        razon_social: 'Disposición Final del Norte S.A. de C.V.',
        codigo_postal: '55000',
        calle: 'Av. Industrial',
        num_ext: '123',
        num_int: 'A',
        colonia: 'Industrial Norte',
        delegacion: 'Gustavo A. Madero',
        estado: 'Ciudad de México',
        telefono: '55-1234-5678',
        correo_electronico: 'contacto@disposicionnorte.com',
        autorizacion_semarnat: 'SEM-2024-001',
        nombre_encargado: 'Juan Pérez',
        cargo_encargado: 'Gerente de Operaciones',
        observaciones: 'Centro operativo 24/7',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Planta de Tratamiento Sur',
        descripcion: 'Planta especializada en el tratamiento de residuos industriales',
        razon_social: 'Tratamiento Industrial del Sur S.A. de C.V.',
        codigo_postal: '14000',
        calle: 'Calle del Tratamiento',
        num_ext: '456',
        num_int: '',
        colonia: 'Industrial Sur',
        delegacion: 'Tlalpan',
        estado: 'Ciudad de México',
        telefono: '55-9876-5432',
        correo_electronico: 'info@tratamientosur.com',
        autorizacion_semarnat: 'SEM-2024-002',
        nombre_encargado: 'María González',
        cargo_encargado: 'Directora Técnica',
        observaciones: 'Especializada en residuos químicos',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Centro de Reciclaje Este',
        descripcion: 'Centro dedicado al reciclaje y reutilización de materiales',
        razon_social: 'Reciclaje del Este S.A. de C.V.',
        codigo_postal: '09000',
        calle: 'Av. del Reciclaje',
        num_ext: '789',
        num_int: 'B',
        colonia: 'Reciclaje',
        delegacion: 'Iztapalapa',
        estado: 'Ciudad de México',
        telefono: '55-5555-1234',
        correo_electronico: 'reciclaje@centroeste.com',
        autorizacion_semarnat: 'SEM-2024-003',
        nombre_encargado: 'Carlos Rodríguez',
        cargo_encargado: 'Supervisor de Reciclaje',
        observaciones: 'Acepta materiales reciclables',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('destinos', null, {});
  }
}; 