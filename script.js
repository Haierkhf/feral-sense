classList.add('active');
        });
    });
    
    // Size guide
    elements.sizeGuideLink?.addEventListener('click', (e) => {
        e.preventDefault();
        elements.sizeGuideModal.style.display = 'flex';
    });
    
    elements.closeSizeGuide?.addEventListener('click', () => {
        elements.sizeGuideModal.style.display = 'none';
    });
    
    // Checkout
    elements.checkoutBtn?.addEventListener('click', openCheckout);
    elements.closeCheckout?.addEventListener('click', closeCheckout);
    elements.closeSuccess?.addEventListener('click', closeSuccessModal);
    
    // Checkout steps
    elements.nextStepBtns?.forEach(btn => {
        btn.addEventListener('click', () => nextStep(btn.dataset.next));
    });
    
    elements.prevStepBtns?.forEach(btn => {
        btn.addEventListener('click', () => prevStep(btn.dataset.prev));
    });
    
    // Submit order
    elements.submitOrder?.addEventListener('click', submitOrderForm);
    
    // FAQ
    elements.faqQuestions?.forEach(question => {
        question.addEventListener('click', toggleFAQ);
    });
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === elements.sizeGuideModal) {
            elements.sizeGuideModal.style.display = 'none';
        }
        if (e.target === elements.checkoutModal) {
            closeCheckout();
        }
        if (e.target === elements.successModal) {
            closeSuccessModal();
        }
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== ANIMATIONS =====
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.detail-card, .feature, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== CART FUNCTIONS =====
function loadCart() {
    const savedCart = localStorage.getItem(CONFIG.storageKeys.cart);
    if (savedCart) {
        state.cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem(CONFIG.storageKeys.cart, JSON.stringify(state.cart));
}

function updateCartUI() {
    // Update cart count
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
    
    // Update cart total
    const total = calculateCartTotal();
    elements.cartTotal.textContent = ${total} ₽;
    
    // Update checkout button state
    updateCheckoutButton();
}

function renderCartItems() {
    elements.cartBody.innerHTML = '';
    
    state.cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="${item.name}">
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
    
    // Add event listeners to cart item buttons
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

// ===== CART ACTIONS =====
function selectSize(size) {
    state.selectedSize = size;
    
    elements.sizeOptions.forEach(option => {
        if (option.dataset.size === size) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function addToCart() {
    const existingItemIndex = state.cart.findIndex(
        item => item.size === state.selectedSize
    );
    
    if (existingItemIndex > -1) {
        state.cart[existingItemIndex].quantity += 1;
    } else {
        state.cart.push({
            id: CONFIG.product.id,
            name: CONFIG.product.name,
            size: state.selectedSize,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showToast('Товар добавлен в корзину');
    openCart();
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
    showToast('Товар удален из корзины');
}

// ===== UI CONTROLS =====
function toggleMobileMenu() {
    elements.mobileMenu.classList.toggle('active');
    elements.menuToggle.classList.toggle('active');
}

function openCart() {
    elements.cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    elements.cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
}

function openCheckout() {
    closeCart();
    elements.checkoutModal.style.display = 'flex';
    updateOrderSummary();
}

function closeCheckout() {
    elements.checkoutModal.style.display = 'none';
    resetCheckoutForm();
}

function closeSuccessModal() {
    elements.successModal.style.display = 'none';
    closeCheckout();
}

function updateCheckoutButton() {
    elements.checkoutBtn.disabled = state.cart.length === 0;
}

// ===== CHECKOUT FLOW =====
function nextStep(step) {
    // Validate current step
    if (state.currentStep === 1) {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!name || !phone) {
            showToast('Заполните все обязательные поля', 'error');
            return;
        }
    }
    
    if (state.currentStep === 2) {
        const address = document.getElementById('address').value.trim();
        if (!address) {
            showToast('Укажите адрес доставки', 'error');
            return;
        }
    }
    
    // Hide current step
    document.
      querySelector(`[data-step="${state.currentStep}"]`).classList.remove('active');
    
    // Update step indicator
    document.querySelector(`.step[data-step="${state.currentStep}"]`).classList.remove('active');
    
    // Show next step
    state.currentStep = parseInt(step);
    document.querySelector(`[data-step="${state.currentStep}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${state.currentStep}"]`).classList.add('active');
}

function prevStep(step) {
    // Hide current step
    document.querySelector(`[data-step="${state.currentStep}"]`).classList.remove('active');
    
    // Update step indicator
    document.querySelector(`.step[data-step="${state.currentStep}"]`).classList.remove('active');
    
    // Show previous step
    state.currentStep = parseInt(step);
    document.querySelector(`[data-step="${state.currentStep}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${state.currentStep}"]`).classList.add('active');
}

function updateOrderSummary() {
    const total = calculateCartTotal();
    const deliveryCost = 300; // Default courier cost
    
    elements.orderSummary.innerHTML = `
        <h4>Ваш заказ</h4>
        ${state.cart.map(item => `
            <p>${item.name} (${item.size}) × ${item.quantity} = ${CONFIG.product.price * item.quantity} ₽</p>
        `).join('')}
        <hr>
        <p><strong>Итого: ${total + deliveryCost} ₽</strong></p>
        <p class="small-text">(Товары: ${total} ₽ + Доставка: ${deliveryCost} ₽)</p>
    `;
}

function resetCheckoutForm() {
    elements.checkoutForm.reset();
    state.currentStep = 1;
    
    // Reset step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.step[data-step="1"]').classList.add('active');
    
    // Reset step content
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.checkout-step[data-step="1"]').classList.add('active');
}

// ===== ORDER SUBMISSION =====
async function submitOrderForm(e) {
    e.preventDefault();
    
    // Collect form data
    const orderData = {
        id: REF${Date.now().toString().slice(-6)},
        date: new Date().toISOString(),
        customer: {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            telegram: document.getElementById('telegram').value.trim() || null,
            address: document.getElementById('address').value.trim(),
            comment: document.getElementById('comment').value.trim() || null
        },
        items: [...state.cart],
        delivery: document.querySelector('input[name="delivery"]:checked').nextElementSibling.textContent,
        payment: document.querySelector('input[name="payment"]:checked').nextElementSibling.textContent,
        total: calculateCartTotal() + 300 // Including delivery
    };
    
    // Save order locally
    localStorage.setItem(CONFIG.storageKeys.order, JSON.stringify(orderData));
    
    // Send to Telegram (you'll need to configure this)
    // await sendToTelegram(orderData);
    
    // Show success modal
    showSuccessModal(orderData);
    
    // Clear cart
    state.cart = [];
    saveCart();
    updateCartUI();
}

function showSuccessModal(order) {
    closeCheckout();
    
    // Format order details
    const itemsText = order.items.map(item => 
        ${item.name} (${item.size}) × ${item.quantity}
    ).join('<br>');
    
    elements.finalOrderDetails.innerHTML = `
        <p><strong>Заказ #${order.id}</strong></p>
        <p>${itemsText}</p>
        <p><strong>Доставка:</strong> ${order.delivery}</p>
        <p><strong>Итого к оплате: ${order.total} ₽</strong></p>
    `;
    
    elements.orderAmount.textContent = order.total;
    elements.orderNumber.textContent = order.id;
    
    elements.successModal.style.display = 'flex';
}

// ===== TELEGRAM INTEGRATION (TO BE CONFIGURED) =====
// ===== CONFIGURATION =====
const CONFIG = {
    product: {
        id: 'reflex-origin-tee',
        name: 'Reflex Origin Tee',
        price: 2990,
        sizes: ['M', 'L', 'XL', 'XXL']
    },
    storageKeys: {
        cart: 'reflex_cart',
        order: 'reflex_last_order'
    },
    telegram: {
        botToken: 'YOUR_BOT_TOKEN', // You'll set this up
        chatId: 'YOUR_CHAT_ID'      // Your Telegram ID
    }
};

// ===== STATE MANAGEMENT =====
let state = {
    cart: [],
    selectedSize: 'M',
    currentStep: 1,
    orderData: null
};

// ===== DOM ELEMENTS =====
const elements = {
    // Header & Navigation
    menuToggle: document.getElementById('menuToggle'),
    mobileMenu: document.getElementById('mobileMenu'),
    cartToggle: document.getElementById('cartToggle'),
    cartClose: document.getElementById('cartClose'),
    cartCount: document.getElementById('cartCount'),
    cartSidebar: document.getElementById('cartSidebar'),
    
    // Product
    sizeOptions: document.querySelectorAll('.size-option'),
    addToCartBtn: document.getElementById('addToCartBtn'),
    mainImage: document.querySelector('.image-main img'),
    thumbnails: document.querySelectorAll('.thumb'),
    
    // Modals
    sizeGuideModal: document.getElementById('sizeGuideModal'),
    closeSizeGuide: document.getElementById('closeSizeGuide'),
    sizeGuideLink: document.querySelector('.size-guide-link'),
    checkoutModal: document.getElementById('checkoutModal'),
    closeCheckout: document.getElementById('closeCheckout'),
    successModal: document.getElementById('successModal'),
    closeSuccess: document.getElementById('closeSuccess'),
    
    // Cart
    cartBody: document.getElementById('cartBody'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    
    // Checkout
    checkoutForm: document.getElementById('checkoutForm'),
    nextStepBtns: document.querySelectorAll('.next-step'),
    prevStepBtns: document.querySelectorAll('.prev-step'),
    orderSummary: document.getElementById('orderSummary'),
    submitOrder: document.getElementById('submitOrder'),
    
    // Success
    finalOrderDetails: document.getElementById('finalOrderDetails'),
    orderAmount: document.getElementById('orderAmount'),
    orderNumber: document.getElementById('orderNumber'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    
    // FAQ
    faqQuestions: document.querySelectorAll('.faq-question')
};

// ===== INITIALIZATION =====
function init() {
    loadCart();
    setupEventListeners();
    setupAnimations();
    updateCartUI();
    
    // Hide preloader
    setTimeout(() => {
        document.querySelector('.preloader').classList.add('prepare-remove');
        setTimeout(() => {
            document.querySelector('.preloader').style.display = 'none';
        }, 300);
    }, 1000);
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Mobile menu
    elements.menuToggle?.addEventListener('click', toggleMobileMenu);
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileMenu.classList.remove('active');
            elements.menuToggle.classList.remove('active');
        });
    });
    
    // Cart
    elements.cartToggle?.addEventListener('click', openCart);
    elements.cartClose?.addEventListener('click', closeCart);
    
    // Product
    elements.sizeOptions?.forEach(option => {
        option.addEventListener('click', () => selectSize(option.dataset.size));
    });
    
    elements.addToCartBtn?.addEventListener('click', addToCart);
    
    // Image thumbnails
    elements.thumbnails?.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const newSrc = thumb.dataset.image;
            elements.mainImage.src = newSrc;
            elements.thumbnails.forEach(t => t.classList.remove('active'));
            thumb.
              async function sendToTelegram(order) {
    // You'll need to:
    // 1. Create a bot via @BotFather on Telegram
    // 2. Get your chat ID (send /start to @userinfobot)
    // 3. Uncomment and configure this function
    
    /*
    const message = `
    🛒 Новый заказ #${order.id}
    
    👤 Клиент: ${order.customer.name}
    📞 Телефон: ${order.customer.phone}
    📍 Адрес: ${order.customer.address}
    
    🛍️ Заказ:
    ${order.items.map(item => `• ${item.name} (${item.size}) × ${item.quantity}`).join('\n')}
    
    💰 Сумма: ${order.total} ₽
    📦 Доставка: ${order.delivery}
    
    💬 Комментарий: ${order.customer.comment || 'нет'}
    `;
    
    const url = https://api.telegram.org/bot${CONFIG.telegram.botToken}/sendMessage;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CONFIG.telegram.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Telegram error:', error);
    }
    */
}

// ===== FAQ =====
function toggleFAQ(e) {
    const question = e.currentTarget;
    const answer = question.nextElementSibling;
    
    question.classList.toggle('active');
    answer.classList.toggle('active');
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    elements.toast.className = toast ${type};
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ===== START THE APPLICATION =====
document.addEventListener('DOMContentLoaded', init);
