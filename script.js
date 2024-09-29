function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// Simulação de registro de ponto
let isCheckedIn = false;
let checkInTime = null;
let currentEmployee = null;
document.getElementById('checkInOut').addEventListener('click', function() {
    const now = new Date();
    const fullName = document.getElementById('fullName').value;
    const position = document.getElementById('position').value;
    const employeeId = document.getElementById('employeeId').value;

    if (!isCheckedIn) {
        if (!fullName || !position || !employeeId) {
            alert("Por favor, preencha todos os campos antes de registrar a entrada.");
            return;
        }
        checkInTime = now;
        currentEmployee = { fullName, position, employeeId };
        this.textContent = "Registrar Saída";
        alert(`Entrada registrada para ${fullName} às ${now.toLocaleTimeString()}`);
    } else {
        const duration = (now - checkInTime) / 3600000; // horas
        const overtime = Math.max(duration - 8, 0); // considerando 8h como jornada normal
        alert(`Saída registrada para ${currentEmployee.fullName}. Duração: ${duration.toFixed(2)}h. Horas extras: ${overtime.toFixed(2)}h`);
        this.textContent = "Registrar Entrada";
        
        // Adicionar ao histórico
        const table = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
        const row = table.insertRow(0);
        row.insertCell(0).textContent = now.toLocaleDateString();
        row.insertCell(1).textContent = currentEmployee.fullName;
        row.insertCell(2).textContent = currentEmployee.position;
        row.insertCell(3).textContent = currentEmployee.employeeId;
        row.insertCell(4).textContent = checkInTime.toLocaleTimeString();
        row.insertCell(5).textContent = now.toLocaleTimeString();
        row.insertCell(6).textContent = duration.toFixed(2) + "h";
        row.insertCell(7).textContent = overtime.toFixed(2) + "h";

        // Atualizar total de horas extras
        const currentOvertime = parseFloat(document.getElementById('overtimeTotal').textContent);
        document.getElementById('overtimeTotal').textContent = (currentOvertime + overtime).toFixed(2);

        // Limpar campos de entrada
        document.getElementById('fullName').value = '';
        document.getElementById('position').value = '';
        document.getElementById('employeeId').value = '';
        currentEmployee = null;
    }
    isCheckedIn = !isCheckedIn;
});

// Simulação de solicitação de hora extra
document.getElementById('requestOvertime').addEventListener('click', function() {
    const hours = prompt("Quantas horas extras você deseja solicitar?");
    if (hours) {
        alert(`Solicitação de ${hours} horas extras enviada para aprovação.`);
    }
});