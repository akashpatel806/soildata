async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Data fetch failed');
    const data = await response.json();
    updateDashboard(data);
  } catch (error) {
    console.error('Error fetching soil data:', error);
  }
}

function updateDashboard(data) {
  if (data.length === 0) return;

  const latest = data[0];
  
  // Update latest reading cards
  document.querySelector('#temp-card .value').innerText = latest.temperature || '--';
  document.querySelector('#humidity-card .value').innerText = latest.humidity || '--';
  document.querySelector('#soil-card .value').innerText = latest.soil || '--';
  document.querySelector('#ph-card .value').innerText = latest.ph || '--';

  // Update history table
  const tbody = document.getElementById('history-body');
  tbody.innerHTML = '';
  
  data.forEach(item => {
    const row = document.createElement('tr');
    const timeStr = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    row.innerHTML = `
      <td>${timeStr}</td>
      <td>${item.temperature || '--'}</td>
      <td>${item.humidity || '--'}</td>
      <td>${item.soil || '--'}</td>
      <td>${item.ph || '--'}</td>
    `;
    tbody.appendChild(row);
  });
}

// Initial fetch and set interval for polling
fetchData();
setInterval(fetchData, 5000);
