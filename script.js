document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    let currentPageIndex = 0;
    const totalPages = pages.length;
    let startY = 0;
    let endY = 0;
    const SWIPE_THRESHOLD = 50;
    
    function initCurrentPage() {
        pages.forEach((page, index) => {
            page.classList.remove('current-page');
        });
        pages[currentPageIndex].classList.add('current-page');
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
    
    function handlePageClick(event) {
        const page = event.currentTarget;
        const index = Array.from(pages).indexOf(page);
        
        if (index === currentPageIndex) {
            nextPage();
        } else if (index === currentPageIndex - 1) {
            prevPage();
        }
    }
    
    function handleSwipeStart(event) {
        startY = event.touches ? event.touches[0].clientY : event.clientY;
    }
    
    function handleSwipeEnd(event) {
        endY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
        handleSwipeGesture();
    }
    
    function handleSwipeGesture() {
        const diffY = endY - startY;
        
        if (Math.abs(diffY) > SWIPE_THRESHOLD && diffY < 0) {
            nextPage();
        } else if (Math.abs(diffY) > SWIPE_THRESHOLD && diffY > 0) {
            prevPage();
        }
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            nextPage();
        } else if (e.key === 'ArrowDown') {
            prevPage();
        }
    });
    
    pages.forEach(page => {
        page.addEventListener('click', handlePageClick);
        page.addEventListener('touchstart', handleSwipeStart);
        page.addEventListener('touchend', handleSwipeEnd);
        page.addEventListener('mousedown', handleSwipeStart);
        page.addEventListener('mouseup', handleSwipeEnd);
        page.addEventListener('mousedown', function(e) {
            e.preventDefault();
        });
    });
    
    initCurrentPage();
    
    setTimeout(() => {
        document.querySelector('.book').style.opacity = '1';
    }, 100);
});