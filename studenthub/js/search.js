/**
 * StudentHub - Global & Quick Search System
 * Indexes courses, topics, videos, and study resources with instant filtering
 * and modal dialog with keyboard shortcuts.
 */

(function () {
  'use strict';

  // Comprehensive index of all learning materials on StudentHub
  const SEARCH_DATABASE = [
    // Courses
    { id: 'c-course', title: 'Complete C Programming', category: 'Courses', type: 'Course', level: 'Beginner', link: 'courses.html?filter=c', icon: 'fa-solid fa-c' },
    { id: 'java-course', title: 'Java Programming Masterclass', category: 'Courses', type: 'Course', level: 'Intermediate', link: 'courses.html?filter=java', icon: 'fa-brands fa-java' },
    { id: 'python-course', title: 'Python for Beginners & Data Science', category: 'Courses', type: 'Course', level: 'Beginner', link: 'courses.html?filter=python', icon: 'fa-brands fa-python' },
    { id: 'dsa-course', title: 'Data Structures & Algorithms in C++/Java', category: 'Courses', type: 'Course', level: 'Advanced', link: 'courses.html?filter=dsa', icon: 'fa-solid fa-network-wired' },
    { id: 'web-course', title: 'Full Stack Web Development (MERN)', category: 'Courses', type: 'Course', level: 'Beginner', link: 'courses.html?filter=web', icon: 'fa-solid fa-code' },
    { id: 'git-course', title: 'Git & GitHub Version Control', category: 'Courses', type: 'Course', level: 'Beginner', link: 'courses.html?filter=tools', icon: 'fa-brands fa-github' },

    // Topics
    { id: 'topic-c', title: 'C Programming Fundamentals', category: 'Topics', type: 'Topic', level: 'Beginner', link: 'index.html#topics', icon: 'fa-solid fa-c' },
    { id: 'topic-cpp', title: 'C++ Object-Oriented Programming', category: 'Topics', type: 'Topic', level: 'Intermediate', link: 'index.html#topics', icon: 'fa-solid fa-laptop-code' },
    { id: 'topic-java', title: 'Java OOP & Collections Framework', category: 'Topics', type: 'Topic', level: 'Intermediate', link: 'index.html#topics', icon: 'fa-brands fa-java' },
    { id: 'topic-python', title: 'Python Data Structures & Modules', category: 'Topics', type: 'Topic', level: 'Beginner', link: 'index.html#topics', icon: 'fa-brands fa-python' },
    { id: 'topic-html-css', title: 'HTML5 Semantic Markup & CSS3 Styling', category: 'Topics', type: 'Topic', level: 'Beginner', link: 'index.html#topics', icon: 'fa-brands fa-html5' },
    { id: 'topic-js', title: 'JavaScript ES6+ and DOM Manipulation', category: 'Topics', type: 'Topic', level: 'Intermediate', link: 'index.html#topics', icon: 'fa-brands fa-js' },
    { id: 'topic-react', title: 'React Hooks, State & Component Architecture', category: 'Topics', type: 'Topic', level: 'Intermediate', link: 'index.html#topics', icon: 'fa-brands fa-react' },
    { id: 'topic-dsa', title: 'DSA: Arrays, Linked Lists, Trees & Graphs', category: 'Topics', type: 'Topic', level: 'Advanced', link: 'index.html#topics', icon: 'fa-solid fa-diagram-project' },
    { id: 'topic-dbms', title: 'Database Management Systems & SQL', category: 'Topics', type: 'Topic', level: 'Intermediate', link: 'index.html#topics', icon: 'fa-solid fa-database' },
    { id: 'topic-os', title: 'Operating Systems & Concurrency', category: 'Topics', type: 'Topic', level: 'Intermediate', link: 'index.html#topics', icon: 'fa-solid fa-microchip' },
    { id: 'topic-cn', title: 'Computer Networks & TCP/IP Protocol', category: 'Topics', type: 'Topic', level: 'Intermediate', link: 'index.html#topics', icon: 'fa-solid fa-globe' },
    { id: 'topic-linux', title: 'Linux CLI & Bash Scripting', category: 'Topics', type: 'Topic', level: 'Beginner', link: 'index.html#topics', icon: 'fa-brands fa-linux' },

    // Videos
    { id: 'video-c', title: 'C Programming Full Course Tutorial', category: 'Videos', type: 'Video', level: 'Beginner', link: 'https://www.youtube.com/results?search_query=c+programming+full+course', icon: 'fa-solid fa-video' },
    { id: 'video-cpp', title: 'C++ Tutorial for Beginners (Full Course)', category: 'Videos', type: 'Video', level: 'Intermediate', link: 'https://www.youtube.com/results?search_query=c%2B%2B+full+course', icon: 'fa-solid fa-video' },
    { id: 'video-java', title: 'Java Programming Complete Course Video', category: 'Videos', type: 'Video', level: 'Intermediate', link: 'https://www.youtube.com/results?search_query=java+full+course', icon: 'fa-solid fa-video' },
    { id: 'video-python', title: 'Python Programming 12-Hour Masterclass', category: 'Videos', type: 'Video', level: 'Beginner', link: 'https://www.youtube.com/results?search_query=python+for+beginners+full+course', icon: 'fa-solid fa-video' },
    { id: 'video-html-css', title: 'HTML & CSS Crash Course with Responsive Design', category: 'Videos', type: 'Video', level: 'Beginner', link: 'https://www.youtube.com/results?search_query=html+css+full+course', icon: 'fa-solid fa-video' },
    { id: 'video-js', title: 'JavaScript Tutorial from Zero to Hero', category: 'Videos', type: 'Video', level: 'Intermediate', link: 'https://www.youtube.com/results?search_query=javascript+tutorial+for+beginners', icon: 'fa-solid fa-video' },
    { id: 'video-dsa', title: 'DSA Complete Placement Preparation Series', category: 'Videos', type: 'Video', level: 'Advanced', link: 'https://www.youtube.com/results?search_query=dsa+course+for+placement', icon: 'fa-solid fa-video' },
    { id: 'video-git', title: 'Git & GitHub Step-by-Step for Developers', category: 'Videos', type: 'Video', level: 'Beginner', link: 'https://www.youtube.com/results?search_query=git+and+github+tutorial', icon: 'fa-solid fa-video' },

    // Notes & Resources
    { id: 'note-c', title: 'C Programming Handcrafted Notes & Syntax Sheet', category: 'Notes', type: 'Note', level: 'Beginner', link: 'resources.html#notes', icon: 'fa-solid fa-file-lines' },
    { id: 'note-java', title: 'Java Core & Advanced OOP Handwritten Notes', category: 'Notes', type: 'Note', level: 'Intermediate', link: 'resources.html#notes', icon: 'fa-solid fa-file-lines' },
    { id: 'note-python', title: 'Python Quick Revision & Standard Library Notes', category: 'Notes', type: 'Note', level: 'Beginner', link: 'resources.html#notes', icon: 'fa-solid fa-file-lines' },
    { id: 'note-dsa', title: 'DSA Pattern-wise Notes & Complexity Guide', category: 'Notes', type: 'Note', level: 'Advanced', link: 'resources.html#notes', icon: 'fa-solid fa-file-lines' },
    { id: 'cheat-sheet', title: 'Complete Programming Cheat Sheets (All Languages)', category: 'Resources', type: 'Cheat Sheet', level: 'All Levels', link: 'resources.html#cheatsheets', icon: 'fa-solid fa-book-bookmark' },
    { id: 'interview-prep', title: 'Top 100 Technical Coding Interview Questions', category: 'Resources', type: 'Interview Prep', level: 'All Levels', link: 'resources.html#interview', icon: 'fa-solid fa-bullseye' },
    { id: 'practice-questions', title: 'Topic-wise Practice Questions & Solutions', category: 'Resources', type: 'Practice', level: 'All Levels', link: 'resources.html#practice', icon: 'fa-solid fa-pen-to-square' }
  ];

  function querySearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return SEARCH_DATABASE.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchType = item.type.toLowerCase().includes(q);
      return matchTitle || matchCategory || matchType;
    });
  }

  function groupResultsByCategory(results) {
    const groups = {};
    results.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }

  function renderSearchResultsHTML(results) {
    if (results.length === 0) {
      return `
        <div class="empty-search-state">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p><strong>No learning resources found.</strong></p>
          <p class="search-hint">Try searching for "Java", "Python", "DSA", "C", or "Web".</p>
        </div>
      `;
    }

    const grouped = groupResultsByCategory(results);
    let html = '';

    for (const [category, items] of Object.entries(grouped)) {
      html += `
        <div class="search-result-group">
          <div class="result-group-title">${category} (${items.length})</div>
          <div class="result-group-list">
      `;

      items.forEach((item) => {
        const isExternal = item.link.startsWith('http');
        html += `
          <a href="${item.link}" ${isExternal ? 'target="_blank" rel="noopener"' : ''} class="search-result-item">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <i class="${item.icon}" style="color:var(--primary); font-size:1.1rem; width:20px; text-align:center;"></i>
              <div>
                <div style="font-weight:600; font-size:0.925rem;">${item.title}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${item.type} • ${item.level}</div>
              </div>
            </div>
            <i class="fa-solid fa-arrow-right" style="font-size:0.8rem; color:var(--text-muted);"></i>
          </a>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    return html;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Quick Search on Home Page
    const heroSearchInput = document.getElementById('hero-search-input');
    const heroSearchResults = document.getElementById('hero-search-results');
    const heroSearchClearBtn = document.getElementById('hero-search-clear');

    if (heroSearchInput && heroSearchResults) {
      heroSearchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (heroSearchClearBtn) {
          heroSearchClearBtn.style.display = val ? 'block' : 'none';
        }

        if (val.length > 0) {
          const matched = querySearch(val);
          heroSearchResults.innerHTML = renderSearchResultsHTML(matched);
          heroSearchResults.classList.add('active');
        } else {
          heroSearchResults.classList.remove('active');
          heroSearchResults.innerHTML = '';
        }
      });

      if (heroSearchClearBtn) {
        heroSearchClearBtn.addEventListener('click', () => {
          heroSearchInput.value = '';
          heroSearchClearBtn.style.display = 'none';
          heroSearchResults.classList.remove('active');
          heroSearchResults.innerHTML = '';
          heroSearchInput.focus();
        });
      }

      // Quick Search Tag Chips
      document.querySelectorAll('.search-tag-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const query = chip.getAttribute('data-query') || chip.textContent.trim();
          heroSearchInput.value = query;
          heroSearchInput.dispatchEvent(new Event('input'));
          heroSearchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      });
    }

    // Global Search Modal setup
    const searchModalOverlay = document.getElementById('search-modal');
    const modalSearchInput = document.getElementById('modal-search-input');
    const modalSearchResults = document.getElementById('modal-search-results');

    function openSearchModal() {
      if (searchModalOverlay && modalSearchInput) {
        searchModalOverlay.classList.add('active');
        modalSearchInput.value = '';
        if (modalSearchResults) {
          modalSearchResults.innerHTML = `
            <div class="empty-search-state" style="padding: 1.5rem;">
              <p style="color:var(--text-muted); font-size:0.9rem;">Type to search for courses, video lectures, notes, or topics...</p>
            </div>
          `;
        }
        setTimeout(() => modalSearchInput.focus(), 50);
      }
    }

    function closeSearchModal() {
      if (searchModalOverlay) {
        searchModalOverlay.classList.remove('active');
      }
    }

    document.querySelectorAll('.search-trigger-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
      });
    });

    const modalCloseBtn = document.getElementById('search-modal-close');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeSearchModal);
    }

    if (searchModalOverlay) {
      searchModalOverlay.addEventListener('click', (e) => {
        if (e.target === searchModalOverlay) {
          closeSearchModal();
        }
      });
    }

    if (modalSearchInput && modalSearchResults) {
      modalSearchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val.length > 0) {
          const matched = querySearch(val);
          modalSearchResults.innerHTML = renderSearchResultsHTML(matched);
        } else {
          modalSearchResults.innerHTML = `
            <div class="empty-search-state" style="padding: 1.5rem;">
              <p style="color:var(--text-muted); font-size:0.9rem;">Type to search courses, videos, topics, and notes...</p>
            </div>
          `;
        }
      });
    }

    // Keyboard Shortcuts: Cmd+K / Ctrl+K or '/' to open search, Esc to close
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      } else if (e.key === 'Escape') {
        closeSearchModal();
      } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        openSearchModal();
      }
    });
  });

  window.StudentHubSearch = {
    search: querySearch,
    database: SEARCH_DATABASE
  };
})();
