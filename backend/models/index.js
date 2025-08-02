const Role = require('./Role');
const User = require('./User');
const Residuo = require('./Residuo');
const Destino = require('./Destino');
const Vehiculo = require('./Vehiculo');
const Transportista = require('./Transportista');
const Cliente = require('./Cliente');
const Manifiesto = require('./Manifiesto');
const ManifiestoResiduo = require('./ManifiestoResiduo');
const ManifiestoEstado = require('./ManifiestoEstado');

// Definir relaciones
User.belongsTo(Role, { foreignKey: 'id_rol', as: 'rol' });
Role.hasMany(User, { foreignKey: 'id_rol', as: 'usuarios' });

// Relaciones para Cliente
Cliente.belongsTo(Destino, { foreignKey: 'id_destino', as: 'destino' });
Destino.hasMany(Cliente, { foreignKey: 'id_destino', as: 'clientes' });

Cliente.belongsTo(Transportista, { foreignKey: 'id_transportista', as: 'transportista' });
Transportista.hasMany(Cliente, { foreignKey: 'id_transportista', as: 'clientes' });

// Relaciones para Manifiesto
Manifiesto.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
Cliente.hasMany(Manifiesto, { foreignKey: 'id_cliente', as: 'manifiestos' });

// Relaciones muchos a muchos entre Manifiesto y Residuo
Manifiesto.belongsToMany(Residuo, { 
  through: ManifiestoResiduo, 
  foreignKey: 'id_manifiesto', 
  otherKey: 'id_residuo',
  as: 'residuos' 
});
Residuo.belongsToMany(Manifiesto, { 
  through: ManifiestoResiduo, 
  foreignKey: 'id_residuo', 
  otherKey: 'id_manifiesto',
  as: 'manifiestos' 
});

// Relaciones para ManifiestoEstado
Manifiesto.hasOne(ManifiestoEstado, { foreignKey: 'id_manifiesto', as: 'estado' });
ManifiestoEstado.belongsTo(Manifiesto, { foreignKey: 'id_manifiesto', as: 'manifiesto' });

module.exports = {
  Role,
  User,
  Residuo,
  Destino,
  Vehiculo,
  Transportista,
  Cliente,
  Manifiesto,
  ManifiestoResiduo,
  ManifiestoEstado
}; 