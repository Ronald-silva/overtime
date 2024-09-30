// Função para capturar localização atual
function getLocation(callback) {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          function(position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              callback(latitude, longitude);
          },
          function(error) {
              console.error('Erro ao obter localização:', error);
              callback(null, null); // Não consegui obter localização
          }
      );
  } else {
      alert("Geolocalização não é suportada pelo seu navegador.");
      callback(null, null);
  }
}

// Função para capturar foto
function capturePhoto(callback) {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  // Solicitar permissão para usar a câmera frontal
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then((stream) => {
      video.srcObject = stream;
      document.getElementById('snap').addEventListener('click', () => {
        context.drawImage(video, 0, 0, 320, 240);
        const imageData = canvas.toDataURL('image/png');
        callback(imageData); // Envia a foto capturada como base64
      });
    })
    .catch((err) => {
      console.error('Erro ao acessar a câmera frontal:', err);
      alert('Erro ao acessar a câmera. Verifique as permissões.');
      callback(null); // Não conseguiu acessar a câmera
    });
}

// Atualizar relógio na tela
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// Registrar entrada
document.getElementById('checkIn').addEventListener('click', function () {
  const fullName = document.getElementById('fullName').value;
  const position = document.getElementById('position').value;
  const employeeId = document.getElementById('employeeId').value;

  if (fullName === '' || position === '' || employeeId === '') {
      alert('Preencha todos os campos!');
      return;
  }

  // Capturar a localização e a foto
  getLocation((latitude, longitude) => {
      capturePhoto((photo) => {
          if (!photo) {
              alert('Erro ao capturar a foto.');
              return;
          }

          // Enviar dados para o backend
          fetch('http://localhost:5000/api/registros/entrada', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  nome: fullName,
                  cargo: position,
                  employeeId: employeeId,
                  latitude: latitude,
                  longitude: longitude,
                  fotoEntrada: photo, // Foto capturada
              }),
          })
          .then(response => response.json())
          .then(data => {
              alert('Entrada registrada com sucesso!');
              // Limpar campos de input
              document.getElementById('fullName').value = '';
              document.getElementById('position').value = '';
              document.getElementById('employeeId').value = '';
              loadHistory(); // Atualizar histórico de registros
          })
          .catch(error => {
              console.error('Erro ao registrar a entrada:', error);
              alert('Erro ao registrar a entrada. Verifique sua conexão com o servidor.');
          });
      });
  });
});

// Registrar saída
document.getElementById('checkOut').addEventListener('click', function () {
  const employeeId = document.getElementById('employeeId').value;

  if (employeeId === '') {
      alert('Preencha o campo de ID do funcionário!');
      return;
  }

  // Capturar a localização e a foto ao sair
  getLocation((latitude, longitude) => {
      capturePhoto((photo) => {
          if (!photo) {
              alert('Erro ao capturar a foto.');
              return;
          }

          // Enviar solicitação de saída para o backend
          fetch('http://localhost:5000/api/registros/saida', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  employeeId: employeeId,
                  latitude: latitude,
                  longitude: longitude,
                  fotoSaida: photo, // Foto capturada na saída
              }),
          })
          .then(response => response.json())
          .then(data => {
              alert('Saída registrada com sucesso!');
              // Limpar campos de input
              document.getElementById('fullName').value = '';
              document.getElementById('position').value = '';
              document.getElementById('employeeId').value = '';
              loadHistory(); // Atualizar histórico de registros
          })
          .catch(error => {
              console.error('Erro ao registrar a saída:', error);
              alert('Erro ao registrar a saída. Verifique sua conexão com o servidor.');
          });
      });
  });
});

// Carregar histórico de registros
function loadHistory() {
  const tableBody = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; // Limpar tabela antes de preencher

  fetch('http://localhost:5000/api/registros')
      .then(response => response.json())
      .then(data => {
          data.forEach(item => {
              const row = tableBody.insertRow();

              row.insertCell(0).textContent = new Date(item.entrada).toLocaleDateString();
              row.insertCell(1).textContent = item.nome;
              row.insertCell(2).textContent = item.cargo;
              row.insertCell(3).textContent = item.employeeId;
              row.insertCell(4).textContent = new Date(item.entrada).toLocaleTimeString();
              row.insertCell(5).textContent = item.saida ? new Date(item.saida).toLocaleTimeString() : 'Ainda no trabalho';
              row.insertCell(6).textContent = item.saida ? ((new Date(item.saida) - new Date(item.entrada)) / 3600000).toFixed(2) + 'h' : 'N/A';
              row.insertCell(7).textContent = item.saida ? Math.max(((new Date(item.saida) - new Date(item.entrada)) / 3600000) - 8, 0).toFixed(2) + 'h' : 'N/A';
          });
      })
      .catch(error => {
          console.error('Erro ao carregar histórico de registros:', error);
      });
}

// Carregar histórico de registros ao iniciar
loadHistory();
