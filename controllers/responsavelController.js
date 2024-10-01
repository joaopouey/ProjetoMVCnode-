const { Responsavel, Aluno } = require('../models');

// Criar um novo responsável
const criarResponsavel = async (req, res) => {
  try {
    const { nome, sobrenome, parentesco, telefone, aluno_id } = req.body;

    // Verificar se o aluno associado existe
    const aluno = await Aluno.findByPk(aluno_id);
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    await Responsavel.create({ nome, sobrenome, parentesco, telefone, aluno_id });

    // Redireciona para a página de lista de responsáveis após adicionar
    res.redirect('/responsaveis');
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar responsável', error });
  }
};

// Listar todos os responsáveis
const listarResponsaveis = async (req, res) => {
  try {
    const responsaveis = await Responsavel.findAll({ include: Aluno });
    const alunos = await Aluno.findAll(); // Buscar todos os alunos para a lista suspensa

    // Renderizar a view 'responsaveis' e passar os dados dos responsáveis e alunos
    res.render('responsaveis', {
      responsaveis: responsaveis.map(responsavel => responsavel.get({ plain: true })),
      alunos: alunos.map(aluno => aluno.get({ plain: true })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar responsáveis', error });
  }
};

// Atualizar um responsável existente
const atualizarResponsavel = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, parentesco, telefone, aluno_id } = req.body;
    
    const responsavel = await Responsavel.findByPk(id);

    if (!responsavel) {
      return res.status(404).json({ message: 'Responsável não encontrado' });
    }

    // Verificar se o aluno associado existe
    if (aluno_id) {
      const aluno = await Aluno.findByPk(aluno_id);
      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }
    }

    responsavel.nome = nome;
    responsavel.sobrenome = sobrenome;
    responsavel.parentesco = parentesco;
    responsavel.telefone = telefone;
    responsavel.aluno_id = aluno_id; // Atualizar a associação com o aluno
    await responsavel.save();

    res.status(200).json(responsavel);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar responsável', error });
  }
};

// Excluir um responsável
const excluirResponsavel = async (req, res) => {
  try {
    const { id } = req.params;
    const responsavel = await Responsavel.findByPk(id);

    if (!responsavel) {
      return res.status(404).json({ message: 'Responsável não encontrado' });
    }

    await responsavel.destroy(); // Exclui o responsável
    res.status(200).json({ message: 'Responsável excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir responsável', error });
  }
};



module.exports = {
  criarResponsavel,
  listarResponsaveis,
  atualizarResponsavel,
  excluirResponsavel,
};
