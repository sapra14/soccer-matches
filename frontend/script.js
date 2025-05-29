// /frontend/script.js

async function fetchMatches() {
  const dateInput = document.getElementById('match-date').value;
  const matchesContainer = document.getElementById('matches');
  const errorBox = document.getElementById('error-message');

  // Clear previous content
  matchesContainer.innerHTML = '';
  errorBox.textContent = '';

  if (!dateInput) {
    errorBox.textContent = 'Please select a date.';
    return;
  }

  // Show loading text while fetching
  const loadingElem = document.createElement('div');
  loadingElem.className = 'loading';
  loadingElem.textContent = 'Loading matches...';
  matchesContainer.appendChild(loadingElem);

  try {
    const response = await fetch(`http://localhost:3000/api/matches?date=${dateInput}`);
    if (!response.ok) throw new Error('Failed to fetch matches');

    const matches = await response.json();

    // Clear loading
    matchesContainer.innerHTML = '';

    if (matches.length === 0) {
      matchesContainer.innerHTML = '<p style="text-align:center;">No matches found for this date.</p>';
      return;
    }

    // Create match cards
    matches.forEach(match => {
      const matchDiv = document.createElement('div');
      matchDiv.className = 'match';

      matchDiv.innerHTML = `
        <div class="teams">${match.homeTeam} vs ${match.awayTeam}</div>
        <div class="info">Venue: ${match.venue || 'N/A'}</div>
        <div class="info">Time: ${match.time || 'N/A'}</div>
        <div class="status">${match.status || 'Scheduled'}</div>
      `;

      matchesContainer.appendChild(matchDiv);
    });

  } catch (err) {
    matchesContainer.innerHTML = '';
    errorBox.textContent = err.message;
  }
}

// Optionally, you can load today's matches on page load
window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('match-date').value = today;
  fetchMatches();
});
