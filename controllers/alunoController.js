const { Aluno, Responsavel } = require('../models');
const { Op } = require('sequelize');

// Criar um novo aluno
const criarAluno = async (req, res) => {
  try {
    const { nome, sobrenome, telefone, genero, etnia, data_nascimento } = req.body;

    await Aluno.create({ nome, sobrenome, telefone, genero, etnia, data_nascimento });

    // Redireciona para a página de lista de alunos após adicionar
    res.redirect('/alunos');
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar aluno', error });
  }
};

// Listar todos os alunos
const listarAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.findAll({
      include: {
        model: Responsavel,
        attributes: ['nome', 'sobrenome'],
      },
    });

    // Renderiza a view 'alunos' e passa os dados para ela
    res.render('alunos', {
      alunos: alunos.map(aluno => aluno.get({ plain: true })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar alunos', error });
  }
};

// Atualizar um aluno existente
const atualizarAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, telefone, genero, etnia, data_nascimento } = req.body;

    const aluno = await Aluno.findByPk(id);
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    aluno.nome = nome;
    aluno.sobrenome = sobrenome;
    aluno.telefone = telefone;
    aluno.genero = genero;
    aluno.etnia = etnia;
    aluno.data_nascimento = data_nascimento;
    await aluno.save();

    res.status(200).json(aluno);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar aluno', error });
  }
};

// Excluir um aluno
const excluirAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const aluno = await Aluno.findByPk(id);

    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    await aluno.destroy(); // Exclui o aluno
    res.status(200).json({ message: 'Aluno excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir aluno', error });
  }
};

module.exports = {
  criarAluno,
  listarAlunos,
  atualizarAluno,
  excluirAluno,
};
