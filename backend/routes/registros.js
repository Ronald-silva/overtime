const express = require('express');
const router = express.Router();
const Registro = require('../models/registro');

// Rota para registrar a entrada de um funcionário
router.post('/entrada', async (req, res) => {
  try {
    const { nome, cargo, employeeId } = req.body;
    
    // Criar um novo registro de entrada
    const novoRegistro = new Registro({
      nome,
      cargo,
      employeeId,
      entrada: new Date() // Registrar a hora de entrada automaticamente
    });

    await novoRegistro.save();
    res.status(201).json(novoRegistro); // Sucesso ao registrar a entrada
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar a entrada' });
  }
});

// Rota para listar todos os registros
router.get('/', async (req, res) => {
  try {
    const registros = await Registro.find(); // Busca todos os registros no banco de dados
    res.status(200).json(registros); // Retorna os registros com o status 200
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar os registros' });
  }
});


// Rota para registrar a saída de um funcionário
router.post('/saida', async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    // Encontrar o último registro de ponto de entrada sem saída
    const registro = await Registro.findOne({ employeeId, saida: null }).sort({ entrada: -1 });
    
    if (!registro) {
      return res.status(404).json({ error: 'Nenhuma entrada encontrada para este funcionário' });
    }

    // Atualizar o registro com a hora de saída
    registro.saida = new Date();
    await registro.save();

    res.status(200).json(registro); // Sucesso ao registrar a saída
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar a saída' });
  }
});

module.exports = router;
