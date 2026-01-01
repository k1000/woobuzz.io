async function loadShows() {
    const grid = document.getElementById('shows-grid');
    const hero = document.getElementById('hero');
    const latestCover = document.getElementById('latest-cover');
    const latestTitle = document.getElementById('latest-title');
    const latestTags = document.getElementById('latest-tags');
    const latestSeries = document.getElementById('latest-series');
    const latestDescription = document.getElementById('latest-description');
    const mixcloudWidget = document.getElementById('mixcloud-widget');
    const playBtn = document.getElementById('play-btn');

    try {
        const response = await fetch('data/shows.json');
        const data = await response.json();

        if (!data.shows || data.shows.length === 0) {
            latestTitle.textContent = 'No shows yet';
            grid.innerHTML = '<div class="empty-state"><p>No shows yet. Check back soon!</p></div>';
            return;
        }

        // Sort by date, newest first
        data.shows.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        // Latest show in hero
        const latest = data.shows[0];
        latestCover.src = latest.cover;
        latestCover.alt = latest.title;
        latestTitle.textContent = latest.title;

        // Tags for latest show
        if (latest.tags && latest.tags.length > 0) {
            latestTags.innerHTML = latest.tags.slice(0, 2).map(tag =>
                `<span class="tag">#${tag}</span>`
            ).join(' ');
        }

        // Series for latest show
        if (latestSeries && latest.series) {
            latestSeries.textContent = latest.series;
        }

        // Description for latest show
        if (latestDescription && latest.description) {
            latestDescription.textContent = latest.description;
        }

        // Set hero background color if provided
        if (latest.background_color) {
            hero.style.background = latest.background_color;
        }

        // Mixcloud embed widget
        if (latest.mixcloud_url) {
            const mixcloudKey = latest.mixcloud_url.replace('https://www.mixcloud.com', '');
            mixcloudWidget.innerHTML = `
                <iframe
                    src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=${encodeURIComponent(mixcloudKey)}"
                    allow="autoplay">
                </iframe>
            `;

            // Play button opens Mixcloud or triggers widget
            playBtn.onclick = () => {
                window.open(latest.mixcloud_url, '_blank');
            };
        }

        // Archive grid (skip first since it's in hero)
        const archiveShows = data.shows.slice(1);

        if (archiveShows.length === 0) {
            grid.innerHTML = '<div class="empty-state"><p>More shows coming soon!</p></div>';
            return;
        }

        archiveShows.forEach(show => {
            const card = document.createElement('article');
            card.className = 'show-card';

            const date = new Date(show.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            let tagsHtml = '';
            if (show.tags && show.tags.length > 0) {
                tagsHtml = show.tags.slice(0, 2).map(tag =>
                    `<span class="tag">#${tag}</span>`
                ).join('');
            }

            const seriesHtml = show.series ? `<div class="series">${show.series}</div>` : '';

            card.innerHTML = `
                <a href="${show.mixcloud_url}" target="_blank" rel="noopener">
                    <img src="${show.cover}" alt="${show.title}" loading="lazy">
                    <div class="info">
                        ${seriesHtml}
                        <h3>${show.title}</h3>
                        ${tagsHtml}
                        <div class="date">${date}</div>
                    </div>
                </a>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load shows:', error);
        latestTitle.textContent = 'Coming soon';
        grid.innerHTML = '<div class="empty-state"><p>No shows yet. Check back soon!</p></div>';
    }
}

loadShows();
