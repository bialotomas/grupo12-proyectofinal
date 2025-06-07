document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.md\\:hidden');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}); 