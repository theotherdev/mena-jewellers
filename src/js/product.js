/**
 * Product page functionality: image navigation, variant selection, and AJAX cart
 */

class ProductPage {
  constructor() {
    this.gallery = document.getElementById('product-gallery');
    if (!this.gallery) return;

    this.imagesContainer = this.gallery.querySelector('.product__images');
    this.images = this.gallery.querySelectorAll('.product__image-wrapper');
    this.prevBtn = this.gallery.querySelector('.product__nav--prev');
    this.nextBtn = this.gallery.querySelector('.product__nav--next');
    this.prevBtnDesktop = document.querySelector('.product__nav-desktop--prev');
    this.nextBtnDesktop = document.querySelector('.product__nav-desktop--next');
    this.variantButtons = document.querySelectorAll('.product__variant-btn');
    this.variantSelect = document.getElementById('product-select');
    this.productForm = document.querySelector('.product__form');

    this.currentIndex = 0;

    this.init();
  }

  init() {
    this.setupImageNavigation();
    this.setupVariantSelection();
    this.setupAjaxCart();
    this.checkCartDrawerFlag();
  }

  setupImageNavigation() {
    // Mobile image navigation
    if (this.prevBtn && this.nextBtn) {
      this.prevBtn.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.scrollToImage(this.currentIndex);
        }
      });

      this.nextBtn.addEventListener('click', () => {
        if (this.currentIndex < this.images.length - 1) {
          this.currentIndex++;
          this.scrollToImage(this.currentIndex);
        }
      });
    }

    // Desktop image navigation
    if (this.prevBtnDesktop && this.nextBtnDesktop) {
      this.prevBtnDesktop.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.scrollToImage(this.currentIndex);
        }
      });

      this.nextBtnDesktop.addEventListener('click', () => {
        if (this.currentIndex < this.images.length - 1) {
          this.currentIndex++;
          this.scrollToImage(this.currentIndex);
        }
      });
    }
  }

  scrollToImage(index) {
    const image = this.images[index];
    if (image) {
      image.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }

  setupVariantSelection() {
    if (this.variantButtons.length === 0 || !this.variantSelect) return;

    const selectedOptions = {};

    // Get product variants from global window object
    const productVariants = window.productVariants || [];

    // Initialize selected options from current variant
    const currentOption = this.variantSelect.options[this.variantSelect.selectedIndex];
    if (currentOption) {
      const variantTitle = currentOption.text.split(' - ')[0];
      const optionValues = variantTitle.split(' / ');

      this.variantButtons.forEach(btn => {
        const position = btn.dataset.optionPosition;
        const value = btn.dataset.optionValue;
        if (optionValues.includes(value)) {
          selectedOptions[position] = value;
          btn.classList.add('selected');
        }
      });
    }

    // Handle variant button clicks
    this.variantButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;

        const position = btn.dataset.optionPosition;
        const value = btn.dataset.optionValue;

        // Update selected options
        selectedOptions[position] = value;

        // Update button states
        document.querySelectorAll(`[data-option-position="${position}"]`).forEach(b => {
          b.classList.remove('selected');
        });
        btn.classList.add('selected');

        // Find matching variant
        const matchingVariant = Array.from(this.variantSelect.options).find(option => {
          const variantTitle = option.text.split(' - ')[0];
          const optionValues = variantTitle.split(' / ');

          return Object.values(selectedOptions).every(val => optionValues.includes(val));
        });

        if (matchingVariant) {
          this.variantSelect.value = matchingVariant.value;

          // Update add to cart button
          const addToCartBtn = document.querySelector('.product__add-to-cart');
          const variant = productVariants.find(v => v.id == matchingVariant.value);

          if (variant) {
            addToCartBtn.disabled = !variant.available;
            addToCartBtn.textContent = variant.available ? 'Add to Cart' : 'Sold Out';
          }
        }
      });
    });
  }

  setupAjaxCart() {
    if (!this.productForm) return;

    this.productForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(this.productForm);
      const addToCartBtn = this.productForm.querySelector('.product__add-to-cart');
      const originalText = addToCartBtn.textContent;

      // Disable button and show loading state
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = 'Adding...';

      // Add to cart via AJAX
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }
        return response.json();
      })
      .then(data => {
        // Store flag to open cart drawer after reload
        sessionStorage.setItem('openCartDrawer', 'true');

        // Reload page to update cart drawer content
        window.location.reload();
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = originalText;
        alert('Error adding item to cart. Please try again.');
      });
    });
  }

  checkCartDrawerFlag() {
    // Check if we should open the cart drawer after page reload
    if (sessionStorage.getItem('openCartDrawer') === 'true') {
      sessionStorage.removeItem('openCartDrawer');

      // Trigger cart drawer open
      const cartTrigger = document.querySelector('[data-cart-trigger]');
      if (cartTrigger) {
        cartTrigger.click();
      }
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ProductPage());
} else {
  new ProductPage();
}
