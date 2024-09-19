function createInputFields() {
    const numProcesses = document.getElementById('numProcesses').value;
    const container = document.getElementById('processInputFields');
    container.innerHTML = '';

    for (let i = 0; i < numProcesses; i++) {
        const inputDiv = document.createElement('div');
        inputDiv.className = 'input-process';
        inputDiv.innerHTML = `
            <label for="burst${i}">Burst Time for Process ${i + 1}:</label>
            <input type="number" id="burst${i}" min="1" value="1">
        `;
        container.appendChild(inputDiv);
    }

    document.getElementById('calculateBtn').style.display = 'block';
}

function calculateSJF() {
    const numProcesses = parseInt(document.getElementById('numProcesses').value);
    let processes = [];

    for (let i = 0; i < numProcesses; i++) {
        const burstTime = parseInt(document.getElementById(`burst${i}`).value);
        processes.push({ process: i + 1, burstTime });
    }

    // Sắp xếp các tiến trình theo burst time
    processes.sort((a, b) => a.burstTime - b.burstTime);

    let time = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    let ganttData = [];

    const tbody = document.querySelector('#resultTable tbody');
    tbody.innerHTML = '';

    processes.forEach(process => {
        const waitTime = time;
        const turnTime = waitTime + process.burstTime;

        waitingTime += waitTime;
        turnaroundTime += turnTime;

        ganttData.push({ process: process.process, start: time, end: turnTime });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>P${process.process}</td>
            <td>${process.burstTime}</td>
            <td>${waitTime}</td>
            <td>${turnTime}</td>
        `;
        tbody.appendChild(row);

        time += process.burstTime;
    });

    document.getElementById('resultTable').style.display = 'table';

    const avgWait = (waitingTime / numProcesses).toFixed(2);
    const avgTurnaround = (turnaroundTime / numProcesses).toFixed(2);

    document.getElementById('avgWaitTime').innerText = `Average Waiting Time: ${avgWait}`;
    document.getElementById('avgTurnaroundTime').innerText = `Average Turnaround Time: ${avgTurnaround}`;
    document.getElementById('avgTimes').style.display = 'block';

    drawGanttChart(ganttData);
}

function drawGanttChart(ganttData) {
    const chartContainer = document.getElementById('ganttChart');
    chartContainer.innerHTML = '';

    if (ganttData.length === 0) return;

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.backgroundColor = 'white';

    const ganttRow = document.createElement('tr');
    ganttData.forEach((item, index) => {
        const cell = document.createElement('td');
        const duration = item.end - item.start;

        if (index > 0 && ganttData[index - 1].process === item.process) {
            ganttRow.lastChild.colSpan += duration;
        } else {
            cell.colSpan = duration;
            cell.style.border = '1px solid black';
            cell.style.textAlign = 'center';
            cell.style.backgroundColor = getProcessColor(item.process);
            cell.innerText = `P${item.process}`;
            ganttRow.appendChild(cell);
        }
    });

    table.appendChild(ganttRow);

    // Hàng thời gian
    const timeRow = document.createElement('tr');
    ganttData.forEach((item, index) => {
        const timeCell = document.createElement('td');
        const duration = item.end - item.start;

        if (index > 0 && ganttData[index - 1].process === item.process) {
            timeRow.lastChild.colSpan += duration;
        } else {
            timeCell.colSpan = duration;
            timeCell.style.textAlign = 'center';
            timeCell.innerText = `${item.start} - ${item.end}`;
            timeRow.appendChild(timeCell);
        }
    });

    table.appendChild(timeRow);
    chartContainer.appendChild(table);
}

function getProcessColor(processNumber) {
    const colors = ['#ff9999', '#99ccff', '#99ff99', '#ffcc99', '#cc99ff', '#ff99cc'];
    return colors[(processNumber - 1) % colors.length];
}
