// DOM Elements
const joinClassModal = document.getElementById('joinClassModal');
const addClassBtn = document.getElementById('addClassBtn');
const cancelJoinBtn = document.getElementById('cancelJoin');
const confirmJoinBtn = document.getElementById('confirmJoin');
const classCodeInput = document.getElementById('classCode');
const classesContainer = document.getElementById('classesContainer');
const emptyClassState = document.getElementById('emptyClassState');
const classTemplate = document.getElementById('classTemplate');
const emptyTaskState = document.getElementById('emptyTaskState');
const taskItems = document.getElementById('taskItems');
const calendarDays = document.getElementById('calendarDays');
const currentMonthElem = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// Dropdown Toggle
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Calendar Variables
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = null; // Track the selected date

// Class Counter
let classCounter = 0; // Initialize a counter for classes

// Initialize the app
function init() {
    // Reset localStorage to ensure a fresh start
    localStorage.removeItem('hasClasses');
    
    // Clear any existing sidebar class items
    if (dropdownMenu) {
        dropdownMenu.innerHTML = '';
    }
    
    setupEventListeners();
    
    // Only call generateCalendar if the required elements exist
    if (calendarDays && currentMonthElem) {
        generateCalendar();
    } else {
        console.error('Calendar elements not found. Make sure calendarDays and currentMonthElem exist in the DOM.');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Add class button
    if (addClassBtn && joinClassModal) {
        addClassBtn.addEventListener('click', () => {
            joinClassModal.style.display = 'block';
        });
    }

    // Cancel button in modal
    if (cancelJoinBtn && joinClassModal) {
        cancelJoinBtn.addEventListener('click', () => {
            joinClassModal.style.display = 'none';
            classCodeInput.value = '';
        });
    }

    // Join button in modal
    if (confirmJoinBtn && joinClassModal) {
        confirmJoinBtn.addEventListener('click', () => {
            const classCode = classCodeInput.value.trim();
            if (isValidClassCode(classCode)) {
                addClass(classCode);
                joinClassModal.style.display = 'none';
                classCodeInput.value = '';
            } else {
                alert('Please enter a valid class code (5-7 letters or numbers, no spaces or symbols)');
            }
        });
    }

    // Dropdown toggle
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownToggle.classList.toggle('active');
            dropdownMenu.classList.toggle('show');
        });
    }

    // Calendar navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            navigateMonth(-1);
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            navigateMonth(1);
        });
    }

    // Close modal when clicking outside
    if (joinClassModal) {
        window.addEventListener('click', (e) => {
            if (e.target === joinClassModal) {
                joinClassModal.style.display = 'none';
                classCodeInput.value = '';
            }
        });
    }
}

// Validate class code (5-7 alphanumeric characters)
function isValidClassCode(code) {
    return /^[a-zA-Z0-9]{5,7}$/.test(code);
}

// Add a class and update UI
function addClass(classCode) {
    if (!emptyClassState || !classTemplate || !classesContainer) return;

    // Increment the class counter
    classCounter++;

    // Hide empty state
    emptyClassState.style.display = 'none';
    
    // Clone and customize the template
    const newClass = classTemplate.cloneNode(true);
    newClass.id = '';
    newClass.style.display = 'block';
    
    // Set class details dynamically
    newClass.querySelector('.class-title').textContent = `Class ${classCounter}`; // Dynamic class number
    newClass.querySelector('.class-code').textContent = classCode.toUpperCase();
    newClass.querySelector('.class-instructor').textContent = 'Instructor';
    
    // Add to container
    classesContainer.appendChild(newClass);
    
    // Add class to sidebar
    if (dropdownMenu) {
        const classItem = document.createElement('li');
        classItem.className = 'class-item';
        classItem.innerHTML = `
            <a href="#">
                <i class="fa fa-circle"></i>
                <span>Class ${classCounter}</span> <!-- Dynamic class number -->
            </a>
        `;
        dropdownMenu.appendChild(classItem);
    }
    
    // Show the dropdown menu
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.classList.add('active');
        dropdownMenu.classList.add('show');
    }
    
    // Set flag in localStorage
    localStorage.setItem('hasClasses', 'true');
    
    // Show tasks and update stats
    showTasks();
    updateClassCount();
}

// Show tasks
function showTasks() {
    if (!emptyTaskState || !taskItems) return;

    emptyTaskState.style.display = 'none';
    taskItems.style.display = 'block';
    
    // Clear any existing tasks
    taskItems.innerHTML = '';
    
    // Add sample tasks
    taskItems.innerHTML = `
        <div class="task-item">
            <div class="task-icon">
                <i class="fa fa-clipboard-list"></i>
            </div>
            <div class="task-details">
                <h4 class="task-title">Activity 1: Sample Activity</h4>
                <p class="task-class">Class ${classCounter}</p> <!-- Update task class dynamically -->
                <p class="task-due">Mon, 3 Mar, 11:59 PM</p>
            </div>
        </div>
        <div class="task-item">
            <div class="task-icon">
                <i class="fa fa-clipboard-list"></i>
            </div>
            <div class="task-details">
                <h4 class="task-title">Activity 2: Sample Activity</h4>
                <p class="task-class">Class ${classCounter}</p> <!-- Update task class dynamically -->
                <p class="task-due">Tue, 4 Mar, 11:59 PM</p>
            </div>
        </div>
        <div class="task-item">
            <div class="task-icon">
                <i class="fa fa-clipboard-list"></i>
            </div>
            <div class="task-details">
                <h4 class="task-title">Activity 1: Sample Activity</h4>
                <p class="task-class">Class ${classCounter}</p> <!-- Update task class dynamically -->
                <p class="task-due">Wed, 5 Mar, 11:59 PM</p>
            </div>
        </div>
    `;
}

// Update class count in stats
function updateClassCount() {
    const statsCards = document.querySelectorAll('.stat-card');
    if (statsCards[3]) {
        statsCards[3].querySelector('.stat-number').textContent = classCounter; // Update with dynamic counter
    }
}

// Generate calendar
function generateCalendar() {
    if (!calendarDays || !currentMonthElem) return;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    currentMonthElem.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    calendarDays.innerHTML = '';
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayAdjusted = firstDay === 0 ? 7 : firstDay;
    
    for (let i = 1; i < firstDayAdjusted; i++) {
        const prevDate = prevMonthLastDate - firstDayAdjusted + i + 1;
        const dayElement = createDayElement(prevDate, 'other-month');
        calendarDays.appendChild(dayElement);
    }
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    
    for (let i = 1; i <= lastDate; i++) {
        let className = '';
        if (isCurrentMonth && i === today.getDate()) {
            className = 'today';
        }
        const dayElement = createDayElement(i, className);
        calendarDays.appendChild(dayElement);
    }
    
    const totalCells = 42;
    const remainingCells = totalCells - (firstDayAdjusted - 1) - lastDate;
    
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = createDayElement(i, 'other-month');
        calendarDays.appendChild(dayElement);
    }
}

// Create a day element for the calendar
function createDayElement(day, className = '') {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${className}`;
    dayElement.textContent = day;
    
    // Add click event
    dayElement.addEventListener('click', () => {
        if (selectedDate === dayElement) {
            dayElement.classList.remove('selected');
            selectedDate = null;
            const fullDate = new Date(currentYear, currentMonth, day);
            console.log(`Deselected date: ${fullDate.toDateString()}`);
        } else {
            if (selectedDate) {
                selectedDate.classList.remove('selected');
            }
            dayElement.classList.add('selected');
            selectedDate = dayElement;
            const fullDate = new Date(currentYear, currentMonth, day);
            console.log(`Selected date: ${fullDate.toDateString()}`);
        }
    });
    
    return dayElement;
}

// Navigate between months
function navigateMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    
    generateCalendar();
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);