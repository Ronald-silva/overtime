const express = require('express');
const router = express.Router();
const Registro = require('../models/registro');

// Rota para registrar a entrada
router.post('/entrada', async (req, res) => {
  try {
    const { nome, cargo, employeeId, latitude, longitude, fotoEntrada } = req.body;

    if (!fotoEntrada) {
      return res.status(400).json({ error: 'Foto de entrada é obrigatória' });
    }

    // Criar um novo registro de entrada
    const novoRegistro = new Registro({
      nome,
      cargo,
      employeeId,
      latitudeEntrada: latitude,
      longitudeEntrada: longitude,
      fotoEntrada: fotoEntrada // Imagem em base64
    });

    await novoRegistro.save();
    res.status(201).json(novoRegistro);
  } catch (error) {
    console.error('Erro ao registrar entrada:', error);
    res.status(500).json({ error: 'Erro ao registrar a entrada' });
  }
});

// Rota para registrar a saída
router.post('/saida', async (req, res) => {
  try {
    const { employeeId, latitude, longitude, fotoSaida } = req.body;

    if (!fotoSaida) {
      return res.status(400).json({ error: 'Foto de saída é obrigatória' });
    }

    // Encontrar o registro de entrada mais recente sem saída
    const registro = await Registro.findOne({ employeeId, saida: null }).sort({ entrada: -1 });

    if (!registro) {
      return res.status(404).json({ error: 'Nenhum registro de entrada encontrado para este funcionário' });
    }

    // Atualizar o registro com a hora de saída, localização e foto
    registro.saida = new Date();
    registro.latitudeSaida = latitude;
    registro.longitudeSaida = longitude;
    registro.fotoSaida = fotoSaida;

    await registro.save();
    res.status(200).json(registro);
  } catch (error) {
    console.error('Erro ao registrar saída:', error);
    res.status(500).json({ error: 'Erro ao registrar a saída' });
  }
});

// Rota para obter o histórico de registros
router.get('/', async (req, res) => {
  try {
    const registros = await Registro.find();
    res.status(200).json(registros);
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
});

module.exports = router;
