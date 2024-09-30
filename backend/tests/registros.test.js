const request = require('supertest');
const { app, server } = require('../server');
const mongoose = require('mongoose');

describe('Testes da API de registros', () => {
  afterAll(async () => {
    // Fechar a conexão com o MongoDB
    await mongoose.connection.close();
    // Fechar o servidor corretamente
    await server.close();
  });

  it('Deve criar um novo registro de ponto', async () => {
    const response = await request(app)
      .post('/api/registros/entrada')
      .send({
        nome: 'John Doe',
        cargo: 'Desenvolvedor',
        employeeId: '1234'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.nome).toBe('John Doe');
  });

  it('Deve listar todos os registros', async () => {
    const response = await request(app).get('/api/registros/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
