/**
 * StudentHub - Authentication Controller
 * Handles user signup, login, demo sessions, form validation, and localStorage persistence.
 * Structured to allow easy migration to Firebase / MongoDB / REST backend APIs.
 */

(function () {
  'use strict';

  const USERS_STORAGE_KEY = 'studenthub_users';
  const CURRENT_USER_KEY = 'studenthub_current_user';

  // Seed default demo user if not present
  function initUsers() {
    const existing = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existing) {
      const defaultUsers = [
        {
          id: 'user_demo_101',
          fullName: 'Aarav Sharma',
          email: 'student@studenthub.edu',
          phone: '+91 98765 43210',
          course: 'B.Tech',
          year: '3rd Year',
          password: 'password123',
          createdAt: new Date().toISOString(),
          enrolledCourses: ['c-programming', 'java-programming', 'dsa-mastery'],
          completedLessons: 42,
          learningHours: 36,
          streakDays: 7,
          lastActiveCourse: {
            id: 'java-programming',
            title: 'Java Programming',
            progress: 80,
            currentLesson: 'Collections Framework & Generics'
          }
        }
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }

  initUsers();

  function getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    updateNavAuthState();
  }

  function registerUser(userData) {
    const users = getAllUsers();
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase().trim());
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser = {
      id: 'user_' + Date.now(),
      fullName: userData.fullName.trim(),
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone.trim(),
      course: userData.course,
      year: userData.year,
      password: userData.password,
      createdAt: new Date().toISOString(),
      enrolledCourses: ['java-programming', 'python-beginners'],
      completedLessons: 12,
      learningHours: 8,
      streakDays: 3,
      lastActiveCourse: {
        id: 'java-programming',
        title: 'Java Programming',
        progress: 80,
        currentLesson: 'Object-Oriented Programming & Classes'
      }
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  }

  function loginUser(email, password) {
    const users = getAllUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }

    return { success: false, message: 'Invalid email or password. Please try again or use the demo login.' };
  }

  function logoutUser() {
    setCurrentUser(null);
    if (window.StudentHub && window.StudentHub.showToast) {
      window.StudentHub.showToast('You have been logged out successfully.', 'info');
    }
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  }

  // Update navigation items based on auth state
  function updateNavAuthState() {
    const currentUser = getCurrentUser();
    const authActionsContainer = document.querySelectorAll('.nav-auth-actions');

    authActionsContainer.forEach((container) => {
      if (currentUser) {
        container.innerHTML = `
          <a href="dashboard.html" class="user-menu-btn" title="Go to Student Dashboard">
            <span class="user-avatar-sm">${currentUser.fullName.charAt(0).toUpperCase()}</span>
            <span>${currentUser.fullName.split(' ')[0]}</span>
          </a>
          <button type="button" class="btn btn-outline btn-sm btn-logout" title="Sign out of your account">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        `;
      } else {
        container.innerHTML = `
          <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
          <a href="signup.html" class="btn btn-primary btn-sm">Get Started</a>
        `;
      }
    });

    document.querySelectorAll('.btn-logout').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
      });
    });
  }

  // Form Validation Utilities
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFieldError(fieldId, errorMsg) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (input) {
      input.classList.add('is-invalid');
    }
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.classList.add('visible');
    }
  }

  function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (input) {
      input.classList.remove('is-invalid');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.form-input').forEach((input) => input.classList.remove('is-invalid'));
    form.querySelectorAll('.field-error-msg').forEach((el) => {
      el.textContent = '';
      el.classList.remove('visible');
    });
  }

  // Wire up Signup and Login pages if present
  document.addEventListener('DOMContentLoaded', () => {
    updateNavAuthState();

    // Signup form handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllErrors(signupForm);

        let isValid = true;
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const course = document.getElementById('course').value;
        const year = document.getElementById('year').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        if (!fullName) {
          setFieldError('fullName', 'Please enter your full name.');
          isValid = false;
        }

        if (!email) {
          setFieldError('email', 'Email address is required.');
          isValid = false;
        } else if (!validateEmail(email)) {
          setFieldError('email', 'Please enter a valid email address.');
          isValid = false;
        }

        if (!phone) {
          setFieldError('phone', 'Phone number is required.');
          isValid = false;
        }

        if (!course) {
          setFieldError('course', 'Please select your degree/course.');
          isValid = false;
        }

        if (!year) {
          setFieldError('year', 'Please select your academic year.');
          isValid = false;
        }

        if (!password) {
          setFieldError('password', 'Password is required.');
          isValid = false;
        } else if (password.length < 6) {
          setFieldError('password', 'Password must be at least 6 characters.');
          isValid = false;
        }

        if (confirmPassword !== password) {
          setFieldError('confirmPassword', 'Passwords do not match.');
          isValid = false;
        }

        if (!terms) {
          setFieldError('terms', 'You must agree to the Terms & Conditions.');
          isValid = false;
        }

        if (!isValid) return;

        const res = registerUser({
          fullName,
          email,
          phone,
          course,
          year,
          password
        });

        if (res.success) {
          if (window.StudentHub && window.StudentHub.showToast) {
            window.StudentHub.showToast('Account created successfully! Welcome to StudentHub 🎉', 'success');
          }
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 800);
        } else {
          setFieldError('email', res.message);
          if (window.StudentHub && window.StudentHub.showToast) {
            window.StudentHub.showToast(res.message, 'error');
          }
        }
      });
    }

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllErrors(loginForm);

        let isValid = true;
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email) {
          setFieldError('email', 'Email address is required.');
          isValid = false;
        } else if (!validateEmail(email)) {
          setFieldError('email', 'Please enter a valid email address.');
          isValid = false;
        }

        if (!password) {
          setFieldError('password', 'Password is required.');
          isValid = false;
        }

        if (!isValid) return;

        const res = loginUser(email, password);
        if (res.success) {
          if (window.StudentHub && window.StudentHub.showToast) {
            window.StudentHub.showToast(`Welcome back, ${res.user.fullName}! 👋`, 'success');
          }
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 700);
        } else {
          setFieldError('email', res.message);
          if (window.StudentHub && window.StudentHub.showToast) {
            window.StudentHub.showToast(res.message, 'error');
          }
        }
      });

      // Quick Demo Student Login
      const demoLoginBtn = document.getElementById('demo-login-btn');
      if (demoLoginBtn) {
        demoLoginBtn.addEventListener('click', () => {
          const emailInput = document.getElementById('email');
          const passInput = document.getElementById('password');
          if (emailInput && passInput) {
            emailInput.value = 'student@studenthub.edu';
            passInput.value = 'password123';
            loginForm.dispatchEvent(new Event('submit'));
          }
        });
      }
    }
  });

  window.StudentHubAuth = {
    getUser: getCurrentUser,
    setUser: setCurrentUser,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    updateNav: updateNavAuthState
  };
})();
