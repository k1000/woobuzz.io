async function loadShows() {
    const grid = document.getElementById('shows-grid');

    try {
        const response = await fetch('data/shows.json');
        const data = await response.json();

        if (!data.shows || data.shows.length === 0) {
            grid.innerHTML = '<div class="empty-state"><p>No shows yet. Check back soon!</p></div>';
            return;
        }

        // Sort by date, newest first
        data.shows.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        data.shows.forEach(show => {
            const card = document.createElement('article');
            card.className = 'show-card';

            const date = new Date(show.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            card.innerHTML = `
                <a href="${show.mixcloud_url}" target="_blank" rel="noopener">
                    <img src="${show.cover}" alt="${show.title}" loading="lazy">
                    <div class="info">
                        <h2>${show.title}</h2>
                        <span class="date">${date}</span>
                    </div>
                </a>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load shows:', error);
        grid.innerHTML = '<div class="empty-state"><p>No shows yet. Check back soon!</p></div>';
    }
}

loadShows();
