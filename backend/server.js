require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const registroRoutes = require('./routes/registros');

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Middleware
app.use(bodyParser.json({ limit: '50mb' })); // Aumentar o limite de tamanho para imagens
app.use(bodyParser.urlencoded({ extended: true }));

// Usar as rotas de registros
app.use('/api/registros', registroRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
