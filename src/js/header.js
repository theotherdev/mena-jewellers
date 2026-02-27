/**
 * Header functionality: mobile menu toggle and link prefetching
 */

class HeaderController {
  constructor() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.menuClose = document.getElementById('menu-close');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.navLinks = document.querySelectorAll('.header__link--nav, .header__link--nav-mobile');

    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupLinkPrefetching();
  }

  setupMobileMenu() {
    if (!this.menuToggle || !this.menuClose || !this.mobileMenu) return;

    // Open menu
    this.menuToggle.addEventListener('click', () => {
      this.mobileMenu.classList.remove('hidden');
    });

    // Close menu
    this.menuClose.addEventListener('click', () => {
      this.mobileMenu.classList.add('hidden');
    });

    // Close menu when clicking on a link
    const mobileLinks = this.mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.mobileMenu.classList.add('hidden');
      });
    });
  }

  setupLinkPrefetching() {
    // Prefetch links on hover (desktop) and touchstart (mobile) for faster navigation
    this.navLinks.forEach(link => {
      // Desktop: prefetch on mouseenter
      link.addEventListener('mouseenter', () => this.prefetchLink(link), { once: true });

      // Mobile: prefetch on touchstart
      link.addEventListener('touchstart', () => this.prefetchLink(link), { once: true, passive: true });
    });
  }

  prefetchLink(link) {
    const href = link.getAttribute('href');

    // Don't prefetch external links or anchors
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//')) {
      return;
    }

    // Check if already prefetched
    if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
      return;
    }

    // Create prefetch link
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = href;
    prefetchLink.as = 'document';

    document.head.appendChild(prefetchLink);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new HeaderController());
} else {
  new HeaderController();
}
