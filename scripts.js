
        // Function to load HTML content into a specified placeholder element
        async function loadHTML(elementId, filePath) {
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const html = await response.text();
                document.getElementById(elementId).innerHTML = html;
            } catch (error) {
                console.error(`Could not load ${filePath}:`, error);
            }
        }

      // Global variables for lightbox
        let currentImageIndex = 0;
        let galleryImages = []; // To store unique image sources for the gallery

        // Function to open the lightbox
        function openLightbox(index) {
            if (index < 0 || index >= galleryImages.length) return;

            currentImageIndex = index;
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');

            if (galleryImages.length > 0) {
                lightboxImg.src = galleryImages[currentImageIndex];
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
            }
        }

        // Function to close the lightbox
        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Function to show the next image in the gallery
        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            document.getElementById('lightbox-img').src = galleryImages[currentImageIndex];
        }

        // Function to show the previous image in the gallery
        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            document.getElementById('lightbox-img').src = galleryImages[currentImageIndex];
        }

        // Keyboard navigation support
        document.addEventListener('keydown', function (e) {
            const lightbox = document.getElementById('lightbox');
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });

        // Touch (swipe) support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        const lightbox = document.getElementById('lightbox');

        if (lightbox) {
            lightbox.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
            });

            lightbox.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                handleGesture();
            });
        }

        function handleGesture() {
            if (touchEndX < touchStartX - 50) {
                showNextImage();
            }
            if (touchEndX > touchStartX + 50) {
                showPrevImage();
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightboxImg) {
        lightboxImg.addEventListener('click', function () {
            showNextImage();
        });
    }
});

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
        lightboxImg.src = galleryImages[currentImageIndex];
        lightboxImg.style.opacity = 1;
    }, 150);
}


        // Event listener for when the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', async () => {
            // Load header and footer HTML content asynchronously
            await loadHTML('header-placeholder', '../header.html');
            await loadHTML('footer-placeholder', '../footer.html');

            // Get references to DOM elements after header and footer are loaded
            const mainHeader = document.getElementById('main-header');
            const mainNav = document.getElementById('main-nav');
            const headerLogo = document.getElementById('header-logo');
            const body = document.body;
            const mobileMenu = document.getElementById('mobile-menu');
            const hamburgerIcon = document.getElementById('hamburger-icon');
            const mobileMenuButton = document.getElementById('mobile-menu-button');

            // Add event listener for the mobile menu button if it exists
            if (mobileMenuButton) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenu.classList.toggle('open-menu'); // Toggle mobile menu visibility
                    hamburgerIcon.classList.toggle('open'); // Animate hamburger icon
                });
            }

            // Function to dynamically update body padding based on the header's height
            function updateBodyPadding() {
                if (mainHeader) {
                    body.style.paddingTop = `${mainHeader.offsetHeight}px`;
                }
            }

            // Smooth scrolling for navigation links that point to sections on the index.html page
            document.querySelectorAll('a[href^="index.html#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault(); // Prevent default anchor behavior
                    const targetHash = this.getAttribute('href').split('#')[1]; // Get the target section ID
                    // Redirect to index.html and then scroll to the specified section
                    window.location.href = `index.html#${targetHash}`;
                });
            });

            // Event listener for window scroll to implement sticky header effects
            window.addEventListener('scroll', () => {
                const scrollThreshold = 50; // Scroll position threshold to trigger header changes
                if (window.scrollY > scrollThreshold) {
                    // Apply 'scrolled' styles when scrolled past the threshold
                    if (mainNav) { mainNav.classList.remove('py-2'); mainNav.classList.add('py-1'); }
                    if (headerLogo) { headerLogo.classList.remove('h-16'); headerLogo.classList.add('h-12'); }
                    if (mainHeader) { mainHeader.classList.add('scrolled-header'); }
                } else {
                    // Revert to initial styles when scrolled back to top
                    if (mainNav) { mainNav.classList.remove('py-1'); mainNav.classList.add('py-2'); }
                    if (headerLogo) { headerLogo.classList.remove('h-12'); headerLogo.classList.add('h-16'); }
                    if (mainHeader) { mainHeader.classList.remove('scrolled-header'); }
                }
                updateBodyPadding(); // Update body padding after header size changes
            });

            // Initial setup call to ensure correct body padding on page load
            updateBodyPadding();

            // Lightbox Initialization
            const imageElements = document.querySelectorAll('.image-strip-animated img[data-index]');
            // Update galleryImages to only include the 3 unique images
            galleryImages = Array.from(imageElements).map(img => img.src);

            imageElements.forEach(img => {
                img.addEventListener('click', () => {
                    const index = parseInt(img.dataset.index);
                    openLightbox(index);
                });
            });

            // Lightbox close button event listener
            document.getElementById('lightbox-close').addEventListener('click', closeLightbox);

            // Lightbox navigation button event listeners
            document.getElementById('lightbox-prev').addEventListener('click', showPrevImage);
            document.getElementById('lightbox-next').addEventListener('click', showNextImage);

            // Close lightbox when clicking outside the image
            document.getElementById('lightbox').addEventListener('click', (e) => {
                if (e.target.id === 'lightbox') {
                    closeLightbox();
                }
            });

            // Keyboard navigation for lightbox (Escape to close, arrows for next/prev)
            document.addEventListener('keydown', (e) => {
                const lightbox = document.getElementById('lightbox');
                if (lightbox.classList.contains('active')) {
                    if (e.key === 'Escape') {
                        closeLightbox();
                    } else if (e.key === 'ArrowRight') {
                        showNextImage();
                    } else if (e.key === 'ArrowLeft') {
                        showPrevImage();
                    }
                }
            });
        });

        // Event listener for window resize to adjust body padding dynamically
        window.addEventListener('resize', () => {
            updateBodyPadding();
        });

/* Novo script para alternar alto contraste */
        document.addEventListener('DOMContentLoaded', function() {
            const toggleButton = document.getElementById('toggleContraste');
            const body = document.body;
            const contrasteKey = 'altoContrasteAtivo'; // Chave para localStorage

            // Função para aplicar/remover o alto contraste
            function toggleAltoContraste() {
                body.classList.toggle('alto-contraste');
                const isPressed = body.classList.contains('alto-contraste');
                toggleButton.setAttribute('aria-pressed', isPressed);
                localStorage.setItem(contrasteKey, isPressed); // Salva a preferência
            }

            // Verifica se o alto contraste estava ativo na última visita
            // Adiciona um pequeno atraso para garantir que o DOM esteja totalmente renderizado
            setTimeout(() => {
                if (localStorage.getItem(contrasteKey) === 'true') {
                    toggleAltoContraste(); // Ativa se estava salvo como true
                }
            }, 50); // Pequeno atraso de 50ms

            // Adiciona o evento de clique ao botão
            toggleButton.addEventListener('click', toggleAltoContraste);
        });