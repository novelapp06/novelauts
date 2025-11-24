// Cart functionality
let cart = [];
const cartItems = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const cartCountEl = document.getElementById('cart-count');
const ticketConcert = document.getElementById('ticket-concert');
const ticketNumber = document.getElementById('ticket-number');
const ticketQr = document.getElementById('ticket-qr');
const themeToggleBtn = document.getElementById('theme-toggle');

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    try{
        const saved = localStorage.getItem('theme') || 'dark';
        applyTheme(saved);
        if(themeToggleBtn) themeToggleBtn.textContent = saved === 'light' ? '☀️' : '🌙';
    }catch(e){console.warn(e)}
});

// Theme toggle handler
if(themeToggleBtn){
    themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
        themeToggleBtn.textContent = next === 'light' ? '☀️' : '🌙';
    });
}

function applyTheme(theme){
    try{
        document.documentElement.setAttribute('data-theme', theme);
        if(theme === 'light'){
            document.body.classList.add('theme-light');
            document.body.classList.remove('theme-dark');
        }else{
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
        }
    }catch(e){console.warn(e)}
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const concert = btn.dataset.concert;
        const price = parseInt(btn.dataset.price);
        cart.push({ concert, price });
        updateCart();
        animateAddToCart(btn);
    });
});

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `<p>${item.concert} - Rp ${item.price.toLocaleString()}</p><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>`;
        cartItems.appendChild(itemEl);
    });
    totalPriceEl.textContent = total.toLocaleString();
    if(cartCountEl) cartCountEl.textContent = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        document.getElementById('cart').classList.add('d-none');
        document.getElementById('payment').classList.remove('d-none');
    }
});

document.getElementById('confirm-payment').addEventListener('click', () => {
    // Simulate payment success
    document.getElementById('payment').classList.add('d-none');
    document.getElementById('ticket').classList.remove('d-none');
    const ticketNum = Math.random().toString(36).substr(2, 9).toUpperCase();
    ticketConcert.textContent = cart[0].concert; // Assuming one ticket for simplicity
    ticketNumber.textContent = ticketNum;
    ticketQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketNum}`;
    cart = []; // Clear cart
    updateCart();
});

// Small UI helpers
function animateAddToCart(button){
    try{
        if(button){
            button.classList.add('pulse');
            setTimeout(()=>button.classList.remove('pulse'),600);
        }
        if(totalPriceEl){
            totalPriceEl.classList.add('total-highlight');
            setTimeout(()=>totalPriceEl.classList.remove('total-highlight'),700);
        }
    }catch(e){console.warn(e)}
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:text/javascript;base64,' + btoa(`
        self.addEventListener('install', event => {
            console.log('Service Worker installing.');
        });
        self.addEventListener('activate', event => {
            console.log('Service Worker activating.');
        });
        self.addEventListener('fetch', event => {
            // Cache strategy: Network first, fallback to cache
            event.respondWith(
                fetch(event.request).catch(() => caches.match(event.request))
            );
        });
    `)).then(registration => {
        console.log('Service Worker registered');
    }).catch(error => {
        console.log('Service Worker registration failed');
    });
}