const { Role, User, Residuo, Destino, Vehiculo, Transportista, Cliente, Manifiesto, ManifiestoResiduo, ManifiestoEstado } = require('../models');
const { sequelize } = require('../config/database');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Crear roles iniciales
    const roles = await Role.bulkCreate([
      { nombre: 'admin' },
      { nombre: 'usuario' },
      { nombre: 'editor' }
    ], {
      ignoreDuplicates: true,
      paranoid: true // Solo crear roles activos
    });

    console.log('✅ Roles creados:', roles.map(r => r.nombre));

    // Crear usuario admin por defecto
    const adminRole = await Role.findOne({ where: { nombre: 'admin' } });
    
    if (adminRole) {
      const adminUser = await User.findOrCreate({
        where: { correo: 'admin@ecomed.com' },
        defaults: {
          nombre_completo: 'Administrador del Sistema',
          correo: 'admin@ecomed.com',
          contrasena: 'admin123',
          id_rol: adminRole.id
        }
      });

      if (adminUser[1]) {
        console.log('✅ Usuario admin creado:', adminUser[0].correo);
      } else {
        console.log('ℹ️ Usuario admin ya existe');
      }
    }

    // Crear algunos usuarios de ejemplo
    const userRole = await Role.findOne({ where: { nombre: 'usuario' } });
    
    if (userRole) {
      const exampleUsers = await User.bulkCreate([
        {
          nombre_completo: 'Juan Pérez',
          correo: 'juan@ecomed.com',
          contrasena: '123456',
          id_rol: userRole.id
        },
        {
          nombre_completo: 'María García',
          correo: 'maria@ecomed.com',
          contrasena: '123456',
          id_rol: userRole.id
        }
      ], {
        ignoreDuplicates: true,
        paranoid: true // Solo crear usuarios activos
      });

      console.log('✅ Usuarios de ejemplo creados:', exampleUsers.length);
    }

    // Crear residuos de ejemplo
    const residuos = await Residuo.bulkCreate([
      {
        nombre: 'Papel y Cartón',
        descripcion: 'Residuos de papel, cartón, periódicos, revistas y embalajes de papel'
      },
      {
        nombre: 'Plásticos',
        descripcion: 'Botellas, envases, bolsas y otros productos plásticos'
      },
      {
        nombre: 'Vidrio',
        descripcion: 'Botellas, frascos y otros envases de vidrio'
      },
      {
        nombre: 'Metales',
        descripcion: 'Latas de aluminio, envases de acero y otros metales'
      },
      {
        nombre: 'Orgánicos',
        descripcion: 'Restos de comida, cáscaras de frutas y verduras'
      },
      {
        nombre: 'Electrónicos',
        descripcion: 'Computadoras, teléfonos, electrodomésticos y otros dispositivos electrónicos'
      }
    ], {
      ignoreDuplicates: true,
      paranoid: true // Solo crear residuos activos
    });

    console.log('✅ Residuos de ejemplo creados:', residuos.length);

    // Crear destinos de ejemplo
    const destinos = await Destino.bulkCreate([
      {
        nombre: 'Centro de Reciclaje Metropolitano',
        descripcion: 'Centro de reciclaje para procesamiento de materiales reutilizables',
        razon_social: 'Reciclaje Metropolitano S.A. de C.V.',
        codigo_postal: '07700',
        calle: 'Av. Industrial',
        num_ext: '1234',
        num_int: 'A',
        colonia: 'Industrial',
        delegacion: 'Gustavo A. Madero',
        estado: 'Ciudad de México',
        telefono: '5555-123-4567',
        correo_electronico: 'info@reciclajemetropolitano.com',
        autorizacion_semarnat: 'SEMARNAT-2024-001',
        nombre_encargado: 'Ing. Carlos Mendoza',
        cargo_encargado: 'Director General',
        observaciones: 'Centro autorizado para reciclaje de papel, plástico y metales'
      },
      {
        nombre: 'Relleno Sanitario Norte',
        descripcion: 'Sitio de disposición final para residuos no reciclables',
        razon_social: 'Gestión Ambiental del Norte S.A.',
        codigo_postal: '54700',
        calle: 'Carretera Norte',
        num_ext: 'Km 45',
        num_int: null,
        colonia: 'Ejido San Pedro',
        delegacion: 'Cuautitlán',
        estado: 'Estado de México',
        telefono: '5555-987-6543',
        correo_electronico: 'contacto@ganorte.com',
        autorizacion_semarnat: 'SEMARNAT-2024-002',
        nombre_encargado: 'Lic. María González',
        cargo_encargado: 'Gerente de Operaciones',
        observaciones: 'Relleno sanitario con capacidad de 500 toneladas diarias'
      },
      {
        nombre: 'Planta de Incineración Industrial',
        descripcion: 'Proceso de combustión controlada para reducción de volumen',
        razon_social: 'Tratamiento Térmico Industrial S.A.',
        codigo_postal: '54000',
        calle: 'Zona Industrial',
        num_ext: '567',
        num_int: 'B',
        colonia: 'Parque Industrial',
        delegacion: 'Tlalnepantla',
        estado: 'Estado de México',
        telefono: '5555-456-7890',
        correo_electronico: 'operaciones@tti.com.mx',
        autorizacion_semarnat: 'SEMARNAT-2024-003',
        nombre_encargado: 'Dr. Roberto Silva',
        cargo_encargado: 'Director Técnico',
        observaciones: 'Planta de incineración con sistema de control de emisiones'
      },
      {
        nombre: 'Centro de Compostaje Orgánico',
        descripcion: 'Proceso biológico para convertir residuos orgánicos en abono',
        razon_social: 'Compostaje Sustentable S.A. de C.V.',
        codigo_postal: '16090',
        calle: 'Camino Rural',
        num_ext: '890',
        num_int: null,
        colonia: 'Ejido Verde',
        delegacion: 'Xochimilco',
        estado: 'Ciudad de México',
        telefono: '5555-321-0987',
        correo_electronico: 'ventas@compostaje.com',
        autorizacion_semarnat: 'SEMARNAT-2024-004',
        nombre_encargado: 'Biól. Ana López',
        cargo_encargado: 'Responsable Técnico',
        observaciones: 'Producción de abono orgánico certificado'
      },
      {
        nombre: 'Centro de Reutilización de Materiales',
        descripcion: 'Centro de clasificación para reutilización directa de materiales',
        razon_social: 'Reutilización Inteligente S.A.',
        codigo_postal: '09000',
        calle: 'Calle Comercial',
        num_ext: '234',
        num_int: 'C',
        colonia: 'Centro Comercial',
        delegacion: 'Iztapalapa',
        estado: 'Ciudad de México',
        telefono: '5555-654-3210',
        correo_electronico: 'info@reutilizacion.com',
        autorizacion_semarnat: 'SEMARNAT-2024-005',
        nombre_encargado: 'Lic. Fernando Ruiz',
        cargo_encargado: 'Coordinador de Proyectos',
        observaciones: 'Especializado en reutilización de muebles y equipos'
      },
      {
        nombre: 'Instalación de Tratamiento Especial',
        descripcion: 'Instalación para tratamiento de residuos peligrosos o especiales',
        razon_social: 'Tratamiento Especializado S.A. de C.V.',
        codigo_postal: '05000',
        calle: 'Av. Tecnológica',
        num_ext: '789',
        num_int: 'D',
        colonia: 'Parque Científico',
        delegacion: 'Cuajimalpa',
        estado: 'Ciudad de México',
        telefono: '5555-789-0123',
        correo_electronico: 'seguridad@tratamientoespecial.com',
        autorizacion_semarnat: 'SEMARNAT-2024-006',
        nombre_encargado: 'Ing. Patricia Morales',
        cargo_encargado: 'Directora de Seguridad',
        observaciones: 'Instalación certificada para manejo de residuos peligrosos'
      }
    ], {
      ignoreDuplicates: true,
      paranoid: true // Solo crear destinos activos
    });

    console.log('✅ Destinos de ejemplo creados:', destinos.length);

    // Crear vehículos de ejemplo
    const vehiculos = await Vehiculo.bulkCreate([
      {
        marca: 'Toyota',
        nombre: 'Camión de Recolección',
        descripcion: 'Camión para recolección de residuos urbanos',
        placa: 'ABC-123'
      },
      {
        marca: 'Ford',
        nombre: 'Furgón de Transporte',
        descripcion: 'Furgón para transporte de residuos especiales',
        placa: 'XYZ-789'
      },
      {
        marca: 'Mercedes-Benz',
        nombre: 'Camión Compactador',
        descripcion: 'Camión compactador para residuos sólidos',
        placa: 'DEF-456'
      },
      {
        marca: 'Volvo',
        nombre: 'Camión de Reciclaje',
        descripcion: 'Camión especializado para transporte de materiales reciclables',
        placa: 'GHI-789'
      },
      {
        marca: 'Isuzu',
        nombre: 'Camión de Residuos Orgánicos',
        descripcion: 'Camión para recolección de residuos orgánicos',
        placa: 'JKL-012'
      },
      {
        marca: 'Hino',
        nombre: 'Camión de Residuos Peligrosos',
        descripcion: 'Camión especializado para residuos peligrosos',
        placa: 'MNO-345'
      }
    ], {
      ignoreDuplicates: true,
      paranoid: true // Solo crear vehículos activos
    });

    console.log('✅ Vehículos de ejemplo creados:', vehiculos.length);

    // Crear transportistas de ejemplo
    const transportistas = await Transportista.bulkCreate([
      {
        razon_social: 'Transportes Ecológicos del Valle S.A. de C.V.',
        codigo_postal: '07700',
        calle: 'Av. Industrial',
        num_ext: '567',
        num_int: 'A',
        colonia: 'Industrial',
        delegacion: 'Gustavo A. Madero',
        estado: 'Ciudad de México',
        telefono: '5555-111-2222',
        correo_electronico: 'contacto@transportesecologicos.com',
        autorizacion_semarnat: 'SEMARNAT-TRANS-2024-001',
        permiso_sct: 'SCT-TRANS-2024-001',
        tipo_vehiculo: 'Camión de Carga',
        placa: 'ABC-123',
        ruta_empresa: 'Ruta Norte - Centro de Reciclaje'
      },
      {
        razon_social: 'Logística Ambiental Especializada S.A.',
        codigo_postal: '54000',
        calle: 'Zona Industrial',
        num_ext: '789',
        num_int: 'B',
        colonia: 'Parque Industrial',
        delegacion: 'Tlalnepantla',
        estado: 'Estado de México',
        telefono: '5555-333-4444',
        correo_electronico: 'operaciones@logisticaambiental.com',
        autorizacion_semarnat: 'SEMARNAT-TRANS-2024-002',
        permiso_sct: 'SCT-TRANS-2024-002',
        tipo_vehiculo: 'Furgón Refrigerado',
        placa: 'XYZ-789',
        ruta_empresa: 'Ruta Este - Planta de Incineración'
      },
      {
        razon_social: 'Transportes Sustentables del Sur S.A.',
        codigo_postal: '16090',
        calle: 'Camino Rural',
        num_ext: '123',
        num_int: null,
        colonia: 'Ejido Verde',
        delegacion: 'Xochimilco',
        estado: 'Ciudad de México',
        telefono: '5555-555-6666',
        correo_electronico: 'ventas@transportessustentables.com',
        autorizacion_semarnat: 'SEMARNAT-TRANS-2024-003',
        permiso_sct: 'SCT-TRANS-2024-003',
        tipo_vehiculo: 'Camión Compactador',
        placa: 'DEF-456',
        ruta_empresa: 'Ruta Sur - Centro de Compostaje'
      },
      {
        razon_social: 'Servicios de Transporte Verde S.A. de C.V.',
        codigo_postal: '09000',
        calle: 'Calle Comercial',
        num_ext: '456',
        num_int: 'C',
        colonia: 'Centro Comercial',
        delegacion: 'Iztapalapa',
        estado: 'Ciudad de México',
        telefono: '5555-777-8888',
        correo_electronico: 'info@transporteverde.com',
        autorizacion_semarnat: 'SEMARNAT-TRANS-2024-004',
        permiso_sct: 'SCT-TRANS-2024-004',
        tipo_vehiculo: 'Camión de Recolección',
        placa: 'GHI-789',
        ruta_empresa: 'Ruta Centro - Centro de Reutilización'
      },
      {
        razon_social: 'Transportes Especializados en Residuos S.A.',
        codigo_postal: '05000',
        calle: 'Av. Tecnológica',
        num_ext: '321',
        num_int: 'D',
        colonia: 'Parque Científico',
        delegacion: 'Cuajimalpa',
        estado: 'Ciudad de México',
        telefono: '5555-999-0000',
        correo_electronico: 'seguridad@transportesespecializados.com',
        autorizacion_semarnat: 'SEMARNAT-TRANS-2024-005',
        permiso_sct: 'SCT-TRANS-2024-005',
        tipo_vehiculo: 'Camión de Residuos Peligrosos',
        placa: 'JKL-012',
        ruta_empresa: 'Ruta Oeste - Instalación de Tratamiento Especial'
      }
    ], {
      ignoreDuplicates: true,
      paranoid: true // Solo crear transportistas activos
    });

    console.log('✅ Transportistas de ejemplo creados:', transportistas.length);

    // Crear clientes de ejemplo
    const clientes = await Cliente.bulkCreate([
      {
        numero_registro_ambiental: 'RA-2024-001',
        nombre_razon_social: 'Industrias del Norte S.A. de C.V.',
        codigo_postal: '07700',
        calle: 'Av. Industrial',
        num_ext: '100',
        num_int: 'A',
        colonia: 'Industrial',
        delegacion: 'Gustavo A. Madero',
        estado: 'Ciudad de México',
        telefono: '5555-111-0001',
        correo: 'contacto@industriasnorte.com',
        zona: 'Zona Norte',
        id_destino: 1, // Centro de Reciclaje Metropolitano
        id_transportista: 1 // Transportes Ecológicos del Valle
      },
      {
        numero_registro_ambiental: 'RA-2024-002',
        nombre_razon_social: 'Comercial del Sur S.A.',
        codigo_postal: '09000',
        calle: 'Calle Comercial',
        num_ext: '200',
        num_int: 'B',
        colonia: 'Centro Comercial',
        delegacion: 'Iztapalapa',
        estado: 'Ciudad de México',
        telefono: '5555-222-0002',
        correo: 'ventas@comercialsur.com',
        zona: 'Zona Sur',
        id_destino: 5, // Centro de Reutilización de Materiales
        id_transportista: 4 // Servicios de Transporte Verde
      },
      {
        numero_registro_ambiental: 'RA-2024-003',
        nombre_razon_social: 'Empresa de Servicios del Este',
        codigo_postal: '54000',
        calle: 'Zona Industrial',
        num_ext: '300',
        num_int: 'C',
        colonia: 'Parque Industrial',
        delegacion: 'Tlalnepantla',
        estado: 'Estado de México',
        telefono: '5555-333-0003',
        correo: 'servicios@empresaeste.com',
        zona: 'Zona Este',
        id_destino: 3, // Planta de Incineración Industrial
        id_transportista: 2 // Logística Ambiental Especializada
      },
      {
        numero_registro_ambiental: 'RA-2024-004',
        nombre_razon_social: 'Compañía Agrícola del Valle',
        codigo_postal: '16090',
        calle: 'Camino Rural',
        num_ext: '400',
        num_int: null,
        colonia: 'Ejido Verde',
        delegacion: 'Xochimilco',
        estado: 'Ciudad de México',
        telefono: '5555-444-0004',
        correo: 'agricola@companiavalle.com',
        zona: 'Zona Rural',
        id_destino: 4, // Centro de Compostaje Orgánico
        id_transportista: 3 // Transportes Sustentables del Sur
      },
      {
        numero_registro_ambiental: 'RA-2024-005',
        nombre_razon_social: 'Laboratorio Químico Especializado',
        codigo_postal: '05000',
        calle: 'Av. Tecnológica',
        num_ext: '500',
        num_int: 'D',
        colonia: 'Parque Científico',
        delegacion: 'Cuajimalpa',
        estado: 'Ciudad de México',
        telefono: '5555-555-0005',
        correo: 'quimica@laboratorioespecializado.com',
        zona: 'Zona Tecnológica',
        id_destino: 6, // Instalación de Tratamiento Especial
        id_transportista: 5 // Transportes Especializados en Residuos
      },
      {
        numero_registro_ambiental: 'RA-2024-006',
        nombre_razon_social: 'Restaurante Gourmet Central',
        codigo_postal: '07700',
        calle: 'Av. Industrial',
        num_ext: '600',
        num_int: 'E',
        colonia: 'Industrial',
        delegacion: 'Gustavo A. Madero',
        estado: 'Ciudad de México',
        telefono: '5555-666-0006',
        correo: 'gourmet@restaurantecentral.com',
        zona: 'Zona Central',
        id_destino: 4, // Centro de Compostaje Orgánico
        id_transportista: 1 // Transportes Ecológicos del Valle
      }
    ], {
      ignoreDuplicates: true,
      paranoid: true // Solo crear clientes activos
    });

    console.log('✅ Clientes de ejemplo creados:', clientes.length);

    // Crear manifiestos de ejemplo
    const manifiestos = await Manifiesto.bulkCreate([
      {
        numero_libro: 'LIB-2024-001',
        id_cliente: 1 // Industrias del Norte S.A. de C.V.
      },
      {
        numero_libro: 'LIB-2024-002',
        id_cliente: 2 // Comercial del Sur S.A. de C.V.
      },
      {
        numero_libro: 'LIB-2024-003',
        id_cliente: 3 // Empresa de Servicios del Este
      },
      {
        numero_libro: 'LIB-2024-004',
        id_cliente: 4 // Compañía Agrícola del Valle
      },
      {
        numero_libro: 'LIB-2024-005',
        id_cliente: 5 // Laboratorio Químico Especializado
      }
    ], {
      ignoreDuplicates: true,
      paranoid: true
    });
    console.log('✅ Manifiestos de ejemplo creados:', manifiestos.length);

    // Crear relaciones entre manifiestos y residuos
    const manifiestoResiduos = await ManifiestoResiduo.bulkCreate([
      // Manifiesto 1 - Industrias del Norte
      {
        id_manifiesto: 1,
        id_residuo: 1, // Papel y Cartón
        cantidad: 500.50,
        unidad_medida: 'kg'
      },
      {
        id_manifiesto: 1,
        id_residuo: 2, // Plásticos
        cantidad: 250.25,
        unidad_medida: 'kg'
      },
      {
        id_manifiesto: 1,
        id_residuo: 4, // Metales
        cantidad: 100.00,
        unidad_medida: 'kg'
      },
      // Manifiesto 2 - Comercial del Sur
      {
        id_manifiesto: 2,
        id_residuo: 1, // Papel y Cartón
        cantidad: 300.00,
        unidad_medida: 'kg'
      },
      {
        id_manifiesto: 2,
        id_residuo: 3, // Vidrio
        cantidad: 150.75,
        unidad_medida: 'kg'
      },
      // Manifiesto 3 - Empresa de Servicios del Este
      {
        id_manifiesto: 3,
        id_residuo: 2, // Plásticos
        cantidad: 400.00,
        unidad_medida: 'kg'
      },
      {
        id_manifiesto: 3,
        id_residuo: 6, // Electrónicos
        cantidad: 50.00,
        unidad_medida: 'kg'
      },
      // Manifiesto 4 - Compañía Agrícola del Valle
      {
        id_manifiesto: 4,
        id_residuo: 5, // Orgánicos
        cantidad: 800.00,
        unidad_medida: 'kg'
      },
      // Manifiesto 5 - Laboratorio Químico Especializado
      {
        id_manifiesto: 5,
        id_residuo: 6, // Electrónicos
        cantidad: 25.50,
        unidad_medida: 'kg'
      },
      {
        id_manifiesto: 5,
        id_residuo: 2, // Plásticos
        cantidad: 75.25,
        unidad_medida: 'kg'
      }
    ], {
      ignoreDuplicates: true,
      paranoid: true
    });
    console.log('✅ Relaciones manifiesto-residuo creadas:', manifiestoResiduos.length);

    // Crear estados de manifiestos de ejemplo (Added)
    const manifiestoEstados = await ManifiestoEstado.bulkCreate([
      {
        id_manifiesto: 1,
        esta_capturado: true,
        esta_entregado: false
      },
      {
        id_manifiesto: 2,
        esta_capturado: true,
        esta_entregado: true
      },
      {
        id_manifiesto: 3,
        esta_capturado: false,
        esta_entregado: false
      },
      {
        id_manifiesto: 4,
        esta_capturado: true,
        esta_entregado: false
      },
      {
        id_manifiesto: 5,
        esta_capturado: false,
        esta_entregado: false
      }
    ], {
      ignoreDuplicates: true,
      paranoid: true
    });
    console.log('✅ Estados de manifiestos creados:', manifiestoEstados.length);

    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('Admin: admin@ecomed.com / admin123');
    console.log('Usuario: juan@ecomed.com / 123456');
    console.log('Usuario: maria@ecomed.com / 123456');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await sequelize.close();
  }
};

// Ejecutar seed si el archivo se ejecuta directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 