const { Manifiesto, Cliente, Residuo, ManifiestoResiduo, Destino, Transportista } = require('../models');
const { Op } = require('sequelize');

// Obtener todos los manifiestos con paginación y filtros
const getAllManifiestos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      numero_libro,
      id_cliente,
      id_destino,
      id_transportista,
      fecha_inicio,
      fecha_fin,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    // Configurar paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Construir filtros
    const whereClause = {
      deleted_at: null // Solo manifiestos activos
    };

    // Filtro de búsqueda general
    if (search) {
      whereClause[Op.or] = [
        { numero_libro: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filtros específicos
    if (numero_libro) {
      whereClause.numero_libro = { [Op.like]: `%${numero_libro}%` };
    }

    if (id_cliente) {
      whereClause.id_cliente = parseInt(id_cliente);
    }

    // Filtros de fecha
    if (fecha_inicio || fecha_fin) {
      whereClause.created_at = {};
      if (fecha_inicio) {
        whereClause.created_at[Op.gte] = new Date(fecha_inicio);
      }
      if (fecha_fin) {
        whereClause.created_at[Op.lte] = new Date(fecha_fin + ' 23:59:59');
      }
    }

    // Construir filtros para includes
    const clienteWhere = {};
    if (id_destino) {
      clienteWhere.id_destino = parseInt(id_destino);
    }
    if (id_transportista) {
      clienteWhere.id_transportista = parseInt(id_transportista);
    }

    // Validar ordenamiento
    const allowedSortFields = [
      'id', 'numero_libro', 'created_at', 'updated_at'
    ];
    
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Realizar consulta con paginación
    const { count, rows: manifiestos } = await Manifiesto.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Cliente, 
          as: 'cliente', 
          attributes: ['id', 'nombre_razon_social', 'numero_registro_ambiental'],
          where: Object.keys(clienteWhere).length > 0 ? clienteWhere : undefined,
          include: [
            { model: Destino, as: 'destino', attributes: ['id', 'nombre', 'razon_social'] },
            { model: Transportista, as: 'transportista', attributes: ['id', 'razon_social', 'placa'] }
          ]
        },
        {
          model: Residuo,
          as: 'residuos',
          attributes: ['id', 'nombre', 'descripcion'],
          through: {
            attributes: ['cantidad', 'unidad_medida']
          }
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
      data: manifiestos,
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
        numero_libro: numero_libro || null,
        id_cliente: id_cliente || null,
        id_destino: id_destino || null,
        id_transportista: id_transportista || null,
        fecha_inicio: fecha_inicio || null,
        fecha_fin: fecha_fin || null,
        sortBy: validSortBy,
        sortOrder: validSortOrder
      }
    });
  } catch (error) {
    console.error('Error al obtener manifiestos:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Obtener manifiesto por ID
const getManifiestoById = async (req, res) => {
  try {
    const { id } = req.params;
    const manifiesto = await Manifiesto.findByPk(id, {
      include: [
        { 
          model: Cliente, 
          as: 'cliente', 
          attributes: ['id', 'nombre_razon_social', 'numero_registro_ambiental'],
          include: [
            { model: Destino, as: 'destino', attributes: ['id', 'nombre', 'razon_social'] },
            { model: Transportista, as: 'transportista', attributes: ['id', 'razon_social', 'placa'] }
          ]
        },
        {
          model: Residuo,
          as: 'residuos',
          attributes: ['id', 'nombre', 'descripcion'],
          through: {
            attributes: ['cantidad', 'unidad_medida']
          }
        }
      ],
      paranoid: true
    });

    if (!manifiesto) {
      return res.status(404).json({ success: false, message: 'Manifiesto no encontrado' });
    }

    res.json({ success: true, data: manifiesto });
  } catch (error) {
    console.error('Error al obtener manifiesto:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Crear nuevo manifiesto
const createManifiesto = async (req, res) => {
  try {
    const { numero_libro, id_cliente, residuos } = req.body;

    // Verificar que el cliente existe
    const cliente = await Cliente.findByPk(id_cliente, { paranoid: true });
    if (!cliente) {
      return res.status(400).json({ success: false, message: 'El cliente especificado no existe' });
    }

    // Verificar que el número de libro sea único
    const manifiestoExistente = await Manifiesto.findOne({ 
      where: { numero_libro },
      paranoid: true 
    });
    if (manifiestoExistente) {
      return res.status(400).json({ success: false, message: 'El número de libro ya existe' });
    }

    // Crear el manifiesto
    const newManifiesto = await Manifiesto.create({
      numero_libro,
      id_cliente
    });

    // Agregar residuos al manifiesto si se proporcionan
    if (residuos && Array.isArray(residuos) && residuos.length > 0) {
      for (const residuoData of residuos) {
        const { id_residuo, cantidad, unidad_medida } = residuoData;
        
        // Verificar que el residuo existe
        const residuo = await Residuo.findByPk(id_residuo, { paranoid: true });
        if (!residuo) {
          return res.status(400).json({ 
            success: false, 
            message: `El residuo con ID ${id_residuo} no existe` 
          });
        }

        // Crear la relación en la tabla intermedia
        await ManifiestoResiduo.create({
          id_manifiesto: newManifiesto.id,
          id_residuo,
          cantidad: cantidad || 0,
          unidad_medida: unidad_medida || 'kg'
        });
      }
    }

    // Obtener el manifiesto creado con todas sus relaciones
    const manifiestoCreado = await Manifiesto.findByPk(newManifiesto.id, {
      include: [
        { 
          model: Cliente, 
          as: 'cliente', 
          attributes: ['id', 'nombre_razon_social', 'numero_registro_ambiental'],
          include: [
            { model: Destino, as: 'destino', attributes: ['id', 'nombre', 'razon_social'] },
            { model: Transportista, as: 'transportista', attributes: ['id', 'razon_social', 'placa'] }
          ]
        },
        {
          model: Residuo,
          as: 'residuos',
          attributes: ['id', 'nombre', 'descripcion'],
          through: {
            attributes: ['cantidad', 'unidad_medida']
          }
        }
      ]
    });

    res.status(201).json({ 
      success: true, 
      message: 'Manifiesto creado exitosamente', 
      data: manifiestoCreado 
    });
  } catch (error) {
    console.error('Error al crear manifiesto:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Actualizar manifiesto
const updateManifiesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_libro, id_cliente, residuos } = req.body;

    const manifiesto = await Manifiesto.findByPk(id, { paranoid: true });
    if (!manifiesto) {
      return res.status(404).json({ success: false, message: 'Manifiesto no encontrado' });
    }

    // Verificar que el cliente existe si se va a actualizar
    if (id_cliente) {
      const cliente = await Cliente.findByPk(id_cliente, { paranoid: true });
      if (!cliente) {
        return res.status(400).json({ success: false, message: 'El cliente especificado no existe' });
      }
    }

    // Verificar que el número de libro sea único si se va a actualizar
    if (numero_libro && numero_libro !== manifiesto.numero_libro) {
      const manifiestoExistente = await Manifiesto.findOne({ 
        where: { numero_libro },
        paranoid: true 
      });
      if (manifiestoExistente) {
        return res.status(400).json({ success: false, message: 'El número de libro ya existe' });
      }
    }

    // Actualizar el manifiesto
    await manifiesto.update({
      numero_libro: numero_libro || manifiesto.numero_libro,
      id_cliente: id_cliente || manifiesto.id_cliente
    });

    // Actualizar residuos si se proporcionan
    if (residuos && Array.isArray(residuos)) {
      // Eliminar todas las relaciones existentes
      await ManifiestoResiduo.destroy({
        where: { id_manifiesto: id },
        force: true
      });

      // Crear las nuevas relaciones
      for (const residuoData of residuos) {
        const { id_residuo, cantidad, unidad_medida } = residuoData;
        
        // Verificar que el residuo existe
        const residuo = await Residuo.findByPk(id_residuo, { paranoid: true });
        if (!residuo) {
          return res.status(400).json({ 
            success: false, 
            message: `El residuo con ID ${id_residuo} no existe` 
          });
        }

        // Crear la nueva relación
        await ManifiestoResiduo.create({
          id_manifiesto: id,
          id_residuo,
          cantidad: cantidad || 0,
          unidad_medida: unidad_medida || 'kg'
        });
      }
    }

    // Obtener el manifiesto actualizado con todas sus relaciones
    const manifiestoActualizado = await Manifiesto.findByPk(id, {
      include: [
        { 
          model: Cliente, 
          as: 'cliente', 
          attributes: ['id', 'nombre_razon_social', 'numero_registro_ambiental'],
          include: [
            { model: Destino, as: 'destino', attributes: ['id', 'nombre', 'razon_social'] },
            { model: Transportista, as: 'transportista', attributes: ['id', 'razon_social', 'placa'] }
          ]
        },
        {
          model: Residuo,
          as: 'residuos',
          attributes: ['id', 'nombre', 'descripcion'],
          through: {
            attributes: ['cantidad', 'unidad_medida']
          }
        }
      ]
    });

    res.json({ 
      success: true, 
      message: 'Manifiesto actualizado exitosamente', 
      data: manifiestoActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar manifiesto:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Eliminar manifiesto (baja lógica)
const deleteManifiesto = async (req, res) => {
  try {
    const { id } = req.params;
    const manifiesto = await Manifiesto.findByPk(id, { paranoid: true });
    
    if (!manifiesto) {
      return res.status(404).json({ success: false, message: 'Manifiesto no encontrado' });
    }

    await manifiesto.destroy();
    res.json({ success: true, message: 'Manifiesto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar manifiesto:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Restaurar manifiesto
const restoreManifiesto = async (req, res) => {
  try {
    const { id } = req.params;
    const manifiesto = await Manifiesto.findByPk(id, { paranoid: false });
    
    if (!manifiesto) {
      return res.status(404).json({ success: false, message: 'Manifiesto no encontrado' });
    }

    if (!manifiesto.deleted_at) {
      return res.status(400).json({ success: false, message: 'El manifiesto no está eliminado' });
    }

    await manifiesto.restore();
    res.json({ success: true, message: 'Manifiesto restaurado exitosamente' });
  } catch (error) {
    console.error('Error al restaurar manifiesto:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Eliminación permanente
const forceDeleteManifiesto = async (req, res) => {
  try {
    const { id } = req.params;
    const manifiesto = await Manifiesto.findByPk(id, { paranoid: false });
    
    if (!manifiesto) {
      return res.status(404).json({ success: false, message: 'Manifiesto no encontrado' });
    }

    // Eliminar permanentemente las relaciones con residuos
    await ManifiestoResiduo.destroy({
      where: { id_manifiesto: id },
      force: true
    });

    // Eliminar permanentemente el manifiesto
    await manifiesto.destroy({ force: true });
    res.json({ success: true, message: 'Manifiesto eliminado permanentemente' });
  } catch (error) {
    console.error('Error al eliminar permanentemente manifiesto:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Obtener manifiestos eliminados
const getDeletedManifiestos = async (req, res) => {
  try {
    const manifiestos = await Manifiesto.findAll({
      include: [
        { 
          model: Cliente, 
          as: 'cliente', 
          attributes: ['id', 'nombre_razon_social', 'numero_registro_ambiental'],
          include: [
            { model: Destino, as: 'destino', attributes: ['id', 'nombre', 'razon_social'] },
            { model: Transportista, as: 'transportista', attributes: ['id', 'razon_social', 'placa'] }
          ]
        },
        {
          model: Residuo,
          as: 'residuos',
          attributes: ['id', 'nombre', 'descripcion'],
          through: {
            attributes: ['cantidad', 'unidad_medida']
          }
        }
      ],
      order: [['deleted_at', 'DESC']],
      paranoid: false,
      where: {
        deleted_at: { [Op.ne]: null }
      }
    });
    res.json({ success: true, data: manifiestos });
  } catch (error) {
    console.error('Error al obtener manifiestos eliminados:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Obtener opciones de filtros disponibles para manifiestos
const getManifiestoFilters = async (req, res) => {
  try {
    // Obtener clientes disponibles
    const clientes = await Cliente.findAll({
      attributes: ['id', 'nombre_razon_social', 'numero_registro_ambiental'],
      where: { deleted_at: null },
      order: [['nombre_razon_social', 'ASC']]
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

    // Obtener residuos disponibles
    const residuos = await Residuo.findAll({
      attributes: ['id', 'nombre', 'descripcion'],
      where: { deleted_at: null },
      order: [['nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        clientes,
        destinos,
        transportistas,
        residuos
      }
    });

  } catch (error) {
    console.error('Error al obtener filtros de manifiestos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllManifiestos,
  getManifiestoById,
  createManifiesto,
  updateManifiesto,
  deleteManifiesto,
  restoreManifiesto,
  forceDeleteManifiesto,
  getDeletedManifiestos,
  getManifiestoFilters
}; 