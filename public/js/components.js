async function loadHeader() {
    let general = null;
    try {
        general = await fetchData('general');
    } catch (e) { console.warn('Failed to load general settings'); }

    const logo = general?.logo || 'https://placehold.co/150x50/2ecc71/ffffff?text=ABC+Institute';
    const name = general?.name || 'ABC Institute';

    const navbar = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <img src="${logo}" alt="Logo" class="me-2">
                <span>${name}</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="courses.html">Courses</a></li>
                    <li class="nav-item"><a class="nav-link" href="testimonials.html">Testimonials</a></li>
                    <li class="nav-item"><a class="nav-link" href="gallery.html">Gallery</a></li>
                    <li class="nav-item"><a class="nav-link" href="events.html">Events</a></li>
                    <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
                </ul>
                <a href="#enquire" class="btn btn-primary-green ms-lg-3 rounded-pill d-none d-lg-block">Enquire Now</a>
            </div>
        </div>
    </nav>`;

    const headerEl = document.getElementById('header-container');
    if (headerEl) headerEl.innerHTML = navbar;
}

async function loadFooter() {
    let general = null;
    try {
        general = await fetchData('general');
    } catch (e) { }

    const year = new Date().getFullYear();
    const footer = `
    <footer class="pt-5 pb-2">
        <div class="container">
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${logo}" alt="Logo" class="footer-logo me-2">
                        <h5 class="mb-0 text-white">${general?.name || '7S Institute'}</h5>
                    </div>
                    <p class="text-white-50">Empowering students with future-ready skills.</p>
                    <div class="social-links">
                        <a href="#" class="me-3"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="me-3"><i class="bi bi-twitter"></i></a>
                        <a href="#" class="me-3"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="me-3"><i class="bi bi-linkedin"></i></a>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="courses.html">Courses</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                        <li><a href="admin.html">Admin Panel</a></li>
                    </ul>
                </div>
                <div class="col-md-4 mb-4">
                    <h5>Contact</h5>
                    <p class="text-white-50">
                        <i class="bi bi-geo-alt me-2"></i> ${general?.contact?.address || 'City, Country'}<br>
                        <i class="bi bi-phone me-2"></i> ${general?.contact?.phone || '+123456789'}<br>
                        <i class="bi bi-envelope me-2"></i> ${general?.contact?.email || 'info@abc.com'}
                    </p>
                </div>
            </div>
            <hr class="border-secondary mt-4">
            <div class="text-center text-white-50">
                <small>&copy; ${year} ${general?.name || 'ABC Institute'}. All rights reserved.</small>
            </div>
        </div>
    </footer>
    `;

    const footerEl = document.getElementById('footer-container');
    if (footerEl) footerEl.innerHTML = footer;
}

// Global image error handler
window.addEventListener('error', function (e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Broken image detected:', e.target.src);
        // Fallback to a clean institute/placeholder image if the URL fails
        e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&h=600';
    }
}, true);

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
});
