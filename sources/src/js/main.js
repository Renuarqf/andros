'use strict';


let animated = false,
    scrolled = false,
    screenArray = [],
    sectionArray = [],
    currentScreen = 0,
    currentSection = 0,
    screenAnimSpeedFade = 600,
    paginationScreen,
    windowWidth = 1024,
    mobileBreakpoint = 1023,
    isMobile = false;


$( window ).resize(function() {
    windowWidth = $(window).width();
    isMobile = windowWidth <= mobileBreakpoint;
});

$( window ).on('load', function() {
    $('.preloader').fadeOut(300);
    enableScroll();
    if (isMobile) {
        let mainSlider = $('.main-slider'),
            imgSlider = $('.img-slider');
        mainSlider.slick('slickPlay');
        imgSlider.slick('slickPlay');
    } else {
        playScreenSliders();
    }
});

function initHomePage() {

    if ($('.layout-one-page').length) {
        initOnePage();
        let stickItem = $('.stick-item'),
            stickParent = stickItem.closest('.stick-parent');
        function repeatOften() {
            if (!isMobile) {
                stickFunc(stickItem, stickParent);

                sectionArray.forEach( (element) => {
                    checkActiveSection(element);
                });
                requestAnimationFrame(repeatOften);
            }
        }
        requestAnimationFrame(repeatOften);
    }
}

$(document).ready(() => {

    disableScroll();
    windowWidth = $(window).width();

    if (windowWidth <= mobileBreakpoint) {
        isMobile = true;
    }

    setTimeout(function () {
        if ($('.preloader').is(':visible')) {
            $('.preloader').fadeOut(300);
            enableScroll();
        }
        if (isMobile) {
            let mainSlider = $('.main-slider'),
                imgSlider = $('.img-slider');
            mainSlider.slick('slickPlay');
            imgSlider.slick('slickPlay');
        } else {
            playScreenSliders();
        }
    }, 10000);

    initHomePage();
    stickItemInit();

    if ($('.layout-one-page').length) {
        $('html').swipe( {
            swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                console.log(direction);
                let directionScreen;
                if (direction === 'up' ) {
                    directionScreen = 1;
                } else {
                    directionScreen = -1;
                }
                slideScreen(directionScreen);
            }
        });
    }

    $('.layout-one-page').on('mousewheel', (event) => {
        if (scrolled) {
            return false;
        }
        if (!isMobile) {
            let direction = 0,
                scrTop = $(window).scrollTop();
            if ( scrTop === 0 && event.deltaY > 0) {
                direction = -1;
            } else if (event.deltaY < 0) {
                direction = 1;
            } else {
                direction = 0;
            }
            slideScreen(direction);
        }
    });

    $('.next-section-link').on('click', (e) => {
        let nextSection = sectionArray[ currentSection ].next('section[data-section]');
        if (nextSection.length) {
            $('html, body').animate({
                'scrollTop': nextSection.offset().top
            }, 1000);
        } else if ((parseInt(currentSection) + 1) === sectionArray.length) {
            slideScreen(0, '0');
        } else {
            slideScreen(1);
        }
        e.preventDefault();
    });

    $('.pagination-link').on('click', function(e) {
        let ths = $(this),
            // thsHref = ths.attr('href'),
            thsAttr = ths.attr('data-screen'),
            sectionNumber = parseInt(ths.attr('data-section'));
            // sectionNumber = thsHref.split('-')[ 1 ],
            // screenNumber = parseInt(thsAttr);
        slideScreen(0, thsAttr, sectionNumber);
        e.preventDefault();
    });

    $('.menu-toggle').on('click', function(e) {
        let ths = $(this),
            menu = $('.slide-header');
        if (!ths.hasClass('active')) {
            ths.addClass('active');
            menu.slideDown(300);
        } else {
            ths.removeClass('active');
            menu.slideUp(300);
        }
        e.preventDefault();
    });


    let mainSlider = $('.main-slider');
    mainSlider.slick({
        'infinite': true,
        'slide': '.slide-one',
        'fade': true,
        'prevArrow': null,
        'nextArrow': '<a class="slick-next"><svg class="icon"><use xlink:href="#right-arrow"></use></svg></a>',
        'dots': true,
        'speed': 600,
        'autoplay': false,
        'autoplaySpeed': 3000,
        'pauseOnFocus': false,
        'pauseOnHover': false,
        'pauseOnDotsHover': true
    });
    mainSlider.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
        $(slick.$slides[ currentSlide ]).addClass('slideout');
    });
    mainSlider.on('afterChange', (event, slick, currentSlide) => {
        mainSlider.find('.slideout').removeClass('slideout');
    });

    $('.img-slider').slick({
        'infinite': true,
        'slide': '.slide-one',
        'fade': true,
        'arrows': false,
        'dots': false,
        'autoplay': false,
        'speed': 1000,
        'autoplaySpeed': 2000,
        'pauseOnFocus': false,
        'pauseOnHover': false
    });

    let hash = window.location.hash;
    if (hash.length && $('.tab-list').length) {
        let hashValue = hash.split('#')[ 1 ];
        setActiveTabLink(hashValue);
        changeItemsFilter(hashValue);
    }

    $('a[data-filter]').on('click', function (e) {
        let ths = $(this),
            thsAttr = ths.data('filter');
        if (!ths.hasClass('active') && !animated) {
            setActiveTabLink(thsAttr);
            changeItemsFilter(thsAttr);
        }
        e.preventDefault();
    });
    $('.footer-menu a').on('click', function (e) {
        let ths = $(this),
            thsAttr = ths.attr('href').split('#')[ 1 ];
        if (thsAttr.length) {
            if ($(`[data-filter=${ thsAttr }]`).length) {
                $('html, body').animate({
                    'scrollTop': 0
                }, 1000);
                setTimeout(() => {
                    setActiveTabLink(thsAttr);
                    changeItemsFilter(thsAttr);
                }, 300);
                e.preventDefault();
            }
        }
    });

    $('.form-input').on('input, paste, blur, keyup', function(){
        let ths = $(this);
        if (ths.val() !== '') {
            ths.addClass('filled').removeClass('error');
        } else {
            if (ths.is(':required')) {
                ths.addClass('error');
            }
            ths.removeClass('filled');
        }
    });

});


const hideItem = () => {
        let itemList = $('.item-list');
        itemList.find('li').addClass('hidden').fadeOut(300).removeClass('visible');
    },

    setActiveTabLink = (category) => {
        let tabList = $('.tab-list');
        tabList.find('.active').removeClass('active');
        tabList.find(`.tab-link[data-filter=${ category }]`).addClass('active');
        animated = true;
    },

    showFilteredItems = (category) => {
        let itemList = $('.item-list'),
            location = window.location.href.split('#')[ 0 ];

        history.pushState(null, null, `${location }#${ category}`);

        if (category === 'all') {
            itemList.find('li').fadeIn(300).removeClass('hidden').addClass('visible');
        } else {
            $(`.item[data-category=${ category }]`).each(function () {
                $(this).closest('li').fadeIn(300).removeClass('hidden').addClass('visible');
            });
        }
    },

    changeItemsFilter = (category) => {
        let catalogDesc = $('.catalog-description');
        hideItem();
        catalogDesc.find('.catalog-info:visible').fadeOut(300, () => {
            showFilteredItems(category);
            catalogDesc.find(`.catalog-info[data-category=${category}]`).fadeIn(300, () => {
                animated = false;
            });
        });

    },

    // function one page scroller
    slideScreen = (direction, screenNumber, sectionNumber) => {

        let nextScreen = !screenNumber ? currentScreen + direction : parseInt(screenNumber),
            layoutOnePage = $('.layout-one-page'),
            backScreen = screenArray[ currentScreen ],
            currScreen = screenArray[ nextScreen ];
        if (
            scrolled || nextScreen < 0 || nextScreen >= screenArray.length || (direction === 0 && !screenNumber)
        ) {
            return false;
        }
        if (nextScreen !== 0) {
            $('.header').addClass('changed');
        } else {
            $('.header').removeClass('changed');
        }

        disableScroll();
        scrolled = true;
        pauseScreenSliders();
        hideScreen(backScreen);
        showScreen(currScreen, sectionNumber);

        currentScreen = !screenNumber ? currentScreen + direction : parseInt(screenNumber);

        let footer = $('.footer');
        layoutOnePage.removeClass('show-footer');
        setTimeout(() => {
            footer.hide();
            if ( currentScreen + 1 === screenArray.length) {
                footer.show();
                layoutOnePage.addClass('show-footer');
            }
        }, screenAnimSpeedFade + 50);
        setTimeout(() => {
            scrolled = false;
            enableScroll();
            playScreenSliders();
        }, screenAnimSpeedFade + screenAnimSpeedFade + 50);
    },
    hideScreen = (screen) => {
        let layoutOnePage = $('.layout-one-page');
        screen.removeClass('showing');
        setTimeout(() => {
            screen.removeClass('fix');
            layoutOnePage.removeClass('show-footer');
        }, screenAnimSpeedFade);
    },
    showScreen = (screen, sectionNumber) => {
        setTimeout(() => {
            screen.addClass('showing').addClass('fix');
            if (!(typeof sectionNumber == 'undefined')) {
                $('html, body').animate({
                    'scrollTop': sectionArray[ sectionNumber ].offset().top
                }, 0);
            }
        }, screenAnimSpeedFade + 50);
    },
    initOnePage = () => {
        $('.screen-page').each(function() {
            screenArray.push($(this));
        });
        $('section[data-section]').each(function() {
            sectionArray.push($(this));
        });
        paginationScreen = $('.pagination-screen');
    },
    checkActiveSection = (section) => {
        if (section.closest('.screen-page').hasClass('fix')) {
            let scrTop = $(window).scrollTop(),
                sectionHeight = section.height(),
                sectionOffTop = section.offset().top;
            if (scrTop + 1 >= sectionOffTop && scrTop < sectionHeight + sectionOffTop) {
                section.addClass('mine');
                let sectionNum = section.attr('data-section');
                setActivePagination(sectionNum);
                currentSection = sectionNum;

                let nextSectionLink = $('.next-section-link');
                if ((parseInt(currentSection) + 1) === sectionArray.length) {
                    nextSectionLink.addClass('rotate');
                } else {
                    nextSectionLink.removeClass('rotate');
                }
            } else {
                section.removeClass('mine');
            }
        } else {
            section.removeClass('mine');
        }
    },
    setActivePagination = (num) => {
        let activePagination = $(paginationScreen).find(`.pagination-link[data-section=${ num }]`);
        if (!activePagination.hasClass('active')) {
            paginationScreen.find('.active').removeClass('active');
            activePagination.addClass('active');
        }
    },
    pauseScreenSliders = () => {
        $('.main-slider').slick('slickPause');
        $('.img-slider').slick('slickPause');
    },
    playScreenSliders = () => {
        let mainSlider = $('.main-slider'),
            imgSlider = $('.img-slider');
        if (mainSlider.closest('.screen-page').hasClass('fix')) {
            mainSlider.slick('slickPlay');
        }
        if (imgSlider.closest('.screen-page').hasClass('fix')) {
            imgSlider.slick('slickPlay');
        }
    },
    stickItemInit = () => {
        if (!$('.layout-one-page').length) {
            let stickItem = $('.stick-item'),
                stickParent = stickItem.closest('.stick-parent'),
                header = $('.header');
            function repeatOftenStick() {
                if (!isMobile) {
                    headerChanger(header);
                    if (stickItem.length) {
                        stickFunc(stickItem, stickParent);
                    }
                }
                requestAnimationFrame(repeatOftenStick);
            }
            requestAnimationFrame(repeatOftenStick);
        }
    },
    stickFunc = (stickItem, stickParent) => {
        let scrTop = $(window).scrollTop(),
            parentOffTop = stickParent.offset().top,
            parentHeight = stickParent.outerHeight(),
            stickHeight = stickItem.outerHeight();
        if (scrTop >= parentOffTop) {
            stickItem.addClass('stick');
        } else {
            stickItem.removeClass('stick');
        }

        if (scrTop + stickHeight > parentHeight + parentOffTop) {
            stickItem.addClass('unstick');
        } else {
            stickItem.removeClass('unstick');
        }
    },
    headerChanger = (header) => {
        let scrTop = $(window).scrollTop();
        if (scrTop > 20) {
            header.addClass('changed');
        } else {
            header.removeClass('changed');
        }
    };


// disable binded keys
let keys = { '37': 1, '38': 1, '39': 1, '40': 1 };
function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[ e.keyCode ]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
    {
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    }
    document.addEventListener('wheel', preventDefault, { 'passive': false }); // Disable scrolling in Chrome
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    }
    document.removeEventListener('wheel', preventDefault, { 'passive': false }); // Enable scrolling in Chrome
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
