/**
 * StudentHub - Main Application Controller
 * Handles global UI interactions, sticky navigation, mobile menu, modals,
 * toast notifications, FAQ accordion, topic filtering, and scroll animations.
 */

(function () {
  'use strict';

  // Global namespace for StudentHub helper utilities
  window.StudentHub = window.StudentHub || {};

  /* ---------------- Toast Notification Engine ---------------- */
  let toastContainer = null;

  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = document.querySelector('.toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
      }
    }
    return toastContainer;
  }

  function showToast(message, type = 'info', duration = 4000) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <span class="toast-msg">${message}</span>
      <i class="fa-solid fa-xmark toast-close" title="Dismiss"></i>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-30px)';
      setTimeout(() => toast.remove(), 250);
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-30px)';
        setTimeout(() => toast.remove(), 250);
      }
    }, duration);
  }

  window.StudentHub.showToast = showToast;

  /* ---------------- Modal Controllers ---------------- */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      // If modal contains an iframe (e.g. video), reset src to stop playback
      const iframe = modal.querySelector('iframe');
      if (iframe) {
        const src = iframe.getAttribute('src');
        iframe.setAttribute('src', '');
        setTimeout(() => iframe.setAttribute('src', src), 100);
      }
    }
  }

  window.StudentHub.openModal = openModal;
  window.StudentHub.closeModal = closeModal;

  /* ---------------- DOM Ready Orchestration ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    /* 1. Sticky Navbar & Active Section Indicator */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"], .nav-link[href^="index.html#"]');

    function onScrollNavbar() {
      const scrollPos = window.scrollY;

      if (navbar) {
        if (scrollPos > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Back to top button visibility
      const backToTopBtn = document.getElementById('back-to-top');
      if (backToTopBtn) {
        if (scrollPos > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      // Highlight active section link
      sections.forEach((section) => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}` || href === `index.html#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScrollNavbar, { passive: true });
    onScrollNavbar();

    /* 2. Mobile Hamburger Drawer */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksContainer) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navLinksContainer.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }
      });

      // Close mobile drawer when clicking a link
      navLinksContainer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navLinksContainer.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          const icon = mobileMenuBtn.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        });
      });
    }

    /* 3. Back to Top Button */
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* 4. Topic Category Filter Tabs */
    const topicTabs = document.querySelectorAll('.topics-tabs .tab-btn');
    const topicCards = document.querySelectorAll('.topics-grid .topic-card');

    if (topicTabs.length > 0 && topicCards.length > 0) {
      topicTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          topicTabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');

          const category = tab.getAttribute('data-category');

          topicCards.forEach((card) => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
              card.style.display = 'flex';
              card.style.animation = 'fadeInUp 0.3s ease';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }

    /* 5. FAQ Accordion Interaction */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      if (trigger) {
        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close all other items for clean accordion UX
          faqItems.forEach((other) => {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-trigger');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          if (!isActive) {
            item.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });

    /* 6. Universal Modal Backdrop & Close Triggers */
    document.querySelectorAll('.modal-overlay').forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    /* 7. Interactive Syllabus / Course Details Modal */
    const courseModal = document.getElementById('course-details-modal');
    document.querySelectorAll('[data-view-syllabus]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = btn.getAttribute('data-title') || 'Course Overview';
        const level = btn.getAttribute('data-level') || 'Beginner';
        const lessons = btn.getAttribute('data-lessons') || '25 Lessons';
        const topics = btn.getAttribute('data-topics') || 'Variables, Functions, Arrays, Loops';
        const courseId = btn.getAttribute('data-course-id') || 'c-programming';

        if (courseModal) {
          const titleEl = document.getElementById('modal-course-title');
          const metaEl = document.getElementById('modal-course-meta');
          const topicsEl = document.getElementById('modal-course-topics');
          const enrollBtn = document.getElementById('modal-course-enroll');

          if (titleEl) titleEl.textContent = title;
          if (metaEl) metaEl.innerHTML = `<span><i class="fa-solid fa-graduation-cap"></i> ${level}</span> • <span><i class="fa-solid fa-book-open"></i> ${lessons}</span>`;
          if (topicsEl) {
            const list = topics.split(',').map((t) => `<li style="padding:0.4rem 0;"><i class="fa-solid fa-check" style="color:var(--accent-green); margin-right:0.5rem;"></i> ${t.trim()}</li>`).join('');
            topicsEl.innerHTML = `<ul style="margin-top:0.5rem;">${list}</ul>`;
          }
          if (enrollBtn) {
            enrollBtn.setAttribute('data-course-id', courseId);
            enrollBtn.setAttribute('data-course-title', title);
          }

          openModal('course-details-modal');
        }
      });
    });

    /* 8. Interactive Resource View Modal */
    const resourceModal = document.getElementById('resource-view-modal');
    document.querySelectorAll('[data-view-resource]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = btn.getAttribute('data-resource-title') || 'Resource Details';
        const desc = btn.getAttribute('data-resource-desc') || 'Comprehensive study resource for college learners.';

        if (resourceModal) {
          const resTitleEl = document.getElementById('modal-resource-title');
          const resDescEl = document.getElementById('modal-resource-desc');
          if (resTitleEl) resTitleEl.textContent = title;
          if (resDescEl) resDescEl.textContent = desc;

          openModal('resource-view-modal');
        }
      });
    });

    /* 9. Video Preview / YouTube Player Modal */
    const videoModal = document.getElementById('video-modal');
    document.querySelectorAll('[data-video-url]').forEach((card) => {
      card.addEventListener('click', (e) => {
        // Only trigger modal preview if clicked on play overlay or thumbnail
        if (e.target.closest('.play-button-overlay') || e.target.closest('.video-thumbnail')) {
          e.preventDefault();
          const videoTitle = card.getAttribute('data-video-title') || 'Coding Tutorial Video';
          const ytUrl = card.getAttribute('data-video-url') || 'https://www.youtube.com';

          if (videoModal) {
            const vTitleEl = document.getElementById('modal-video-title');
            const vLinkEl = document.getElementById('modal-video-external');
            if (vTitleEl) vTitleEl.textContent = videoTitle;
            if (vLinkEl) vLinkEl.setAttribute('href', ytUrl);

            openModal('video-modal');
          } else {
            window.open(ytUrl, '_blank', 'noopener,noreferrer');
          }
        }
      });
    });

    /* 10. Newsletter Subscription Form */
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        if (input && input.value.trim()) {
          showToast('Thank you for subscribing to StudentHub study alerts! 📬', 'success');
          input.value = '';
        }
      });
    }

    /* 11. Animated Stat Counters */
    const statCounters = document.querySelectorAll('.stat-counter');
    let countersAnimated = false;

    function animateCounters() {
      if (countersAnimated) return;
      const heroStats = document.querySelector('.hero-stats');
      if (!heroStats) return;

      const rect = heroStats.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        countersAnimated = true;
        statCounters.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const step = Math.ceil(target / 40);

          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              counter.textContent = target + suffix;
              clearInterval(interval);
            } else {
              counter.textContent = count + suffix;
            }
          }, 25);
        });
      }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();
  });
})();
