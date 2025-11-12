// API Base URL
const API_BASE = 'http://localhost:5000/api';

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const authLink = document.getElementById('authLink');
const bookingsTab = document.getElementById('bookingsTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const searchForm = document.getElementById('searchForm');
const searchResults = document.getElementById('searchResults');
const busesList = document.getElementById('busesList');
const seatsGrid = document.getElementById('seatsGrid');
const confirmBooking = document.getElementById('confirmBooking');
const summaryDetails = document.getElementById('summaryDetails');
const bookingsList = document.getElementById('bookingsList');
const downloadTicket = document.getElementById('downloadTicket');
const newBooking = document.getElementById('newBooking');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// State
let currentUser = null;
let selectedBus = null;
let selectedSeats = [];
let currentBooking = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
    setupDateRestrictions();
    setupCTAButtons();
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            showTab(tab);
        });
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Auth Forms
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm('register');
    });
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm('login');
    });

    // Search
    searchForm.addEventListener('submit', handleSearch);

    // Booking
    confirmBooking.addEventListener('click', handleConfirmBooking);
    downloadTicket.addEventListener('click', handleDownloadTicket);
    newBooking.addEventListener('click', () => showTab('search'));

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Setup CTA Buttons
function setupCTAButtons() {
    // Handle "Book Your Ticket Now" button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            showTab('search');
        });
    }

    // Handle all buttons with data-tab attribute
    document.querySelectorAll('button[data-tab]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            showTab(targetTab);
        });
    });
}

// Setup Date Restrictions
function setupDateRestrictions() {
    const journeyDate = document.getElementById('journeyDate');
    const today = new Date('2025-11-06');
    const minDate = today.toISOString().split('T')[0];
    journeyDate.min = minDate;

    // Set default date to tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    journeyDate.value = tomorrow.toISOString().split('T')[0];
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUIForAuth();
            showTab('home');
            showNotification('Login successful!', 'success');

            // Clear form
            document.getElementById('loginFormElement').reset();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Registration successful! Please login.', 'success');
            showAuthForm('login');

            // Clear form
            document.getElementById('registerFormElement').reset();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateUIForAuth();
    showTab('home');
    showNotification('Logged out successfully!', 'success');
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        // In a real app, you would verify the token with the server
        // For demo purposes, we'll set a mock user
        currentUser = {
            name: 'Demo User',
            email: 'demo@example.com',
            id: 1
        };
        updateUIForAuth();
    }
}

function updateUIForAuth() {
    if (currentUser) {
        authLink.innerHTML = `
            <i class="fas fa-user"></i> ${currentUser.name} 
            <span style="margin: 0 10px">|</span>
            <a href="#" id="logoutLink" style="color: var(--danger-color);">Logout</a>
        `;
        bookingsTab.style.display = 'block';

        document.getElementById('logoutLink').addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    } else {
        authLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        bookingsTab.style.display = 'none';
        document.getElementById('bookingsList').innerHTML =
            '<p class="no-bookings">Please login to view your bookings</p>';
    }
}

// Tab Navigation
function showTab(tabName) {
    console.log('Switching to tab:', tabName);

    // Hide all tabs
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    } else {
        console.error('Tab not found:', tabName);
        // Fallback to home tab
        document.getElementById('home').classList.add('active');
        return;
    }

    // Activate corresponding nav link
    const targetLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Load data for specific tabs
    if (tabName === 'bookings' && currentUser) {
        loadUserBookings();
    }

    // Close mobile menu if open
    navMenu.classList.remove('active');

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAuthForm(formType) {
    if (formType === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
}

// Search Functions
async function handleSearch(e) {
    e.preventDefault();
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const journeyDate = document.getElementById('journeyDate').value;

    if (source === destination) {
        showNotification('Source and destination cannot be the same', 'error');
        return;
    }

    if (!source || !destination || !journeyDate) {
        showNotification('Please fill all search fields', 'error');
        return;
    }

    try {
        showNotification('Searching for buses...', 'info');

        // For demo purposes, use mock data if API is not available
        let buses;
        try {
            const response = await fetch(
                `${API_BASE}/buses/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${journeyDate}`
            );

            if (!response.ok) {
                throw new Error('API not available');
            }

            buses = await response.json();
        } catch (apiError) {
            console.log('Using demo data:', apiError);
            // Use demo data if API is not available
            buses = getDemoBuses().filter(bus =>
                bus.source_city === source &&
                bus.destination_city === destination
            );
        }

        displayBuses(buses);
        showNotification(`Found ${buses.length} buses`, 'success');
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Failed to search buses. Please try again.', 'error');
        busesList.innerHTML = '<p class="no-results">Error loading buses. Please try again.</p>';
    }
}

function displayBuses(buses) {
    if (buses.length === 0) {
        busesList.innerHTML = '<p class="no-results">No buses found for your search criteria.</p>';
    } else {
        busesList.innerHTML = buses.map(bus => `
            <div class="bus-card">
                <div class="bus-info">
                    <h4>${bus.bus_name}</h4>
                    <p>${bus.bus_type} • ${bus.available_seats} Seats Available</p>
                    <p>${bus.source_city} → ${bus.destination_city}</p>
                </div>
                <div class="bus-timing">
                    <p><strong>${formatTime(bus.departure_time)}</strong></p>
                    <p>${formatTime(bus.arrival_time)}</p>
                </div>
                <div class="bus-fare">₹${bus.fare}</div>
                <button class="select-seats-btn" data-bus-id="${bus.id}">
                    Select Seats
                </button>
            </div>
        `).join('');

        // Add event listeners to seat selection buttons
        document.querySelectorAll('.select-seats-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const busId = e.target.getAttribute('data-bus-id');
                const bus = buses.find(b => b.id == busId);
                if (bus) {
                    showSeatSelection(bus);
                } else {
                    showNotification('Bus not found', 'error');
                }
            });
        });
    }

    searchResults.classList.remove('hidden');
}

// Seat Selection Functions
function showSeatSelection(bus) {
    selectedBus = bus;
    selectedSeats = [];
    renderSeatLayout(bus.total_seats);
    updateBookingSummary();
    showTab('seatSelection');
}

function renderSeatLayout(totalSeats) {
    seatsGrid.innerHTML = '';

    // Create seat layout with some random occupied seats for demo
    const occupiedSeats = generateOccupiedSeats(totalSeats);

    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement('div');
        const isOccupied = occupiedSeats.includes(i);

        seat.className = `seat ${isOccupied ? 'occupied' : 'available'}`;
        seat.textContent = i;
        seat.setAttribute('data-seat-number', i);

        if (!isOccupied) {
            seat.addEventListener('click', () => {
                seat.classList.toggle('selected');

                const seatNumber = parseInt(seat.getAttribute('data-seat-number'));
                if (seat.classList.contains('selected')) {
                    selectedSeats.push(seatNumber);
                } else {
                    selectedSeats = selectedSeats.filter(s => s !== seatNumber);
                }

                updateBookingSummary();
            });
        }

        seatsGrid.appendChild(seat);
    }
}

function generateOccupiedSeats(totalSeats) {
    // Generate some random occupied seats for demo (20% of total seats)
    const occupiedCount = Math.floor(totalSeats * 0.2);
    const occupiedSeats = new Set();

    while (occupiedSeats.size < occupiedCount) {
        const randomSeat = Math.floor(Math.random() * totalSeats) + 1;
        occupiedSeats.add(randomSeat);
    }

    return Array.from(occupiedSeats);
}

function updateBookingSummary() {
    const totalAmount = selectedSeats.length * selectedBus.fare;

    summaryDetails.innerHTML = `
        <p><strong>Bus:</strong> ${selectedBus.bus_name}</p>
        <p><strong>Route:</strong> ${selectedBus.source_city} to ${selectedBus.destination_city}</p>
        <p><strong>Departure:</strong> ${formatDateTime(selectedBus.departure_time)}</p>
        <p><strong>Selected Seats:</strong> ${selectedSeats.join(', ') || 'None'}</p>
        <p><strong>Total Seats:</strong> ${selectedSeats.length}</p>
        <p><strong>Fare per Seat:</strong> ₹${selectedBus.fare}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
    `;

    // Enable/disable confirm button based on seat selection
    confirmBooking.disabled = selectedSeats.length === 0;
}

// Booking Functions
async function handleConfirmBooking() {
    if (!currentUser) {
        showNotification('Please login to book tickets', 'error');
        showTab('login');
        return;
    }

    if (selectedSeats.length === 0) {
        showNotification('Please select at least one seat', 'error');
        return;
    }

    try {
        const bookingData = {
            busId: selectedBus.id,
            seatNumbers: selectedSeats,
            totalSeats: selectedSeats.length,
            totalAmount: selectedSeats.length * selectedBus.fare,
            journeyDate: document.getElementById('journeyDate').value
        };

        // For demo purposes, create a mock booking if API is not available
        let bookingResponse;
        try {
            const response = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                throw new Error('API not available');
            }

            bookingResponse = await response.json();
        } catch (apiError) {
            console.log('Using demo booking:', apiError);
            // Create mock booking for demo
            bookingResponse = {
                message: 'Booking created successfully',
                booking: {
                    id: Date.now(),
                    pnr_number: 'PNR' + Date.now(),
                    seat_numbers: selectedSeats.join(','),
                    total_seats: selectedSeats.length,
                    total_amount: selectedSeats.length * selectedBus.fare,
                    journey_date: document.getElementById('journeyDate').value,
                    status: 'confirmed',
                    booking_date: new Date().toISOString()
                }
            };
        }

        currentBooking = bookingResponse.booking;
        showBookingConfirmation(bookingResponse.booking);
        showNotification('Booking confirmed successfully!', 'success');
    } catch (error) {
        console.error('Booking error:', error);
        showNotification('Booking failed. Please try again.', 'error');
    }
}

function showBookingConfirmation(booking) {
    const confirmationDetails = document.getElementById('confirmationDetails');
    confirmationDetails.innerHTML = `
        <p><strong>PNR Number:</strong> ${booking.pnr_number}</p>
        <p><strong>Bus:</strong> ${selectedBus.bus_name}</p>
        <p><strong>Route:</strong> ${selectedBus.source_city} to ${selectedBus.destination_city}</p>
        <p><strong>Journey Date:</strong> ${formatDate(booking.journey_date)}</p>
        <p><strong>Departure Time:</strong> ${formatTime(selectedBus.departure_time)}</p>
        <p><strong>Seats:</strong> ${booking.seat_numbers}</p>
        <p><strong>Total Amount:</strong> ₹${booking.total_amount}</p>
        <p><strong>Status:</strong> <span class="booking-status confirmed">${booking.status}</span></p>
        <p><strong>Booking Date:</strong> ${formatDateTime(booking.booking_date)}</p>
    `;

    showTab('bookingConfirmation');
}

async function loadUserBookings() {
    if (!currentUser) return;

    try {
        let bookings;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/bookings/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('API not available');
            }

            bookings = await response.json();
        } catch (apiError) {
            console.log('Using demo bookings:', apiError);
            // Use demo bookings data
            bookings = [
                {
                    id: 1,
                    bus_name: "Delhi Travels AC",
                    source_city: "Delhi",
                    destination_city: "Jaipur",
                    pnr_number: "PNR1001",
                    journey_date: "2025-11-07",
                    departure_time: "2025-11-07T08:00:00",
                    seat_numbers: "1,2,3",
                    total_amount: 3600,
                    status: "confirmed"
                },
                {
                    id: 2,
                    bus_name: "Maharashtra Sleeper",
                    source_city: "Mumbai",
                    destination_city: "Pune",
                    pnr_number: "PNR1002",
                    journey_date: "2025-11-08",
                    departure_time: "2025-11-08T22:00:00",
                    seat_numbers: "5,6",
                    total_amount: 1600,
                    status: "confirmed"
                }
            ];
        }

        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p class="no-bookings">No bookings found.</p>';
        } else {
            bookingsList.innerHTML = bookings.map(booking => `
                <div class="booking-card">
                    <div class="booking-info">
                        <h4>${booking.bus_name}</h4>
                        <p>${booking.source_city} to ${booking.destination_city}</p>
                        <p>PNR: ${booking.pnr_number}</p>
                    </div>
                    <div class="booking-date">
                        <p><strong>${formatDate(booking.journey_date)}</strong></p>
                        <p>${formatTime(booking.departure_time)}</p>
                    </div>
                    <div class="booking-details">
                        <p>Seats: ${booking.seat_numbers}</p>
                        <p>Amount: ₹${booking.total_amount}</p>
                    </div>
                    <div class="booking-actions">
                        <span class="booking-status ${booking.status}">${booking.status}</span>
                        ${booking.status === 'confirmed' ?
                    `<button class="cancel-btn" data-booking-id="${booking.id}">Cancel</button>` :
                    ''
                }
                    </div>
                </div>
            `).join('');

            // Add event listeners to cancel buttons
            document.querySelectorAll('.cancel-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const bookingId = e.target.getAttribute('data-booking-id');
                    cancelBooking(bookingId);
                });
            });
        }
    } catch (error) {
        console.error('Load bookings error:', error);
        showNotification('Failed to load bookings.', 'error');
        bookingsList.innerHTML = '<p class="no-bookings">Error loading bookings. Please try again.</p>';
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showNotification('Booking cancelled successfully!', 'success');
            loadUserBookings();
        } else {
            const data = await response.json();
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Cancel booking error:', error);
        showNotification('Failed to cancel booking.', 'error');
    }
}

function handleDownloadTicket() {
    if (!currentBooking) {
        showNotification('No booking found to download', 'error');
        return;
    }

    // Create ticket content
    const ticketContent = `
        INDIAN BUS BOOKING SYSTEM
        =========================
        
        PNR Number: ${currentBooking.pnr_number}
        Bus: ${selectedBus.bus_name}
        Route: ${selectedBus.source_city} to ${selectedBus.destination_city}
        Date: ${formatDate(currentBooking.journey_date)}
        Time: ${formatTime(selectedBus.departure_time)}
        Seats: ${currentBooking.seat_numbers}
        Total Amount: ₹${currentBooking.total_amount}
        Status: ${currentBooking.status}
        
        Thank you for choosing Indian Bus Booking!
    `;

    // Create a blob and download link
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${currentBooking.pnr_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Ticket downloaded successfully!', 'success');
}

// Utility Functions
function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification based on type
    const styles = {
        success: { background: 'var(--success-color)' },
        error: { background: 'var(--danger-color)' },
        info: { background: 'var(--primary-color)' },
        warning: { background: 'var(--warning-color)' }
    };

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: 'var(--border-radius)',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease',
        boxShadow: 'var(--box-shadow)',
        ...styles[type]
    });

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Demo data for when backend is not available
// Enhanced demo data with more routes
function getDemoBuses() {
    return [
        // Delhi Routes
        {
            id: 1,
            bus_name: "Delhi Travels AC",
            bus_type: "AC",
            source_city: "Delhi",
            destination_city: "Jaipur",
            departure_time: "2025-11-07T08:00:00",
            arrival_time: "2025-11-07T14:00:00",
            total_seats: 40,
            available_seats: 35,
            fare: 1200
        },
        {
            id: 2,
            bus_name: "Delhi Sleeper Express",
            bus_type: "Sleeper",
            source_city: "Delhi",
            destination_city: "Jaipur",
            departure_time: "2025-11-07T22:00:00",
            arrival_time: "2025-11-08T04:00:00",
            total_seats: 35,
            available_seats: 30,
            fare: 900
        },
        // Mumbai Routes
        {
            id: 3,
            bus_name: "Mumbai Luxury",
            bus_type: "AC",
            source_city: "Mumbai",
            destination_city: "Pune",
            departure_time: "2025-11-08T07:30:00",
            arrival_time: "2025-11-08T11:30:00",
            total_seats: 35,
            available_seats: 28,
            fare: 850
        },
        {
            id: 4,
            bus_name: "Konkan Travels",
            bus_type: "AC",
            source_city: "Mumbai",
            destination_city: "Goa",
            departure_time: "2025-11-12T20:00:00",
            arrival_time: "2025-11-13T08:00:00",
            total_seats: 28,
            available_seats: 20,
            fare: 1800
        },
        // Bangalore Routes
        {
            id: 5,
            bus_name: "Bangalore Luxury",
            bus_type: "AC",
            source_city: "Bangalore",
            destination_city: "Mysore",
            departure_time: "2025-11-10T06:30:00",
            arrival_time: "2025-11-10T11:00:00",
            total_seats: 35,
            available_seats: 25,
            fare: 450
        },
        {
            id: 6,
            bus_name: "Tech City Express",
            bus_type: "AC",
            source_city: "Bangalore",
            destination_city: "Chennai",
            departure_time: "2025-11-15T08:00:00",
            arrival_time: "2025-11-15T15:00:00",
            total_seats: 40,
            available_seats: 32,
            fare: 1200
        },
        // Chennai Routes
        {
            id: 7,
            bus_name: "Chennai Deluxe",
            bus_type: "AC",
            source_city: "Chennai",
            destination_city: "Coimbatore",
            departure_time: "2025-11-12T21:00:00",
            arrival_time: "2025-11-13T05:00:00",
            total_seats: 35,
            available_seats: 28,
            fare: 1500
        },
        {
            id: 8,
            bus_name: "Coastal Deluxe",
            bus_type: "AC",
            source_city: "Chennai",
            destination_city: "Pondicherry",
            departure_time: "2025-11-18T06:30:00",
            arrival_time: "2025-11-18T10:30:00",
            total_seats: 30,
            available_seats: 22,
            fare: 600
        },
        // Kolkata Routes
        {
            id: 9,
            bus_name: "Kolkata Luxury",
            bus_type: "AC",
            source_city: "Kolkata",
            destination_city: "Durgapur",
            departure_time: "2025-11-19T07:00:00",
            arrival_time: "2025-11-19T11:30:00",
            total_seats: 35,
            available_seats: 30,
            fare: 700
        },
        {
            id: 10,
            bus_name: "Eastern Deluxe",
            bus_type: "AC",
            source_city: "Kolkata",
            destination_city: "Bhubaneswar",
            departure_time: "2025-11-22T20:00:00",
            arrival_time: "2025-11-23T06:00:00",
            total_seats: 40,
            available_seats: 35,
            fare: 1300
        },
        // Hyderabad Routes
        {
            id: 11,
            bus_name: "Hyderabad Luxury",
            bus_type: "AC",
            source_city: "Hyderabad",
            destination_city: "Vijayawada",
            departure_time: "2025-11-25T06:30:00",
            arrival_time: "2025-11-25T11:30:00",
            total_seats: 35,
            available_seats: 28,
            fare: 800
        },
        {
            id: 12,
            bus_name: "Deccan Deluxe",
            bus_type: "AC",
            source_city: "Hyderabad",
            destination_city: "Bangalore",
            departure_time: "2025-11-28T08:00:00",
            arrival_time: "2025-11-28T16:00:00",
            total_seats: 40,
            available_seats: 32,
            fare: 1400
        },
        // Special Routes
        {
            id: 13,
            bus_name: "Golden Triangle Deluxe",
            bus_type: "AC",
            source_city: "Delhi",
            destination_city: "Agra",
            departure_time: "2025-12-19T06:00:00",
            arrival_time: "2025-12-19T10:30:00",
            total_seats: 30,
            available_seats: 25,
            fare: 600
        },
        {
            id: 14,
            bus_name: "Kerala Deluxe",
            bus_type: "AC",
            source_city: "Bangalore",
            destination_city: "Kochi",
            departure_time: "2025-12-21T19:00:00",
            arrival_time: "2025-12-22T08:00:00",
            total_seats: 35,
            available_seats: 30,
            fare: 1800
        },
        {
            id: 15,
            bus_name: "Himalayan Deluxe",
            bus_type: "AC",
            source_city: "Delhi",
            destination_city: "Manali",
            departure_time: "2025-12-23T18:00:00",
            arrival_time: "2025-12-24T08:00:00",
            total_seats: 25,
            available_seats: 20,
            fare: 2200
        }
    ];
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);