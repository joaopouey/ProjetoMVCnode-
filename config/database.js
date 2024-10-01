const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados PostgreSQL
const sequelize = new Sequelize('sistema_gerenciamento_alunos', 'ucpel', 'ucpel', {
  host: 'localhost',
  dialect: 'postgres',
  dialectOptions: {
    charset: 'utf8',
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
  logging: false, // Desativa os logs SQL para maior clareza
});

module.exports = sequelize;
