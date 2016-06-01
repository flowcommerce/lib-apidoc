var navStuck = false;

function stickNav() {
  document.body.classList.add('navigation-stuck');
}

function unstickNav() {
  document.body.classList.remove('navigation-stuck');
}

function setupScrollListener() {
  window.addEventListener('scroll', function handleScroll() {
    if (window.scrollY >= 56 && !navStuck) {
      stickNav();
      navStuck = true;
    }

    if (window.scrollY < 56 && navStuck) {
      unstickNav();
      navStuck = false;
    }
  });
}

function setup() {
  setupScrollListener();
}

setup();
