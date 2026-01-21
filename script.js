document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            
            parallaxBg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// Навигация
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const header = document.querySelector('.header');
    
    // Мобильное меню
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // Изменение header при скролле
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Выбор размера
function initSizeSelection() {
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Удаляем класс active у всех размеров
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Добавляем класс active к выбранному размеру
            this.classList.add('active');
            
            // Сохраняем выбранный размер
            selectedSize = this.getAttribute('data-size');
            
            // Обновляем информацию в модальном окне
            updateOrderSize();
            
            // Анимация выбора
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// Обновление размера в заказе
function updateOrderSize() {
    const sizeElement = document.getElementById('order-product-size');
    if (sizeElement) {
        sizeElement.textContent =азвание товара
    const na
    }
}

// Кнопка "Купить сейчас" - ГЛАВНОЕ ИСПРАВЛЕНИЕ
function initBuyButton() {
    const buyNowBtn = document.getElementById('buy-now-btn');
    
    if (buyNowBtn) {
        console.log('Кнопка "Купить сейчас" найдена');
        
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Кнопка "Купить сейчас" нажата!');
            
            // Открываем модальное окно покупки
            openPurchaseModal();
            
            // Анимация кнопки
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    } else {
        console.error('Кнопка "Купить сейчас" не найдена! Проверьте ID в HTML');
    }
}

// Быстрый просмотр
function initQuickView() {
    const quickViewBtn = document.getElementById('quick-view-btn');
    const mainProductImage = document.getElementById('main-product-image');
    
    if (quickViewBtn) {
        quickViewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openQuickViewModal();
        });
    }
    
    if (mainProductImage) {
        mainProductImage.addEventListener('click', function() {
            openQuickViewModal();
        });
    }
}

// Открытие быстрого просмотра
function openQuickViewModal() {
    // Если уже есть модальное окно, закрываем его
    if (quickViewModal) {
        closeQuickViewModal();
    }
    
    // Создаем HTML для модального окна
    const modalHTML = `
        <div class="quick-view-modal" id="quick-view-modal">
            <div class="quick-view-content">
                <button class="close-quick-view" id="close-quick-view">
                    <i class="fas fa-times"></i>
                </button>
                <div class="quick-view-image">
                    <img src="${productConfig.imageUrl}" alt="${productConfig.name}" id="quick-view-main-image">
                </div>
                <div class="quick-view-info">
                    <h3>${productConfig.name}</h3>
                    <p class="product-price">${productConfig.price}</p>
                    <p>${productConfig.description}</p>
                    <div class="quick-view-sizes">
                        <span class="size-label">Размеры:</span>
                        <div class="size-options">
                            ${productConfig.sizes.map(size => `
                                <span class="size-option ${size === selectedSize ? 'active' : ''}" data-size="${size}">${size}</span>
                            `).join('')}
                        </div>
                    </div>
                    <button class="btn btn-primary btn-buy" id="quick-view-buy-btn">
                        <i class="fas fa-shopping-bag"></i>
                        <span>Купить сейчас</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    quickViewModal = document.getElementById('quick-view-modal');
    
    // Блокируем прокрутку фона
    document.body.style.overflow = 'hidden';
    
    // Настраиваем закрытие модального окна
    const closeBtn = document.getElementById('close-quick-view');
    const quickBuyBtn = document.getElementById('quick-view-buy-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuickViewModal);
    }
    
    if (quickViewModal) {
        quickViewModal.addEventListener('click', function(e) {
            if (e.target === quickViewModal) {
                closeQuickViewModal();
            }
        });
    }
    
    // Кнопка "Купить сейчас" в быстром просмотре
    if (quickBuyBtn) {
        quickBuyBtn.addEventListener('click', function() {
            closeQuickViewModal();
            openPurchaseModal();
        });
    }
    
    // Выбор размера в быстром просмотре
    const quickSizeOptions = document.querySelectorAll('#quick-view-modal .size-option');
    quickSizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            quickSizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedSize = this.getAttribute('data-size');
            updateOrderSize();
        });
    });
    
    // Закрытие по клавише Esc
    document.addEventListener('keydown', function quickViewKeyHandler(e) {
        if (e.key === 'Escape') {
            closeQuickViewModal();
            document.removeEventListener('keydown', quickViewKeyHandler);
        }
        // Конфигурация товара
const productConfig = {
    name: "Feral Tee",
    price: "1 200 ₽",
    originalPrice: "1 800 ₽",
    description: "Стильная минималистичная футболка для свободных и смелых. Изготовлена из премиального органического хлопка.",
    
    // ВАЖНО: ЗАМЕНИТЕ ЭТИ ССЫЛКИ НА СВОИ ИЗОБРАЖЕНИЯ!
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    imageUrlMobile: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    imageUrlThumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    
    sizes: ["XS", "S", "M", "L", "XL"],
    defaultSize: "M"
};

// Глобальные переменные
let selectedSize = productConfig.defaultSize;
let quickViewModal = null;

// Основная функция инициализации
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт Feral Sense загружен');
    
    // Загружаем изображения товара
    loadProductImages();
    
    // Инициализируем параллакс эффект
    initParallax();
    
    // Инициализируем навигацию
    initNavigation();
    
    // Инициализируем выбор размера
    initSizeSelection();
    
    // Инициализируем кнопку "Купить сейчас"
    initBuyButton();
    
    // Инициализируем быстрый просмотр
    initQuickView();
    
    // Инициализируем модальное окно покупки
    initPurchaseModal();
    
    // Инициализируем Easter Egg
    initEasterEgg();
    
    // Инициализируем анимации при скролле
    initScrollAnimations();
    
    // Инициализируем анимацию визуального элемента
    initVisualElement();
});

// ===== ФУНКЦИИ ИНИЦИАЛИЗАЦИИ =====

// Загрузка изображений товара
function loadProductImages() {
    const mainImage = document.getElementById('main-product-image');
    const orderImage = document.getElementById('order-summary-image');
    
    if (mainImage) {
        if (window.innerWidth < 768) {
            mainImage.src = productConfig.imageUrlMobile;
        } else {
            mainImage.src = productConfig.imageUrl;
        }
        
        // Обработчик ошибки загрузки
        mainImage.onerror = function() {
            console.error('Ошибка загрузки основного изображения');
            // Простая SVG заглушка
            mainImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSIxMDAwIiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEwMDAiIGZpbGw9IiMyYTJhMmEiLz48L3N2Zz4=';
        };
    }
    
    if (orderImage) {
        orderImage.src = productConfig.imageUrlThumbnail;
        orderImage.onerror = function() {
            console.error('Ошибка загрузки изображения для корзины');
        };
    }
    
    // Обновляем информацию о товаре
    updateProductInfo();
}

// Обновление информации о товаре
function updateProductInfo() {
    // Название товара
    const nameElements = document.querySelectorAll('.product-name, #order-product-name');
    nameElements.forEach(el => {
        if (el) el.textContent = productConfig.name;
    });
    
    // Цена
    const priceElements = document.querySelectorAll('.current-price, #order-product-price, #order-total-price');
    priceElements.forEach(el => {
        if (el) el.textContent = productConfig.price;
    });
    
    // Старая цена
    const oldPriceElement = document.querySelector('.original-price');
    if (oldPriceElement) {
        oldPriceElement.textContent = productConfig.originalPrice;
    }
    
    // Описание
    const descElement = document.querySelector('.product-description');
    if (descElement) {
        descElement.textContent = productConfig.description;
    }
}

// Параллакс эффект
function initParallax() {
    const parallaxBg = document.querySelector('.parallax-bg');
    
    if (parallaxBg) {
        });
}

// Закрытие быстрого просмотра
function closeQuickViewModal() {
    if (quickViewModal) {
        quickViewModal.remove();
        quickViewModal = null;
        document.body.style.overflow = 'auto';
    }
}

// Модальное окно покупки
function initPurchaseModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModal = document.getElementById('close-modal');
    const orderForm = document.getElementById('order-form');
    const successMessage = document.getElementById('success-message');
    const closeSuccess = document.getElementById('close-success');
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    if (!modalOverlay) {
        console.error('Модальное окно покупки не найдено!');
        return;
    }
    
    // Закрытие модального окна
    if (closeModal) {
        closeModal.addEventListener('click', closePurchaseModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closePurchaseModal();
            }
        });
    }
    
    // Выбор способа оплаты
    if (paymentOptions.length > 0) {
        paymentOptions.forEach(option => {
            option.addEventListener('click', function() {
                paymentOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const method = this.getAttribute('data-method');
                document.querySelectorAll('.payment-details').forEach(detail => {
                    detail.classList.remove('active');
                });
                
                const selectedDetails = document.getElementById(`${method}-details`);
                if (selectedDetails) {
                    selectedDetails.classList.add('active');
                }
            });
        });
    }
    
    // Отправка формы заказа
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидация формы
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const screenshot = document.getElementById('screenshot').value.trim();
            
            if (!name       this.st!phone || !screenshot) {
                alert('Пожалуйста, заполните все обязательные поля (отмечены *)');
                return;
            }
            
            // Проверка email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Пожалуйста, введите корректный email адрес');
                return;
            }
            
            // Имитация отправки
            const submitBtn = orderForm.querySelector('.btn-submit');
            const originalText = submitBtn.querySelector('span').textContent;
            
            submitBtn.querySelector('span').textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Симуляция задержки отправки
            setTimeout(() => {
                if (orderForm) orderForm.style.display = 'none';
                if (successMessage) successMessage.style.display = 'block';
                
                // Логирование данных заказа
                console.log('Заказ оформлен:', {
                    product: productConfig.name,
                    size: selectedSize,
                    price: productConfig.price,
                    customer: { name, email, phone },
                    paymentMethod: document.querySelector('.payment-option.active')?.getAttribute('data-method') || 'card',
                    screenshot: screenshot
                });
                
                // Сброс формы через 5 секунд
                setTimeout(() => {
                    closePurchaseModal();
                }, 5000);
            }, 1500);
        });
        }
    
    // Закрытие сообщения об успехе
    if (closeSuccess) {
        closeSuccess.addEventListener('click', closePurchaseModal);
    }
}

// Открытие модального окна покупки
function openPurchaseModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (modalOverlay) {
        console.log('Открываю модальное окно покупки...');
        
        // Обновляем информацию о размере
        updateOrderSize();
        
        // Открываем модальное окно
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Не могу найти модальное окно покупки!');
    }
}

// Закрытие модального окна покупки
function closePurchaseModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const orderForm = document.getElementById('order-form');
    const successMessage = document.getElementById('success-message');
    
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Сброс формы
        if (orderForm) {
            orderForm.reset();
            orderForm.style.display = 'block';
            
            const submitBtn = orderForm.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.querySelector('span').textContent = 'Отправить заказ';
                submitBtn.disabled = false;
            }
        }
        
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }
}

// Easter Egg
function initEasterEgg() {
    const logo = document.getElementById('logo');
    const easterEgg = document.getElementById('easter-egg');
    const easterClose = document.getElementById('easter-close');
    
    if (logo && easterEgg && easterClose) {
        let clickCount = 0;
        let lastClickTime = 0;
        
        logo.addEventListener('click', function(e) {
            const currentTime = new Date().getTime();
            
            if (currentTime - lastClickTime < 500) {
                clickCount++;
                if (clickCount >= 2) {
                    easterEgg.classList.add('active');
                    clickCount = 0;
                    
                    // Анимация логотипа
                    logo.style.transform = 'scale(1.1) rotate(5deg)';
                    setTimeout(() => {
                        logo.style.transform = 'scale(1) rotate(0)';
                    }, 300);
                }
            } else {
                clickCount = 1;
            }
            
            lastClickTime = currentTime;
        });
        
        easterClose.addEventListener('click', function() {
            easterEgg.classList.remove('active');
        });
        
        easterEgg.addEventListener('click', function(e) {
            if (e.target === easterEgg) {
                easterEgg.classList.remove('active');
            }
        });
    }
}

// Анимации при скролле
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.section-header, .product-card, .about-content, .contact-content');
    
    // Инициализация стилей
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Функция проверки видимости
    function checkVisibility() {
        fadeElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Проверяем при загрузке и скролле
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
}

// Анимация визуального элемента
function initVisualElement() {
    const visualElement = document.
        getElementById('visual-element');
    
    if (visualElement && window.innerWidth > 768) {
        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            
            visualElement.style.transform =his.getAttribute('href');
   
        });
    }
}

// Обработчик изменения размера окна
window.addEventListener('resize', function() {
    const mainImage = document.getElementById('main-product-image');
    
    if (mainImage) {
        if (window.innerWidth < 768) {
            mainImage.src = productConfig.imageUrlMobile;
        } else {
            mainImage.src = productConfig.imageUrl;
        }
    }
});

// Инициализация при полной загрузке страницы
window.addEventListener('load', function() {
    console.log('Страница полностью загружена');
});
