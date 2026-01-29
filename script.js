document.addEventListener('DOMContentLoaded', function() {
    const book = document.getElementById('book');
    const pages = document.querySelectorAll('.page');
    let currentPageIndex = 0;
    const totalPages = pages.length;
    
    let startY = 0;
    let endY = 0;
    let startX = 0;
    let endX = 0;
    let isSwipe = false;
    const SWIPE_THRESHOLD = 50;
    
    function initCurrentPage() {
        pages.forEach((page, index) => {
            page.classList.remove('current');
            if (!page.classList.contains('flipped')) {
                page.style.transform = '';
            }
        });
        pages[currentPageIndex].classList.add('current');
        pages[currentPageIndex].style.transform = 'rotateX(0deg)';
    }
    
    function initSpecSelectors() {
        const specSelectors = document.querySelectorAll('.spec-selector');
        
        specSelectors.forEach(selector => {
            const specBtns = selector.querySelectorAll('.spec-btn');
            const priceBox = selector.nextElementSibling;
            const factoryPriceEl = priceBox.querySelector('.factory-price');
            const retailPriceEl = priceBox.querySelector('.retail-price');
            
            specBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    specBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const factoryPrice = this.getAttribute('data-factory');
                    const retailPrice = this.getAttribute('data-retail');
                    
                    if (factoryPriceEl && factoryPrice) {
                        factoryPriceEl.textContent = '¥' + factoryPrice;
                    }
                    if (retailPriceEl && retailPrice) {
                        retailPriceEl.textContent = '¥' + retailPrice;
                    }
                });
            });
        });
    }
    
    function nextPage() {
        if (currentPageIndex < totalPages - 1) {
            pages[currentPageIndex].classList.add('flipped');
            currentPageIndex++;
            initCurrentPage();
        }
    }
    
    function prevPage() {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            pages[currentPageIndex].classList.remove('flipped');
            initCurrentPage();
        }
    }
    
    function handleTouchStart(event) {
        isSwipe = false;
        startY = event.touches[0].clientY;
        startX = event.touches[0].clientX;
    }
    
    function handleTouchMove(event) {
        const touch = event.touches[0];
        const diffY = Math.abs(touch.clientY - startY);
        const diffX = Math.abs(touch.clientX - startX);
        
        if (diffY > 10 || diffX > 10) {
            isSwipe = true;
        }
    }
    
    function handleTouchEnd(event) {
        endY = event.changedTouches[0].clientY;
        endX = event.changedTouches[0].clientX;
        handleSwipeGesture();
    }
    
    function handleSwipeGesture() {
        if (!isSwipe) return;
        
        const diffY = endY - startY;
        const diffX = endX - startX;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > SWIPE_THRESHOLD && diffX < 0) {
                nextPage();
            } else if (Math.abs(diffX) > SWIPE_THRESHOLD && diffX > 0) {
                prevPage();
            }
        }
    }
    
    function handleMouseDown(event) {
        startY = event.clientY;
        startX = event.clientX;
        isSwipe = false;
    }
    
    function handleMouseMove(event) {
        const diffY = Math.abs(event.clientY - startY);
        const diffX = Math.abs(event.clientX - startX);
        
        if (diffY > 10 || diffX > 10) {
            isSwipe = true;
        }
    }
    
    function handleMouseUp(event) {
        endY = event.clientY;
        endX = event.clientX;
        handleMouseSwipeGesture();
    }
    
    function handleMouseSwipeGesture() {
        if (!isSwipe) return;
        
        const diffX = endX - startX;
        
        if (Math.abs(diffX) > SWIPE_THRESHOLD && diffX < 0) {
            nextPage();
        } else if (Math.abs(diffX) > SWIPE_THRESHOLD && diffX > 0) {
            prevPage();
        }
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextPage();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevPage();
        }
    });
    
    pages.forEach(page => {
        page.addEventListener('touchstart', handleTouchStart, { passive: true });
        page.addEventListener('touchmove', handleTouchMove, { passive: true });
        page.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        page.addEventListener('mousedown', handleMouseDown);
        page.addEventListener('mousemove', handleMouseMove);
        page.addEventListener('mouseup', handleMouseUp);
    });
    
    setTimeout(() => {
        book.classList.add('loaded');
    }, 100);
    
    initCurrentPage();
    initSpecSelectors();
});
