/**
 * RDIO Client-side filtering for show listings
 * Progressive enhancement - works without JS via pre-rendered category pages
 */
(function() {
  'use strict';

  var searchInput = document.getElementById('show-search');
  var sortButton = document.getElementById('sort-toggle');
  var showsGrid = document.getElementById('shows-grid');

  if (!showsGrid) return;

  var showCards = Array.prototype.slice.call(showsGrid.querySelectorAll('.show-card'));
  var currentSort = 'newest';

  // Search functionality
  if (searchInput) {
    var debounceTimer;

    searchInput.addEventListener('input', function(e) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        filterShows(e.target.value);
      }, 150);
    });

    // Clear on Escape
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        filterShows('');
      }
    });
  }

  function filterShows(query) {
    var searchTerm = query.toLowerCase().trim();

    showCards.forEach(function(card) {
      var title = card.dataset.title || '';
      var series = card.dataset.series || '';

      var matches = !searchTerm ||
                    title.indexOf(searchTerm) !== -1 ||
                    series.indexOf(searchTerm) !== -1;

      card.style.display = matches ? '' : 'none';
    });
  }

  // Sort functionality
  if (sortButton) {
    sortButton.addEventListener('click', function() {
      currentSort = currentSort === 'newest' ? 'oldest' : 'newest';
      sortButton.textContent = currentSort === 'newest' ? 'Newest First' : 'Oldest First';
      sortButton.dataset.sort = currentSort;
      sortShows();
    });
  }

  function sortShows() {
    var sorted = showCards.slice().sort(function(a, b) {
      var dateA = a.dataset.date || '';
      var dateB = b.dataset.date || '';

      if (currentSort === 'newest') {
        return dateB.localeCompare(dateA);
      } else {
        return dateA.localeCompare(dateB);
      }
    });

    sorted.forEach(function(card) {
      showsGrid.appendChild(card);
    });
  }

  // URL parameter support for deep linking search
  var urlParams = new URLSearchParams(window.location.search);
  var searchParam = urlParams.get('q');
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
    filterShows(searchParam);
  }
})();
