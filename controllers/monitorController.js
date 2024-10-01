const { Monitor } = require('../models');

// Criar um novo monitor
const criarMonitor = async (req, res) => {
  try {
    const { nome, sobrenome, telefone } = req.body;

    await Monitor.create({ nome, sobrenome, telefone });

    // Redireciona para a página de lista de monitores após adicionar
    res.redirect('/monitores');
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar monitor', error });
  }
};

// Listar todos os monitores
const listarMonitores = async (req, res) => {
  try {
    const monitores = await Monitor.findAll();

    // Renderiza a view 'monitores' e passa os dados para ela
    res.render('monitores', {
      monitores: monitores.map(monitor => monitor.get({ plain: true })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar monitores', error });
  }
};

// Atualizar um monitor existente
const atualizarMonitor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, telefone } = req.body;

    const monitor = await Monitor.findByPk(id);
    if (!monitor) {
      return res.status(404).json({ message: 'Monitor não encontrado' });
    }

    monitor.nome = nome;
    monitor.sobrenome = sobrenome;
    monitor.telefone = telefone;
    await monitor.save();

    res.status(200).json(monitor);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar monitor', error });
  }
};

// Excluir um monitor
const excluirMonitor = async (req, res) => {
  try {
    const { id } = req.params;
    const monitor = await Monitor.findByPk(id);

    if (!monitor) {
      return res.status(404).json({ message: 'Monitor não encontrado' });
    }

    await monitor.destroy(); // Exclui o monitor
    res.status(200).json({ message: 'Monitor excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir monitor', error });
  }
};

module.exports = {
  criarMonitor,
  listarMonitores,
  atualizarMonitor,
  excluirMonitor,
};
