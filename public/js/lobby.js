const username = localStorage.getItem('username');
window.token = localStorage.getItem('token');
window.user = null;

// Retrieve game from URL
const game = new URLSearchParams(window.location.search).get('game');
localStorage.setItem("game", game); // Save the game in localStorage for easy access

if (window.token && username) {
    try {
        const base64Url = window.token.split('.')[1];
        const decodedValue = JSON.parse(atob(base64Url));
        window.user = { username, userId: decodedValue._id };
    } catch (error) {
        alert("Authentication error. Please log in again.");
        window.location.href = "/";
    }
} else {
    localStorage.setItem('redirectMessage', 'You must be logged in to access the lobby.');
    window.location.href = '/';
}

const socket = io('http://localhost:3000', {
    auth: { token: localStorage.getItem('token') },
    transports: ['websocket'],
    upgrade: false
});

window.socket = socket;

socket.on('connect', () => {
    // Join the lobby for the specified game upon connection
    try {
        window.socket.emit('joinLobby', { game, userId: window.user.userId });
    } catch (error) {
        // Handle connection error if needed
    }
});

socket.on('logout', () => {
    alert('You have been logged out.');
    window.location.href = '/';
});

socket.on('disconnect', () => {
    handleDisconnect();
});

// Inside updatePlayerCount listener
socket.on('updatePlayerCount', (count) => {
    const playerCountText = document.getElementById('playerCountText');
    if (playerCountText) {
        playerCountText.textContent = `Online: ${count}`;
    }
});

// Update lobby title
function updateLobbyTitle() {
    const lobbyTitle = document.getElementById('lobby-title');
    if (lobbyTitle) {
        lobbyTitle.textContent = game
            ? `${game.charAt(0).toUpperCase() + game.slice(1)} Lobby`
            : 'Game Lobby';
    }
}

// Periodic lastActive update
setInterval(async () => {
    if (window.token) {
        try {
            const response = await fetch('/auth/update-last-active', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${window.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Handle error if needed
            }
        } catch (error) {
            // Handle error if needed
        }
    }
}, 60000); // Update every 60 seconds

// Handle disconnects and set isOnline to false on server
function handleDisconnect() {
    if (socket) {
        window.socket.emit('logout');
        window.socket.disconnect();
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }
}

function openPopup(type) {
    const urlParams = new URLSearchParams(window.location.search);
    const game = urlParams.get('game');
    
    let title;
    const popupContent = document.getElementById('lobbyPopupContent');
    popupContent.className = ''; // Rensa tidigare klasser
    if (type === 'howToPlay') {
        title = "How to Play";
        popupContent.classList.add('howToPlay');
        fetch(`/howto/${game}`)
            .then(response => response.text())
            .then(data => {
                popupContent.innerHTML = data;
            })
            .catch(error => {
                console.error("Error loading content:", error);
                popupContent.textContent = "Content could not be loaded.";
            });
    } else if (type === 'leaderboard') {
        title = "Leaderboard";
        popupContent.classList.add('leaderboard');
        fetch(`/leaderboard/data/${game}`)
            .then(response => response.json())
            .then(data => {
                let contentHTML = '<div class="leaderboard">';
                contentHTML += '<table><tr><th>Rank</th><th>Username</th><th>Score</th></tr>';

                data.forEach((entry, index) => {
                    const rankImage = getRankImage(entry.score); // Hämta rätt rankbild baserat på poäng
                    contentHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${entry.username}</td>
                            <td class="score">
                                <img src="${rankImage}" alt="Rank icon" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px;">
                                ${entry.score}
                            </td>
                        </tr>`;
                });

                contentHTML += '</table></div>';
                popupContent.innerHTML = contentHTML;
            })
            .catch(error => {
                console.error("Error loading leaderboard data:", error);
                popupContent.textContent = "Could not load leaderboard.";
            });
    }

    document.getElementById('popupTitle').textContent = title;
    document.getElementById('lobbyContentPopup').style.display = 'block';
}




function closePopup() {
    document.getElementById('lobbyContentPopup').style.display = 'none'; // Använd det nya ID:t här
}






// Call updateLobbyTitle directly as DOM is guaranteed to be loaded
updateLobbyTitle();
