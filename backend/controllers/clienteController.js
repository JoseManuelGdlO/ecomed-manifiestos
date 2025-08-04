const { Cliente, Destino, Transportista } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los clientes con paginación y filtros
const getAllClientes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      zona,
      delegacion,
      estado,
      id_destino,
      id_transportista,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    // Configurar paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Construir filtros
    const whereClause = {
      deleted_at: null // Solo clientes activos
    };

    // Filtro de búsqueda general
    if (search) {
      whereClause[Op.or] = [
        { numero_registro_ambiental: { [Op.like]: `%${search}%` } },
        { nombre_razon_social: { [Op.like]: `%${search}%` } },
        { correo: { [Op.like]: `%${search}%` } },
        { telefono: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filtros específicos
    if (zona) {
      whereClause.zona = { [Op.like]: `%${zona}%` };
    }

    if (delegacion) {
      whereClause.delegacion = { [Op.like]: `%${delegacion}%` };
    }

    if (estado) {
      whereClause.estado = { [Op.like]: `%${estado}%` };
    }

    if (id_destino) {
      whereClause.id_destino = parseInt(id_destino);
    }

    if (id_transportista) {
      whereClause.id_transportista = parseInt(id_transportista);
    }

    // Validar ordenamiento
    const allowedSortFields = [
      'id', 'numero_registro_ambiental', 'nombre_razon_social', 
      'zona', 'delegacion', 'estado', 'created_at', 'updated_at'
    ];
    
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Realizar consulta con paginación
    const { count, rows: clientes } = await Cliente.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Destino,
          as: 'destino',
          attributes: ['id', 'nombre', 'razon_social']
        },
        {
          model: Transportista,
          as: 'transportista',
          attributes: ['id', 'razon_social', 'placa']
        }
      ],
      order: [[validSortBy, validSortOrder]],
      limit: limitNum,
      offset: offset,
      paranoid: true
    });

    // Calcular información de paginación
    const totalPages = Math.ceil(count / limitNum);
    const currentPage = parseInt(page);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    res.json({
      success: true,
      data: clientes,
      pagination: {
        total: count,
        totalPages,
        currentPage,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? currentPage + 1 : null,
        prevPage: hasPrevPage ? currentPage - 1 : null
      },
      filters: {
        search: search || null,
        zona: zona || null,
        delegacion: delegacion || null,
        estado: estado || null,
        id_destino: id_destino || null,
        id_transportista: id_transportista || null,
        sortBy: validSortBy,
        sortOrder: validSortOrder
      }
    });

  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener opciones de filtros disponibles
const getClienteFilters = async (req, res) => {
  try {
    // Obtener zonas únicas
    const zonas = await Cliente.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('zona')), 'zona']],
      where: {
        zona: { [Op.ne]: null },
        deleted_at: null
      },
      raw: true
    });

    // Obtener delegaciones únicas
    const delegaciones = await Cliente.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('delegacion')), 'delegacion']],
      where: {
        delegacion: { [Op.ne]: null },
        deleted_at: null
      },
      raw: true
    });

    // Obtener estados únicos
    const estados = await Cliente.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('estado')), 'estado']],
      where: {
        estado: { [Op.ne]: null },
        deleted_at: null
      },
      raw: true
    });

    // Obtener destinos disponibles
    const destinos = await Destino.findAll({
      attributes: ['id', 'nombre', 'razon_social'],
      where: { deleted_at: null },
      order: [['nombre', 'ASC']]
    });

    // Obtener transportistas disponibles
    const transportistas = await Transportista.findAll({
      attributes: ['id', 'razon_social', 'placa'],
      where: { deleted_at: null },
      order: [['razon_social', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        zonas: zonas.map(z => z.zona).filter(Boolean).sort(),
        delegaciones: delegaciones.map(d => d.delegacion).filter(Boolean).sort(),
        estados: estados.map(e => e.estado).filter(Boolean).sort(),
        destinos,
        transportistas
      }
    });

  } catch (error) {
    console.error('Error al obtener filtros:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener cliente por ID (solo activos)
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id, {
      include: [
        {
          model: Destino,
          as: 'destino',
          attributes: ['id', 'nombre', 'razon_social', 'codigo_postal', 'calle', 'colonia', 'delegacion', 'estado']
        },
        {
          model: Transportista,
          as: 'transportista',
          attributes: ['id', 'razon_social', 'placa', 'tipo_vehiculo', 'ruta_empresa']
        }
      ],
      paranoid: true // Solo clientes no eliminados
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      data: cliente
    });

  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo cliente
const createCliente = async (req, res) => {
  try {
    const { 
      numero_registro_ambiental, 
      nombre_razon_social, 
      codigo_postal, 
      calle, 
      num_ext, 
      num_int, 
      colonia, 
      delegacion, 
      estado, 
      telefono, 
      correo, 
      zona, 
      id_destino, 
      id_transportista 
    } = req.body;

    // Verificar si el destino existe
    const destino = await Destino.findByPk(id_destino, { paranoid: true });
    if (!destino) {
      return res.status(400).json({
        success: false,
        message: 'El destino especificado no existe'
      });
    }

    // Verificar si el transportista existe
    const transportista = await Transportista.findByPk(id_transportista, { paranoid: true });
    if (!transportista) {
      return res.status(400).json({
        success: false,
        message: 'El transportista especificado no existe'
      });
    }

    // Crear nuevo cliente
    const newCliente = await Cliente.create({
      numero_registro_ambiental,
      nombre_razon_social,
      codigo_postal,
      calle,
      num_ext,
      num_int,
      colonia,
      delegacion,
      estado,
      telefono,
      correo,
      zona,
      id_destino,
      id_transportista
    });

    // Obtener el cliente creado con sus relaciones
    const clienteCreado = await Cliente.findByPk(newCliente.id, {
      include: [
        {
          model: Destino,
          as: 'destino',
          attributes: ['id', 'nombre', 'razon_social']
        },
        {
          model: Transportista,
          as: 'transportista',
          attributes: ['id', 'razon_social', 'placa']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: clienteCreado
    });

  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar cliente
const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      numero_registro_ambiental, 
      nombre_razon_social, 
      codigo_postal, 
      calle, 
      num_ext, 
      num_int, 
      colonia, 
      delegacion, 
      estado, 
      telefono, 
      correo, 
      zona, 
      id_destino, 
      id_transportista 
    } = req.body;

    const cliente = await Cliente.findByPk(id, { paranoid: true });
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Verificar si el destino existe (si se está actualizando)
    if (id_destino) {
      const destino = await Destino.findByPk(id_destino, { paranoid: true });
      if (!destino) {
        return res.status(400).json({
          success: false,
          message: 'El destino especificado no existe'
        });
      }
    }

    // Verificar si el transportista existe (si se está actualizando)
    if (id_transportista) {
      const transportista = await Transportista.findByPk(id_transportista, { paranoid: true });
      if (!transportista) {
        return res.status(400).json({
          success: false,
          message: 'El transportista especificado no existe'
        });
      }
    }

    // Actualizar cliente
    await cliente.update({
      numero_registro_ambiental: numero_registro_ambiental !== undefined ? numero_registro_ambiental : cliente.numero_registro_ambiental,
      nombre_razon_social: nombre_razon_social || cliente.nombre_razon_social,
      codigo_postal: codigo_postal || cliente.codigo_postal,
      calle: calle || cliente.calle,
      num_ext: num_ext || cliente.num_ext,
      num_int: num_int !== undefined ? num_int : cliente.num_int,
      colonia: colonia || cliente.colonia,
      delegacion: delegacion || cliente.delegacion,
      estado: estado || cliente.estado,
      telefono: telefono !== undefined ? telefono : cliente.telefono,
      correo: correo !== undefined ? correo : cliente.correo,
      zona: zona || cliente.zona,
      id_destino: id_destino || cliente.id_destino,
      id_transportista: id_transportista || cliente.id_transportista
    });

    // Obtener el cliente actualizado con sus relaciones
    const clienteActualizado = await Cliente.findByPk(id, {
      include: [
        {
          model: Destino,
          as: 'destino',
          attributes: ['id', 'nombre', 'razon_social']
        },
        {
          model: Transportista,
          as: 'transportista',
          attributes: ['id', 'razon_social', 'placa']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: clienteActualizado
    });

  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar cliente (baja lógica)
const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id, { paranoid: true });
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    await cliente.destroy(); // Soft delete

    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Restaurar cliente eliminado
const restoreCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id, { paranoid: false });
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    if (!cliente.deleted_at) {
      return res.status(400).json({
        success: false,
        message: 'El cliente no está eliminado'
      });
    }

    await cliente.restore();

    res.json({
      success: true,
      message: 'Cliente restaurado exitosamente'
    });

  } catch (error) {
    console.error('Error al restaurar cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar cliente permanentemente
const forceDeleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id, { paranoid: false });
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    await cliente.destroy({ force: true }); // Hard delete

    res.json({
      success: true,
      message: 'Cliente eliminado permanentemente'
    });

  } catch (error) {
    console.error('Error al eliminar cliente permanentemente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener clientes eliminados
const getDeletedClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [
        {
          model: Destino,
          as: 'destino',
          attributes: ['id', 'nombre', 'razon_social']
        },
        {
          model: Transportista,
          as: 'transportista',
          attributes: ['id', 'razon_social', 'placa']
        }
      ],
      order: [['deleted_at', 'DESC']],
      paranoid: false,
      where: {
        deleted_at: {
          [require('sequelize').Op.ne]: null
        }
      }
    });

    res.json({
      success: true,
      data: clientes
    });

  } catch (error) {
    console.error('Error al obtener clientes eliminados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

const bulkUploadClientes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha proporcionado ningún archivo'
      });
    }

    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    let clientes = [];

    // Procesar archivo según su extensión
    if (fileExtension === 'csv') {
      const csv = require('csv-parser');
      const fs = require('fs');
      
      return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            try {
              clientes = results;
              await processClientes(clientes, res);
              // Limpiar archivo temporal
              fs.unlinkSync(req.file.path);
            } catch (error) {
              fs.unlinkSync(req.file.path);
              reject(error);
            }
          })
          .on('error', (error) => {
            fs.unlinkSync(req.file.path);
            reject(error);
          });
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const XLSX = require('xlsx');
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      clientes = XLSX.utils.sheet_to_json(worksheet);
      
      // Limpiar archivo temporal
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
      
      await processClientes(clientes, res);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Formato de archivo no soportado. Use CSV o Excel (.xlsx, .xls)'
      });
    }
  } catch (error) {
    console.error('Error en carga masiva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const processClientes = async (clientes, res) => {
  const resultados = {
    exitosos: [],
    fallidos: [],
    total: clientes.length
  };

  for (let i = 0; i < clientes.length; i++) {
    const clienteData = clientes[i];
    
    try {
      // Validar datos requeridos
      if (!clienteData.numero_registro_ambiental || !clienteData.nombre_razon_social) {
        resultados.fallidos.push({
          fila: i + 1,
          datos: clienteData,
          error: 'Faltan campos requeridos: numero_registro_ambiental o nombre_razon_social'
        });
        continue;
      }

      // Verificar si el cliente ya existe
      const clienteExistente = await Cliente.findOne({
        where: {
          numero_registro_ambiental: clienteData.numero_registro_ambiental
        }
      });

      if (clienteExistente) {
        resultados.fallidos.push({
          fila: i + 1,
          datos: clienteData,
          error: 'Cliente ya existe con ese número de registro ambiental'
        });
        continue;
      }

      // Crear el cliente
      const nuevoCliente = await Cliente.create({
        numero_registro_ambiental: clienteData.numero_registro_ambiental,
        nombre_razon_social: clienteData.nombre_razon_social,
        codigo_postal: clienteData.codigo_postal || null,
        calle: clienteData.calle || null,
        num_ext: clienteData.num_ext || null,
        num_int: clienteData.num_int || null,
        colonia: clienteData.colonia || null,
        delegacion: clienteData.delegacion || null,
        estado: clienteData.estado || null,
        telefono: clienteData.telefono || null,
        correo: clienteData.correo || null,
        zona: clienteData.zona || null,
        id_destino: clienteData.id_destino ? parseInt(clienteData.id_destino) : null,
        id_transportista: clienteData.id_transportista ? parseInt(clienteData.id_transportista) : null
      });

      resultados.exitosos.push({
        fila: i + 1,
        id: nuevoCliente.id,
        nombre_razon_social: nuevoCliente.nombre_razon_social
      });

    } catch (error) {
      resultados.fallidos.push({
        fila: i + 1,
        datos: clienteData,
        error: error.message
      });
    }
  }

  res.status(200).json({
    success: true,
    message: `Procesamiento completado. ${resultados.exitosos.length} clientes creados exitosamente, ${resultados.fallidos.length} fallidos`,
    data: {
      total: resultados.total,
      exitosos: resultados.exitosos.length,
      fallidos: resultados.fallidos.length,
      detalles_exitosos: resultados.exitosos,
      detalles_fallidos: resultados.fallidos
    }
  });
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  restoreCliente,
  forceDeleteCliente,
  getDeletedClientes,
  bulkUploadClientes,
  getClienteFilters
}; 