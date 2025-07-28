// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeFeaturedItems();
    initializeFormValidation();
    initializeImageSliders();
    initializeSearch();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Featured items data and display
function initializeFeaturedItems() {
    const featuredItems = [
        {
            id: 1,
            name: "Professional DSLR Camera",
            category: "cameras",
            price: "$45/day",
            rating: 4.8,
            image: "https://via.placeholder.com/300x200/3498db/ffffff?text=DSLR+Camera",
            description: "High-quality DSLR camera perfect for photography projects"
        },
        {
            id: 2,
            name: "Power Drill Set",
            category: "tools",
            price: "$25/day",
            rating: 4.6,
            image: "https://via.placeholder.com/300x200/e74c3c/ffffff?text=Power+Drill",
            description: "Complete power drill set with various bits"
        },
        {
            id: 3,
            name: "Laptop - Gaming",
            category: "electronics",
            price: "$35/day",
            rating: 4.9,
            image: "https://via.placeholder.com/300x200/2ecc71/ffffff?text=Gaming+Laptop",
            description: "High-performance gaming laptop for work or play"
        },
        {
            id: 4,
            name: "Mountain Bike",
            category: "vehicles",
            price: "$30/day",
            rating: 4.7,
            image: "https://via.placeholder.com/300x200/f39c12/ffffff?text=Mountain+Bike",
            description: "Premium mountain bike for outdoor adventures"
        }
    ];

    const featuredContainer = document.getElementById('featuredItems');
    if (featuredContainer) {
        displayItems(featuredItems, featuredContainer);
    }
}

// Display items function
function displayItems(items, container) {
    container.innerHTML = '';
    
    items.forEach(item => {
        const itemCard = createItemCard(item);
        container.appendChild(itemCard);
    });
}

// Create item card
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card fade-in';
    
    const stars = '★'.repeat(Math.floor(item.rating)) + '☆'.repeat(5 - Math.floor(item.rating));
    
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="item-card-content">
            <h3>${item.name}</h3>
            <p class="price">${item.price}</p>
            <div class="rating">
                <span class="stars">${stars}</span>
                <span>(${item.rating})</span>
            </div>
            <p>${item.description}</p>
            <a href="book.html?item=${item.id}" class="btn btn-primary">Book Now</a>
        </div>
    `;
    
    return card;
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', performSearch);
    }
}

// Search function
function searchItems() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categorySelect')?.value || '';
    
    // In a real application, this would make an API call
    // For now, we'll redirect to browse page with parameters
    let url = 'browse.html?';
    if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
    if (category) url += `category=${encodeURIComponent(category)}&`;
    
    window.location.href = url;
}

// Perform search (for live search)
function performSearch() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categorySelect')?.value || '';
    
    // This would typically filter items in real-time
    console.log('Searching for:', searchTerm, 'in category:', category);
}

// Debounce function for search optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    });
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(field)} is required`;
        isValid = false;
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    // Password validation
    else if (fieldType === 'password' && value) {
        if (value.length < 6) {
            errorMessage = 'Password must be at least 6 characters long';
            isValid = false;
        }
    }
    // Date validation (for booking dates)
    else if (fieldType === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errorMessage = 'Please select a future date';
            isValid = false;
        }
    }
    // Custom validation for specific fields
    else if (fieldName === 'confirmPassword') {
        const passwordField = document.querySelector('[name="password"]');
        if (passwordField && value !== passwordField.value) {
            errorMessage = 'Passwords do not match';
            isValid = false;
        }
    }
    
    if (isValid) {
        clearError(field);
    } else {
        showError(field, errorMessage);
    }
    
    return isValid;
}

// Show error message
function showError(field, message) {
    clearError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    field.parentNode.appendChild(errorDiv);
}

// Clear error message
function clearError(field) {
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Get field label for error messages
function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    
    return field.placeholder || field.name || 'This field';
}

// Image slider functionality
function initializeImageSliders() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        createImageSlider(slider);
    });
}

// Create image slider
function createImageSlider(container) {
    const images = container.querySelectorAll('img');
    if (images.length <= 1) return;
    
    let currentIndex = 0;
    
    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-btn prev-btn';
    prevBtn.innerHTML = '&#8249;';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-btn next-btn';
    nextBtn.innerHTML = '&#8250;';
    
    // Create dots indicator
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    
    images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Navigation functions
    function goToSlide(index) {
        images[currentIndex].classList.remove('active');
        dotsContainer.children[currentIndex].classList.remove('active');
        
        currentIndex = index;
        
        images[currentIndex].classList.add('active');
        dotsContainer.children[currentIndex].classList.add('active');
    }
    
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % images.length;
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        goToSlide(prevIndex);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play
    setInterval(nextSlide, 5000);
    
    // Append elements
    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
    container.appendChild(dotsContainer);
    
    // Initialize first image as active
    images[0].classList.add('active');
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.category-card, .item-card, .step');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Show/Hide functionality
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('hidden');
    }
}

// Show success message
function showSuccessMessage(message, containerId = 'messageContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message fade-in';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    container.appendChild(successDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Show loading spinner
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

// Hide loading spinner
function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const loading = container.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

// Local Storage functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Date formatting utility
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Price formatting utility
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Form submission handler for AJAX requests
function submitFormAjax(form, successCallback, errorCallback) {
    const formData = new FormData(form);
    
    fetch(form.action || window.location.href, {
        method: form.method || 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(data => {
        if (successCallback) successCallback(data);
    })
    .catch(error => {
        console.error('Error:', error);
        if (errorCallback) errorCallback(error);
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// URL parameter utility
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Cookie utility functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Export functions for use in other files
window.RentEasy = {
    searchItems,
    validateForm,
    validateField,
    showSuccessMessage,
    showLoading,
    hideLoading,
    toggleElement,
    saveToLocalStorage,
    getFromLocalStorage,
    formatDate,
    formatPrice,
    submitFormAjax,
    getUrlParameter,
    setCookie,
    getCookie
};