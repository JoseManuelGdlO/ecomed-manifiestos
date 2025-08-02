const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para usuarios
const validateUser = [
  body('nombre_completo')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre completo debe tener entre 2 y 100 caracteres'),
  
  body('correo')
    .isEmail()
    .normalizeEmail()
    .withMessage('El correo electrónico no es válido'),
  
  body('contrasena')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('id_rol')
    .isInt({ min: 1 })
    .withMessage('El ID del rol debe ser un número entero válido'),
  
  handleValidationErrors
];

// Validaciones para roles
const validateRole = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre del rol debe tener entre 2 y 50 caracteres'),
  
  handleValidationErrors
];

// Validaciones para residuos
const validateResiduo = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del residuo debe tener entre 2 y 100 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder los 1000 caracteres'),
  
  handleValidationErrors
];

// Validaciones para destinos
const validateDestino = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del destino debe tener entre 2 y 100 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder los 1000 caracteres'),
  
  body('razon_social')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('La razón social debe tener entre 2 y 200 caracteres'),
  
  body('codigo_postal')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('El código postal debe tener entre 5 y 10 caracteres'),
  
  body('calle')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La calle debe tener entre 2 y 100 caracteres'),
  
  body('num_ext')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('El número exterior debe tener entre 1 y 20 caracteres'),
  
  body('num_int')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El número interior no puede exceder los 20 caracteres'),
  
  body('colonia')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La colonia debe tener entre 2 y 100 caracteres'),
  
  body('delegacion')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La delegación debe tener entre 2 y 100 caracteres'),
  
  body('estado')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El estado debe tener entre 2 y 100 caracteres'),
  
  body('telefono')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('El teléfono debe tener entre 10 y 20 caracteres'),
  
  body('correo_electronico')
    .optional()
    .trim()
    .isEmail()
    .withMessage('El correo electrónico debe tener un formato válido')
    .isLength({ max: 100 })
    .withMessage('El correo electrónico no puede exceder los 100 caracteres'),
  
  body('autorizacion_semarnat')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La autorización SEMARNAT debe tener entre 2 y 50 caracteres'),
  
  body('nombre_encargado')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre del encargado no puede exceder los 100 caracteres'),
  
  body('cargo_encargado')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El cargo del encargado no puede exceder los 100 caracteres'),
  
  body('observaciones')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Las observaciones no pueden exceder los 2000 caracteres'),
  
  handleValidationErrors
];

// Validaciones para vehículos
const validateVehiculo = [
  body('marca')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La marca debe tener entre 2 y 50 caracteres'),
  
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del vehículo debe tener entre 2 y 100 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder los 1000 caracteres'),
  
  body('placa')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('La placa no puede exceder los 20 caracteres'),
  
  handleValidationErrors
];

// Validaciones para transportistas
const validateTransportista = [
  body('razon_social')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('La razón social debe tener entre 2 y 200 caracteres'),
  
  body('codigo_postal')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('El código postal debe tener entre 5 y 10 caracteres'),
  
  body('calle')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La calle debe tener entre 2 y 100 caracteres'),
  
  body('num_ext')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('El número exterior debe tener entre 1 y 20 caracteres'),
  
  body('num_int')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El número interior no puede exceder los 20 caracteres'),
  
  body('colonia')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La colonia debe tener entre 2 y 100 caracteres'),
  
  body('delegacion')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La delegación debe tener entre 2 y 100 caracteres'),
  
  body('estado')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El estado debe tener entre 2 y 100 caracteres'),
  
  body('telefono')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('El teléfono debe tener entre 10 y 20 caracteres'),
  
  body('correo_electronico')
    .optional()
    .trim()
    .isEmail()
    .withMessage('El correo electrónico debe tener un formato válido')
    .isLength({ max: 100 })
    .withMessage('El correo electrónico no puede exceder los 100 caracteres'),
  
  body('autorizacion_semarnat')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La autorización SEMARNAT debe tener entre 2 y 50 caracteres'),
  
  body('permiso_sct')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El permiso SCT debe tener entre 2 y 50 caracteres'),
  
  body('tipo_vehiculo')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El tipo de vehículo debe tener entre 2 y 100 caracteres'),
  
  body('placa')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('La placa debe tener entre 2 y 20 caracteres'),
  
  body('ruta_empresa')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('La ruta de empresa debe tener entre 2 y 200 caracteres'),
  
  handleValidationErrors
];

// Validaciones para clientes
const validateCliente = [
  body('numero_registro_ambiental')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El número de registro ambiental no puede exceder los 50 caracteres'),
  
  body('nombre_razon_social')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre o razón social debe tener entre 2 y 200 caracteres'),
  
  body('codigo_postal')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('El código postal debe tener entre 5 y 10 caracteres'),
  
  body('calle')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La calle debe tener entre 2 y 100 caracteres'),
  
  body('num_ext')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('El número exterior debe tener entre 1 y 20 caracteres'),
  
  body('num_int')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El número interior no puede exceder los 20 caracteres'),
  
  body('colonia')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La colonia debe tener entre 2 y 100 caracteres'),
  
  body('delegacion')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La delegación debe tener entre 2 y 100 caracteres'),
  
  body('estado')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El estado debe tener entre 2 y 100 caracteres'),
  
  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder los 20 caracteres'),
  
  body('correo')
    .optional()
    .trim()
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .isLength({ max: 100 })
    .withMessage('El correo no puede exceder los 100 caracteres'),
  
  body('zona')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La zona debe tener entre 2 y 100 caracteres'),
  
  body('id_destino')
    .isInt({ min: 1 })
    .withMessage('El ID del destino debe ser un número entero válido'),
  
  body('id_transportista')
    .isInt({ min: 1 })
    .withMessage('El ID del transportista debe ser un número entero válido'),
  
  handleValidationErrors
];

// Validaciones para manifiestos
const validateManifiesto = [
  body('numero_libro')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('El número de libro debe tener entre 1 y 50 caracteres'),
  
  body('id_cliente')
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero válido'),
  
  body('residuos')
    .optional()
    .isArray()
    .withMessage('Los residuos deben ser un array'),
  
  body('residuos.*.id_residuo')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del residuo debe ser un número entero válido'),
  
  body('residuos.*.cantidad')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La cantidad debe ser un número mayor o igual a 0'),
  
  body('residuos.*.unidad_medida')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('La unidad de medida debe tener entre 1 y 20 caracteres'),
  
  handleValidationErrors
];

// Validaciones para estados de manifiestos (Added)
const validateManifiestoEstado = [
  body('id_manifiesto')
    .isInt({ min: 1 })
    .withMessage('El ID del manifiesto debe ser un número entero válido'),

  body('esta_capturado')
    .optional()
    .isBoolean()
    .withMessage('El campo esta_capturado debe ser un valor booleano'),

  body('esta_entregado')
    .optional()
    .isBoolean()
    .withMessage('El campo esta_entregado debe ser un valor booleano'),

  handleValidationErrors
];

// Validaciones para login
const validateLogin = [
  body('correo')
    .isEmail()
    .normalizeEmail()
    .withMessage('El correo electrónico no es válido'),
  
  body('contrasena')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateRole,
  validateResiduo,
  validateDestino,
  validateVehiculo,
  validateTransportista,
  validateCliente,
  validateManifiesto,
  validateManifiestoEstado,
  validateLogin,
  handleValidationErrors
}; 