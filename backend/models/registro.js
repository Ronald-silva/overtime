const mongoose = require('mongoose');

const RegistroSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  entrada: {
    type: Date,
    default: Date.now
  },
  saida: {
    type: Date
  },
  latitudeEntrada: {
    type: Number,
    required: true
  },
  longitudeEntrada: {
    type: Number,
    required: true
  },
  latitudeSaida: {
    type: Number
  },
  longitudeSaida: {
    type: Number
  },
  fotoEntrada: {
    type: String, // Salva em formato base64
    required: true
  },
  fotoSaida: {
    type: String // Salva em formato base64
  }
});

module.exports = mongoose.model('Registro', RegistroSchema);
