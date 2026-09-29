/**
 * StudentHub - Student Dashboard & Progress Tracking Controller
 * Calculates student stats, persists progress in localStorage, handles interactive lesson checklists,
 * and manages course enrollment and completion state.
 */

(function () {
  'use strict';

  const DASHBOARD_DATA_KEY = 'studenthub_dashboard_data';

  // Default initial curriculum data
  const DEFAULT_STUDENT_DATA = {
    stats: {
      enrolledCount: 3,
      completedCount: 1,
      learningHours: 36,
      streakDays: 7
    },
    activeCourse: {
      id: 'java-programming',
      title: 'Java Programming',
      category: 'Programming',
      instructor: 'Dr. James Gosling / Prof. Priya Nair',
      totalLessons: 35,
      completedLessons: 28,
      progress: 80,
      nextLessonTitle: 'Collections Framework & Generics',
      lessons: [
        { id: 'j-01', title: 'Java Introduction & JVM Architecture', completed: true, duration: '45 mins' },
        { id: 'j-02', title: 'Data Types, Variables & Type Casting', completed: true, duration: '50 mins' },
        { id: 'j-03', title: 'Conditional Statements & Loops in Java', completed: true, duration: '60 mins' },
        { id: 'j-04', title: 'Object-Oriented Programming (Classes & Objects)', completed: true, duration: '75 mins' },
        { id: 'j-05', title: 'Inheritance, Polymorphism & Abstraction', completed: true, duration: '90 mins' },
        { id: 'j-06', title: 'Exception Handling & Custom Exceptions', completed: true, duration: '60 mins' },
        { id: 'j-07', title: 'Collections Framework & Generics', completed: false, duration: '80 mins' },
        { id: 'j-08', title: 'Multi-threading & Concurrency', completed: false, duration: '90 mins' },
        { id: 'j-09', title: 'Java Stream API & Lambda Expressions', completed: false, duration: '70 mins' }
      ]
    },
    enrolledCourses: [
      {
        id: 'java-programming',
        title: 'Java Programming',
        category: 'Programming',
        icon: 'fa-brands fa-java',
        color: '#f97316',
        totalLessons: 35,
        completedLessons: 28,
        progress: 80,
        level: 'Intermediate',
        lastStudied: 'Today'
      },
      {
        id: 'c-programming',
        title: 'Complete C Programming',
        category: 'Programming',
        icon: 'fa-solid fa-c',
        color: '#4f46e5',
        totalLessons: 25,
        completedLessons: 25,
        progress: 100,
        level: 'Beginner',
        lastStudied: 'Yesterday'
      },
      {
        id: 'dsa-mastery',
        title: 'Data Structures & Algorithms',
        category: 'Computer Science',
        icon: 'fa-solid fa-network-wired',
        color: '#0ea5e9',
        totalLessons: 50,
        completedLessons: 22,
        progress: 44,
        level: 'Advanced',
        lastStudied: '3 days ago'
      },
      {
        id: 'web-dev',
        title: 'Full Stack Web Development',
        category: 'Web Development',
        icon: 'fa-solid fa-code',
        color: '#10b981',
        totalLessons: 40,
        completedLessons: 14,
        progress: 35,
        level: 'Beginner',
        lastStudied: '5 days ago'
      }
    ]
  };

  function getStudentData() {
    try {
      const stored = localStorage.getItem(DASHBOARD_DATA_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading dashboard data from localStorage', e);
    }
    // Save default if none exists
    localStorage.setItem(DASHBOARD_DATA_KEY, JSON.stringify(DEFAULT_STUDENT_DATA));
    return JSON.parse(JSON.stringify(DEFAULT_STUDENT_DATA));
  }

  function saveStudentData(data) {
    try {
      localStorage.setItem(DASHBOARD_DATA_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving dashboard data', e);
    }
  }

  // Toggle lesson completed state
  function toggleLesson(lessonId) {
    const data = getStudentData();
    const lesson = data.activeCourse.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    lesson.completed = !lesson.completed;

    // Recalculate active course progress
    const completedCount = data.activeCourse.lessons.filter((l) => l.completed).length;
    const totalCount = data.activeCourse.lessons.length;
    const newProgress = Math.round((completedCount / totalCount) * 100);

    data.activeCourse.progress = newProgress;
    data.activeCourse.completedLessons = Math.min(data.activeCourse.totalLessons, 20 + completedCount);

    // Update in enrolled courses list
    const enrolledMatch = data.enrolledCourses.find((c) => c.id === data.activeCourse.id);
    if (enrolledMatch) {
      enrolledMatch.progress = newProgress;
      enrolledMatch.completedLessons = data.activeCourse.completedLessons;
      if (newProgress === 100) {
        data.stats.completedCount = data.enrolledCourses.filter((c) => c.progress === 100).length;
      }
    }

    // Increment hours slightly on completion
    if (lesson.completed) {
      data.stats.learningHours += 1;
    }

    saveStudentData(data);
    renderDashboardUI();

    if (window.StudentHub && window.StudentHub.showToast) {
      if (lesson.completed) {
        window.StudentHub.showToast(`Lesson completed! Progress updated to ${newProgress}%. 🎉`, 'success');
      } else {
        window.StudentHub.showToast('Lesson marked as incomplete.', 'info');
      }
    }
  }

  // Render dashboard page widgets
  function renderDashboardUI() {
    const user = (window.StudentHubAuth && window.StudentHubAuth.getUser()) || {
      fullName: 'Student'
    };

    const data = getStudentData();

    // 1. Welcome Header
    const welcomeTitleEl = document.getElementById('dash-welcome-name');
    if (welcomeTitleEl) {
      const firstName = user.fullName.split(' ')[0] || 'Student';
      welcomeTitleEl.textContent = `Welcome back, ${firstName}! 👋`;
    }

    const studentDegreeEl = document.getElementById('dash-student-meta');
    if (studentDegreeEl && user.course) {
      studentDegreeEl.textContent = `${user.course} • ${user.year || 'College Student'}`;
    }

    // 2. Stats Cards
    const enrolledEl = document.getElementById('stat-enrolled');
    const completedEl = document.getElementById('stat-completed');
    const hoursEl = document.getElementById('stat-hours');
    const streakEl = document.getElementById('stat-streak');

    if (enrolledEl) enrolledEl.textContent = `${data.enrolledCourses.length}`;
    if (completedEl) completedEl.textContent = `${data.enrolledCourses.filter(c => c.progress === 100).length}`;
    if (hoursEl) hoursEl.textContent = `${data.stats.learningHours} hrs`;
    if (streakEl) streakEl.textContent = `${data.stats.streakDays} Days 🔥`;

    // 3. Continue Learning Banner
    const activeTitle = document.getElementById('continue-course-title');
    const activeProgressText = document.getElementById('continue-progress-percent');
    const activeProgressBar = document.getElementById('continue-progress-bar');
    const activeNextLesson = document.getElementById('continue-next-lesson');

    if (activeTitle) activeTitle.textContent = data.activeCourse.title;
    if (activeProgressText) activeProgressText.textContent = `${data.activeCourse.progress}% Completed`;
    if (activeProgressBar) {
      activeProgressBar.style.width = `${data.activeCourse.progress}%`;
      activeProgressBar.setAttribute('aria-valuenow', data.activeCourse.progress);
    }
    if (activeNextLesson) {
      activeNextLesson.textContent = `Up Next: ${data.activeCourse.nextLessonTitle}`;
    }

    // 4. Interactive Syllabus Checklist
    const syllabusListEl = document.getElementById('dash-syllabus-list');
    if (syllabusListEl) {
      syllabusListEl.innerHTML = '';
      data.activeCourse.lessons.forEach((l) => {
        const item = document.createElement('div');
        item.className = `lesson-check-item ${l.completed ? 'completed' : ''}`;
        item.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <input type="checkbox" id="chk-${l.id}" ${l.completed ? 'checked' : ''} style="cursor:pointer; width:18px; height:18px;">
            <label for="chk-${l.id}" style="cursor:pointer; font-weight:600; color:var(--text-primary);">${l.title}</label>
          </div>
          <span style="font-size:0.8rem; color:var(--text-muted);">${l.duration}</span>
        `;

        const chk = item.querySelector('input');
        chk.addEventListener('change', () => {
          toggleLesson(l.id);
        });

        syllabusListEl.appendChild(item);
      });
    }

    // 5. Enrolled Courses List
    const enrolledListEl = document.getElementById('dash-enrolled-list');
    if (enrolledListEl) {
      enrolledListEl.innerHTML = '';
      data.enrolledCourses.forEach((course) => {
        const cEl = document.createElement('div');
        cEl.className = 'enrolled-course-item';
        cEl.innerHTML = `
          <div class="enrolled-info">
            <div class="enrolled-icon" style="background:${course.color};">
              <i class="${course.icon}"></i>
            </div>
            <div class="enrolled-meta">
              <h4>${course.title}</h4>
              <p>${course.completedLessons} of ${course.totalLessons} lessons • ${course.level}</p>
            </div>
          </div>
          <div style="text-align:right; min-width:140px;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">
              ${course.progress}%
            </div>
            <div class="progress-track" style="height:6px; width:130px;">
              <div class="progress-fill" style="width:${course.progress}%;"></div>
            </div>
          </div>
        `;
        enrolledListEl.appendChild(cEl);
      });
    }
  }

  // Handle "Start Course" click from course cards
  function enrollInCourse(courseId, courseTitle) {
    const data = getStudentData();
    let course = data.enrolledCourses.find((c) => c.id === courseId);

    if (!course) {
      course = {
        id: courseId,
        title: courseTitle,
        category: 'Programming',
        icon: 'fa-solid fa-code',
        color: '#4f46e5',
        totalLessons: 30,
        completedLessons: 1,
        progress: 5,
        level: 'Intermediate',
        lastStudied: 'Just now'
      };
      data.enrolledCourses.unshift(course);
      data.stats.enrolledCount = data.enrolledCourses.length;
    }

    data.activeCourse.id = course.id;
    data.activeCourse.title = course.title;
    data.activeCourse.progress = course.progress;

    saveStudentData(data);

    if (window.StudentHub && window.StudentHub.showToast) {
      window.StudentHub.showToast(`Enrolled in "${courseTitle}". Happy learning! 🚀`, 'success');
    }

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Only render on dashboard page
    if (document.body.classList.contains('page-dashboard') || document.getElementById('dash-welcome-name')) {
      renderDashboardUI();

      // "Continue Learning" button
      const continueBtn = document.getElementById('btn-continue-learning');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          const syllabus = document.getElementById('dash-syllabus-list');
          if (syllabus) {
            syllabus.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.StudentHub && window.StudentHub.showToast) {
              window.StudentHub.showToast('Continuing your Java Programming session...', 'info');
            }
          }
        });
      }
    }

    // Attach event listeners for course enroll buttons on courses and home pages
    document.querySelectorAll('[data-course-enroll]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cid = btn.getAttribute('data-course-id') || 'c-programming';
        const title = btn.getAttribute('data-course-title') || 'Programming Course';
        enrollInCourse(cid, title);
      });
    });
  });

  window.StudentHubDashboard = {
    getData: getStudentData,
    saveData: saveStudentData,
    toggleLesson: toggleLesson,
    enroll: enrollInCourse,
    refresh: renderDashboardUI
  };
})();
