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
let elements = {};

function initElements() {
    elements = {
        menuToggle: document.getElementById('menuToggle'),
        mobileMenu: document.getElementById('mobileMenu'),
        cartToggle: document.getElementById('cartToggle'),
        cartClose: document.getElementById('cartClose'),
        cartCount: document.getElementById('cartCount'),
        cartSidebar: document.getElementById('cartSidebar'),
        sizeOptions: document.querySelectorAll('.size-option'),
        addToCartBtn: document.getElementById('addToCartBtn'),
        mainImage: document.querySelector('.image-main img'),
        thumbnails: document.querySelectorAll('.thumb'),
        sizeGuideModal: document.getElementById('sizeGuideModal'),
        closeSizeGuide: document.getElementById('closeSizeGuide'),
        sizeGuideLink: document.querySelector('.size-guide-link'),
        checkoutModal: document.getElementById('checkoutModal'),
        closeCheckout: document.getElementById('closeCheckout'),
        successModal: document.getElementById('successModal'),
        closeSuccess: document.getElementById('closeSuccess'),
        cartBody: document.getElementById('cartBody'),
        cartEmpty: document.getElementById('cartEmpty'),
        cartTotal: document.getElementById('cartTotal'),
        checkoutBtn: document.getElementById('checkoutBtn'),
        checkoutForm: document.getElementById('checkoutForm'),
        nextStepBtns: document.querySelectorAll('.next-step'),
        prevStepBtns: document.querySelectorAll('.prev-step'),
        orderSummary: document.getElementById('orderSummary'),
        submitOrder: document.getElementById('submitOrder'),
        finalOrderDetails: document.getElementById('finalOrderDetails'),
        orderAmount: document.getElementById('orderAmount'),
        orderNumber: document.getElementById('orderNumber'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage'),
        faqQuestions: document.querySelectorAll('.faq-question')
    };
}

// ===== INITIALIZATION =====
function init() {
    initElements();
    loadCart();
    setupEventListeners();
    updateCartUI();
    
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('prepare-remove');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }
    }, 1000);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileMenu.classList.remove('active');
            elements.menuToggle.classList.remove('active');
        });
    });
    
    if (elements.cartToggle) elements.cartToggle.addEventListener('click', openCart);
    if (elements.cartClose) elements.cartClose.addEventListener('click', closeCart);
    
    elements.sizeOptions?.forEach(option => {
        option.addEventListener('click', () => selectSize(option.dataset.size));
    });
    
    if (elements.addToCartBtn) elements.addToCartBtn.addEventListener('click', addToCart);
    
    elements.thumbnails?.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const newSrc = thumb.dataset.image;
            if (elements.mainImage) elements.mainImage.src = newSrc;
            elements.thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.
                    add('active');
        });
    });
    
    if (elements.sizeGuideLink) {
        elements.sizeGuideLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (elements.sizeGuideModal) elements.sizeGuideModal.style.display = 'flex';
        });
    }
    
    if (elements.closeSizeGuide) {
        elements.closeSizeGuide.addEventListener('click', () => {
            if (elements.sizeGuideModal) elements.sizeGuideModal.style.display = 'none';
        });
    }
    
    if (elements.checkoutBtn) elements.checkoutBtn.addEventListener('click', openCheckout);
    if (elements.closeCheckout) elements.closeCheckout.addEventListener('click', closeCheckout);
    if (elements.closeSuccess) elements.closeSuccess.addEventListener('click', closeSuccessModal);
    
    elements.nextStepBtns?.forEach(btn => {
        btn.addEventListener('click', () => nextStep(btn.dataset.next));
    });
    
    elements.prevStepBtns?.forEach(btn => {
        btn.addEventListener('click', () => prevStep(btn.dataset.prev));
    });
    
    if (elements.submitOrder) elements.submitOrder.addEventListener('click', submitOrderForm);
    
    elements.faqQuestions?.forEach(question => {
        question.addEventListener('click', toggleFAQ);
    });
    
    window.addEventListener('click', (e) => {
        if (elements.sizeGuideModal && e.target === elements.sizeGuideModal) {
            elements.sizeGuideModal.style.display = 'none';
        }
        if (elements.checkoutModal && e.target === elements.checkoutModal) {
            closeCheckout();
        }
        if (elements.successModal && e.target === elements.successModal) {
            closeSuccessModal();
        }
    });
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
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
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (elements.cartCount) elements.cartCount.textContent = totalItems;
    
    if (state.cart.length === 0) {
        if (elements.cartEmpty) elements.cartEmpty.style.display = 'block';
        if (elements.cartBody) elements.cartBody.innerHTML = '';
        if (elements.checkoutBtn) elements.checkoutBtn.disabled = true;
    } else {
        if (elements.cartEmpty) elements.cartEmpty.style.display = 'none';
        renderCartItems();
        if (elements.checkoutBtn) elements.checkoutBtn.disabled = false;
    }
    
    const total = calculateCartTotal();
    if (elements.cartTotal) elements.cartTotal.textContent = ${total} ₽;
}

function renderCartItems() {
    if (!elements.cartBody) return;
    
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

function updateOrderSummary() {
    if (!elements.orderSummary) return;
    
    const total = calculateCartTotal();
    const deliveryCost = 300;
    
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

function nextStep(step) {
    if (state.currentStep === 1) {
        const name = document.getElementById('name')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        
        if (!name || !phone) {
            showToast('Заполните все обязательные поля', 'error');
            return;
        }
    }
    
    if (state.currentStep === 2) {
        const address = document.getElementById('address')?.value.trim();
        if (!address) {
            showToast('Укажите адрес доставки', 'error');
            return;
        }
    }
    
    document.querySelector(`[data-step="${state.currentStep}"]`)?.classList.remove('active');
    document.
            querySelector(`.step[data-step="${state.currentStep}"]`)?.classList.remove('active');
    
    state.currentStep = parseInt(step);
    document.querySelector(`[data-step="${state.currentStep}"]`)?.classList.add('active');
    document.querySelector(`.step[data-step="${state.currentStep}"]`)?.classList.add('active');
}

function prevStep(step) {
    document.querySelector(`[data-step="${state.currentStep}"]`)?.classList.remove('active');
    document.querySelector(`.step[data-step="${state.currentStep}"]`)?.classList.remove('active');
    
    state.currentStep = parseInt(step);
    document.querySelector(`[data-step="${state.currentStep}"]`)?.classList.add('active');
    document.querySelector(`.step[data-step="${state.currentStep}"]`)?.classList.add('active');
}

function resetCheckoutForm() {
    if (elements.checkoutForm) elements.checkoutForm.reset();
    state.currentStep = 1;
    
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.step[data-step="1"]')?.classList.add('active');
    
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.checkout-step[data-step="1"]')?.classList.add('active');
}

async function submitOrderForm(e) {
    e.preventDefault();
    
    const orderData = {
        id: REF${Date.now().toString().slice(-6)},
        date: new Date().toISOString(),
        customer: {
            name: document.getElementById('name')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            telegram: document.getElementById('telegram')?.value.trim() || null,
            address: document.getElementById('address')?.value.trim() || '',
            comment: document.getElementById('comment')?.value.trim() || null
        },
        items: [...state.cart],
        delivery: document.querySelector('input[name="delivery"]:checked')?.nextElementSibling?.textContent || '',
        payment: document.querySelector('input[name="payment"]:checked')?.nextElementSibling?.textContent || '',
        total: calculateCartTotal() + 300
    };
    
    localStorage.setItem(CONFIG.storageKeys.order, JSON.stringify(orderData));
    showSuccessModal(orderData);
    
    state.cart = [];
    saveCart();
    updateCartUI();
}

function showSuccessModal(order) {
    closeCheckout();
    
    const itemsText = order.items.map(item => 
        ${item.name} (${item.size}) × ${item.quantity}
    ).join('<br>');
    
    if (elements.finalOrderDetails) {
        elements.finalOrderDetails.innerHTML = `
            <p><strong>Заказ #${order.id}</strong></p>
            <p>${itemsText}</p>
            <p><strong>Доставка:</strong> ${order.delivery}</p>
            <p><strong>Итого к оплате: ${order.total} ₽</strong></p>
        `;
    }
    
    if (elements.orderAmount) elements.orderAmount.textContent = order.total;
    if (elements.orderNumber) elements.orderNumber.textContent = order.id;
    
    if (elements.successModal) elements.successModal.style.display = 'flex';
}

function toggleFAQ(e) {
    const question = e.currentTarget;
    const answer = question.nextElementSibling;
    
    question.classList.toggle('active');
    answer.classList.toggle('active');
}

function showToast(message, type = 'success') {
    if (!elements.toast || !elements.toastMessage) return;
    
    elements.toastMessage.textContent = message;
    elements.toast.className = toast ${type};
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
