const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cargo: { type: String, required: true },
  employeeId: { type: String, required: true },
  entrada: { type: Date, required: true },
  saida: { type: Date } // Permite que o campo de saída seja opcional, registrando-o depois
});

const Registro = mongoose.model('Registro', registroSchema);

module.exports = Registro;
