const { Projeto, Monitor, Aluno } = require('../models');

// Função para criar um novo projeto
const criarProjeto = async (req, res) => {
  try {
    const { nome, descricao, data_inicio, periodo, monitor_id, alunos_ids } = req.body;

    // Criar o projeto
    const novoProjeto = await Projeto.create({ 
      nome, 
      descricao, 
      data_inicio, 
      periodo, 
      monitor_id 
    });

    // Associar alunos ao projeto
    if (alunos_ids && alunos_ids.length > 0) {
      const alunosSelecionados = await Aluno.findAll({ where: { id: alunos_ids } });
      await novoProjeto.setAlunos(alunosSelecionados);
    }

    // Redirecionar para a página de lista de projetos
    res.redirect('/projetos');
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar projeto', error });
  }
};

// Função para listar todos os projetos
const listarProjetos = async (req, res) => {
  try {
    const projetos = await Projeto.findAll({
      include: [Monitor, Aluno],
    });

    const monitores = await Monitor.findAll();
    const alunos = await Aluno.findAll();

    res.render('projetos', {
      projetos: projetos.map(projeto => projeto.get({ plain: true })),
      monitores: monitores.map(monitor => monitor.get({ plain: true })),
      alunos: alunos.map(aluno => aluno.get({ plain: true })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar projetos', error });
  }
};

// Função para atualizar um projeto
const atualizarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, data_inicio, periodo, monitor_id, alunos_ids } = req.body;

    // Encontrar o projeto pelo ID
    const projeto = await Projeto.findByPk(id);
    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    // Atualizar os campos do projeto
    projeto.nome = nome;
    projeto.descricao = descricao;
    projeto.data_inicio = data_inicio;
    projeto.periodo = periodo;
    projeto.monitor_id = monitor_id;
    await projeto.save();

    // Associar alunos ao projeto
    if (alunos_ids && alunos_ids.length > 0) {
      const alunosSelecionados = await Aluno.findAll({ where: { id: alunos_ids } });
      await projeto.setAlunos(alunosSelecionados);
    } else {
      // Se nenhum aluno for selecionado, desassocia todos os alunos do projeto
      await projeto.setAlunos([]);
    }

    res.status(200).json(projeto);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar projeto', error });
  }
};

// Função para excluir um projeto
const excluirProjeto = async (req, res) => {
  try {
    const { id } = req.params;

    // Encontrar o projeto pelo ID
    const projeto = await Projeto.findByPk(id);
    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    // Excluir o projeto
    await projeto.destroy();

    res.status(200).json({ message: 'Projeto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir projeto', error });
  }
};

// Exportar as funções do controlador
module.exports = {
  criarProjeto,
  listarProjetos,
  atualizarProjeto,
  excluirProjeto,
};
