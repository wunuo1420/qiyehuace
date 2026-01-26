document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const pages = document.querySelectorAll('.page');
    const frontCover = document.querySelector('.page.cover.front');
    
    // 初始化变量
    let currentPageIndex = 0; // 当前页面索引
    const totalPages = pages.length;
    
    // 滑动手势变量
    let startY = 0;
    let endY = 0;
    const SWIPE_THRESHOLD = 50; // 滑动阈值
    
    // 初始化当前页面
    function initCurrentPage() {
        pages.forEach((page, index) => {
            page.classList.remove('current-page');
        });
        pages[currentPageIndex].classList.add('current-page');
    }
    
    // 翻到下一页（单页）
    function nextPage() {
        if (currentPageIndex < totalPages - 1) {
            // 当前页面翻页
            pages[currentPageIndex].classList.add('flipped');
            
            // 移到下一页
            currentPageIndex++;
            initCurrentPage();
        }
    }
    
    // 翻到上一页（单页）
    function prevPage() {
        if (currentPageIndex > 0) {
            // 移到上一页
            currentPageIndex--;
            
            // 移除上一页的翻页状态
            pages[currentPageIndex].classList.remove('flipped');
            initCurrentPage();
        }
    }
    
    // 点击页面翻页
    function handlePageClick(event) {
        const page = event.currentTarget;
        const index = Array.from(pages).indexOf(page);
        
        // 点击当前页面翻到下一页
        if (index === currentPageIndex) {
            nextPage();
        }
        // 点击已翻过的页面返回上一页
        else if (index === currentPageIndex - 1) {
            prevPage();
        }
    }
    
    // 滑动开始
    function handleSwipeStart(event) {
        startY = event.touches ? event.touches[0].clientY : event.clientY;
    }
    
    // 滑动结束
    function handleSwipeEnd(event) {
        endY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
        handleSwipeGesture();
    }
    
    // 处理滑动手势
    function handleSwipeGesture() {
        const diffY = endY - startY;
        
        // 向上滑动（翻到下一页）
        if (Math.abs(diffY) > SWIPE_THRESHOLD && diffY < 0) {
            nextPage();
        }
        // 向下滑动（翻到上一页）
        else if (Math.abs(diffY) > SWIPE_THRESHOLD && diffY > 0) {
            prevPage();
        }
    }
    
    // 键盘事件监听（保留键盘翻页功能）
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            nextPage();
        } else if (e.key === 'ArrowDown') {
            prevPage();
        }
    });
    
    // 添加事件监听
    pages.forEach(page => {
        // 点击翻页
        page.addEventListener('click', handlePageClick);
        
        // 触摸滑动事件
        page.addEventListener('touchstart', handleSwipeStart);
        page.addEventListener('touchend', handleSwipeEnd);
        
        // 鼠标滑动事件
        page.addEventListener('mousedown', handleSwipeStart);
        page.addEventListener('mouseup', handleSwipeEnd);
        // 防止鼠标拖拽选择
        page.addEventListener('mousedown', function(e) {
            e.preventDefault();
        });
    });
    
    // 初始化当前页面
    initCurrentPage();
    
    // 添加页面加载动画
    setTimeout(() => {
        document.querySelector('.book').style.opacity = '1';
    }, 100);
});