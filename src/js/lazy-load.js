/**
 * Enhanced lazy loading with Intersection Observer
 * Provides better control over image loading timing and fade-in transitions
 */

class LazyImageLoader {
  constructor() {
    this.images = document.querySelectorAll('.image--lazy img');
    this.observer = null;
    this.init();
  }

  init() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    } else {
      // Fallback: load all images immediately and handle fade-in
      this.loadAllImages();
    }
  }

  setupObserver() {
    const options = {
      // Start loading 100px before image enters viewport
      rootMargin: '100px 0px',
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all lazy images
    this.images.forEach(img => {
      // If image is already loaded (from browser cache), show it immediately
      if (img.complete && img.naturalHeight !== 0) {
        this.showImage(img);
      } else {
        this.observer.observe(img);
      }
    });
  }

  loadImage(img) {
    // If image has data-src, use it (for manual lazy loading)
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }

    // If image has data-srcset, use it
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }

    // Wait for image to load, then show it with fade-in
    if (img.complete) {
      this.showImage(img);
    } else {
      img.addEventListener('load', () => this.showImage(img), { once: true });
      img.addEventListener('error', () => this.showImage(img), { once: true });
    }
  }

  showImage(img) {
    img.classList.add('loaded');
    img.classList.remove('opacity-0');
  }

  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LazyImageLoader());
} else {
  new LazyImageLoader();
}
