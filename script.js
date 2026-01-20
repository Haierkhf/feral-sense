// Анимация фона при движении мыши
document.addEventListener('DOMContentLoaded', function() {
    const parallaxBg = document.querySelector('.parallax-bg');
    
    // Параллакс эффект для фона
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        
        parallaxBg.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
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
    
    // Изменение header при скролле
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Анимация появления элементов при скролле
        animateOnScroll();
    });
    
    // Анимация элементов при скролле
    function animateOnScroll() {
        const elements = document.querySelectorAll('.section-header, .product-card, .about-content, .contact-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Инициализация анимации при загрузке
    document.querySelectorAll('.section-header, .product-card, .about-content, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    setTimeout(() => {
        animateOnScroll();
    }, 500);
    
    // Выбор размера товара
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Выбор способа оплаты
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentDetails = document.querySelectorAll('.payment-details');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const method = this.getAttribute('data-method');
            paymentDetails.forEach(detail => detail.classList.remove('active'));
            document.getElementById(`${method}-details`).classList.add('active');
        });
    });
    
    // Easter egg при клике на логотип
    const logo = document.getElementById('logo');
    const easterEgg = document.getElementById('easter-egg');
    const easterClose = document.getElementById('easter-close');
    
    let clickCount = 0;
    let lastClickTime = 0;
    
    logo.addEventListener('click', (e) => {
      const currentTime = new Date().getTime();
        
        // Проверяем тройной клик
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
    
    // Закрытие easter egg
    easterClose.addEventListener('click', () => {
        easterEgg.classList.remove('active');
    });
    
    easterEgg.addEventListener('click', (e) => {
        if (e.target === easterEgg) {
            easterEgg.classList.remove('active');
        }
    });
    
    // Модальное окно покупки
    const buyBtn = document.getElementById('buy-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModal = document.getElementById('close-modal');
    const orderForm = document.getElementById('order-form');
    const successMessage = document.getElementById('success-message');
    const closeSuccess = document.getElementById('close-success');
    
    buyBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetForm();
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            resetForm();
        }
    });
    
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Валидация формы
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const screenshot = document.getElementById('screenshot').value;
        
        if (!name;
            !phone || !screenshot) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Имитация отправки формы
        const submitBtn = orderForm.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('span').textContent;
        
        submitBtn.querySelector('span').textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            orderForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Отправка данных на сервер (в реальном приложении)
            console.log('Данные заказа:', {
                name,
                email,
                phone,
                screenshot,
                product: 'Feral Tee',
                price: 1200,
                paymentMethod: document.querySelector('.payment-option.active').getAttribute('data-method')
            });
            
            // Сброс формы через 5 секунд
            setTimeout(() => {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
                resetForm();
            }, 5000);
        }, 1500);
    });
    
    closeSuccess.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetForm();
    });
    
    function resetForm() {
        orderForm.reset();
        orderForm.style.display = 'block';
        successMessage.style.display = 'none';
        
        const submitBtn = orderForm.querySelector('.btn-submit');
        submitBtn.querySelector('span').textContent = 'Отправить заказ';
      submitBtn.disabled = false;
        
        // Сброс выбора оплаты
        paymentOptions.forEach(opt => opt.classList.remove('active'));
        paymentDetails.forEach(detail => detail.classList.remove('active'));
        
        paymentOptions[0].classList.add('active');
        paymentDetails[0].classList.add('active');
    }
    
    // Анимация визуального элемента в разделе "О бренде"
    const visualElement = document.getElementById('visual-element');
    
    if (visualElement) {
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) {
                const x = (e.clientX / window.innerWidth - 0.5) * 10;
                const y = (e.clientY / window.innerHeight - 0.5) * 10;
                
                visualElement.style.transform =act-content').forEach(el => {
            }
        });
    }
    
    // Плавная прокрутка для ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Инициализация анимации при загрузке
    window.dispatchEvent(new Event('scroll'));
});
