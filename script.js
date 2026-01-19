// ===== CONFIGURATION =====
const CONFIG = {
    product: {
        name: 'Feral Tee',
        price: 3200,
        sizes: ['M', 'L', 'XL', 'XXL']
    }
};

// ===== STATE =====
let state = {
    cart: [],
    selectedSize: 'M',
    currentModal: null
};

// ===== DOM ELEMENTS =====
const elements = {
    // Cart
    cartToggle: document.getElementById('cartToggle'),
    cartClose: document.getElementById('cartClose'),
    cartCount: document.getElementById('cartCount'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartBody: document.getElementById('cartBody'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    
    // Product
    sizeOptions: document.querySelectorAll('.size-option'),
    addToCartBtn: document.getElementById('addToCart'),
    
    // Modals
    sizeGuideTrigger: document.querySelector('.size-guide-trigger'),
    sizeGuideModal: document.getElementById('sizeGuide'),
    checkoutModal: document.getElementById('checkoutModal'),
    successModal: document.getElementById('successModal'),
    closeSuccess: document.getElementById('closeSuccess'),
    
    // Forms
    checkoutForm: document.getElementById('checkoutForm'),
    orderItems: document.getElementById('orderItems'),
    orderTotal: document.getElementById('orderTotal'),
    paymentAmount: document.getElementById('paymentAmount'),
    orderId: document.getElementById('orderId'),
    
    // UI
    menuToggle: document.getElementById('menuToggle'),
    mobileMenu: document.getElementById('mobileMenu'),
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notificationText'),
    faqQuestions: document.querySelectorAll('.faq-question')
};

// ===== INITIALIZATION =====
function init() {
    loadCart();
    setupEventListeners();
    updateCartUI();
    
    // Hide preloader
    setTimeout(() => {
        document.querySelector('.preloader').classList.add('hidden');
    }, 1000);
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile menu
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', () => {
            elements.menuToggle.classList.toggle('active');
            elements.mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu on click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.menuToggle.classList.remove('active');
            elements.mobileMenu.classList.remove('active');
        });
    });
    
    // Size selection
    elements.sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            elements.sizeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            state.selectedSize = option.dataset.size;
        });
    });
    
    // Add to cart
    if (elements.addToCartBtn) {
        elements.addToCartBtn.addEventListener('click', addToCart);
    }
    
    // Cart toggle
    if (elements.cartToggle) {
        elements.cartToggle.addEventListener('click', () => {
            elements.cartSidebar.classList.add('active');
        });
    }
    
    if (elements.cartClose) {
        elements.cartClose.addEventListener('click', () => {
            elements.cartSidebar.classList.remove('active');
        });
    }
    
    // Size guide modal
    if (elements.sizeGuideTrigger) {
        elements.sizeGuideTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('sizeGuide');
        });
    }
    
    // Checkout
    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', openCheckout);
    }
    
    // Checkout form
if (elements.checkoutForm) {
        elements.checkoutForm.addEventListener('submit', submitOrder);
    }
    
    // Success modal
    if (elements.closeSuccess) {
        elements.closeSuccess.addEventListener('click', () => {
            elements.successModal.style.display = 'none';
        });
    }
    
    // FAQ
    elements.faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            question.classList.toggle('active');
            answer.classList.toggle('active');
        });
    });
    
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay, .modal-close').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || 
                e.target.classList.contains('modal-close')) {
                closeAllModals();
            }
        });
    });
    
    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
            elements.cartSidebar.classList.remove('active');
        }
    });
}

// ===== CART FUNCTIONS =====
function loadCart() {
    const savedCart = localStorage.getItem('feralsense_cart');
    if (savedCart) {
        state.cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem('feralsense_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
    
    // Update cart sidebar
    if (state.cart.length === 0) {
        elements.cartEmpty.style.display = 'block';
        elements.cartBody.innerHTML = '';
        elements.checkoutBtn.disabled = true;
    } else {
        elements.cartEmpty.style.display = 'none';
        renderCartItems();
        elements.checkoutBtn.disabled = false;
    }
    
    // Update total
    const total = calculateCartTotal();
    elements.cartTotal.textContent = '${total} ₽';
}

function renderCartItems() {
    elements.cartBody.innerHTML = '';
    
    state.cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke-width="1.5"/>
                    <path d="M3 6H21" stroke-width="1.5"/>
                </svg>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-meta">Размер: ${item.size}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-index="${index}">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">Удалить</button>
                </div>
            </div>
        `;
        
        elements.cartBody.appendChild(itemElement);
    });
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            updateQuantity(index, 1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            updateQuantity(index, -1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeFromCart(index);
        });
    });
}

function calculateCartTotal() {
    return state.cart.reduce((total, item) => total + (CONFIG.product.price * item.quantity), 0);
}

function addToCart() {
    const existingItemIndex = state.cart.findIndex(item => item.size === state.selectedSize);
    
    if (existingItemIndex > -1) {
        state.cart[existingItemIndex].quantity += 1;
    } else {
        state.cart.push({
            name: CONFIG.product.name,
            size: state.selectedSize,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Добавлено в корзину');
    elements.cartSidebar.classList.add('active');
}

function updateQuantity(index, change) {
    state.cart[index].quantity += change;
    
    if (state.cart[index].quantity <= 0) {
        state.cart.splice(index, 1);
    }
    
    saveCart();
    updateCartUI();
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showNotification('Удалено из корзины');
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    closeAllModals();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        state.currentModal = modalId;
        document.body.style.overflow = 'hidden';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    elements.cartSidebar.classList.remove('active');
    state.currentModal = null;
    document.body.style.overflow = '';
}

function openCheckout() {
    if (state.cart.length === 0) {
        showNotification('Добавьте товары в корзину');
        return;
    }
    
    closeAllModals();
    
    // Update order summary
    let itemsHTML = '';
    state.cart.forEach(item => {
        itemsHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${item.name} (${item.size}) × ${item.quantity}</span>
                <span>${CONFIG.product.price * item.quantity} ₽</span>
            </div>
        `;
    });
    
    elements.orderItems.innerHTML = itemsHTML;
    elements.orderTotal.textContent = ${calculateCartTotal()} ₽;
    
    openModal('checkoutModal');
}

async function submitOrder(e) {
    e.preventDefault();
    
    // Simple validation
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!name  !phone  !address) {
        showNotification('Заполните все обязательные поля');
        return;
    }
    
    // Generate order ID
    const orderId = 'FS' + Date.now().toString().slice(-6);
    
    // Update success modal
    elements.paymentAmount.textContent = calculateCartTotal();
    elements.orderId.textContent = orderId;
    
    // Save order (you can send to Telegram/email here)
    const order = {
        id: orderId,
        date: new Date().toISOString(),
        customer: { name, phone, address },
        items: [...state.cart],
        total: calculateCartTotal()
    };
    
    localStorage.setItem('feralsense_last_order', JSON.stringify(order));
    
    // Show success modal
    closeAllModals();
    openModal('successModal');
    
    // Clear cart
    state.cart = [];
    saveCart();
    updateCartUI();
    
    // You can add Telegram/email sending here
    // await sendToTelegram(order);
}

// ===== UI HELPERS =====
function showNotification(message) {
    elements.notificationText.textContent = message;
    elements.notification.classList.add('show');
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// ===== START APP =====
document.addEventListener('DOMContentLoaded', init);
