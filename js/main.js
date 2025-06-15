document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.md\\:hidden');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Mostrar nombre y fecha del evento en la cabecera
    function updateEventHeader() {
        const params = new URLSearchParams(window.location.search);
        const eventName = params.get('event') || 'Exposición de Fotografía Urbana';
        const eventDate = params.get('date') || '';
        const eventNameElem = document.getElementById('event-name');
        const eventDateElem = document.getElementById('event-date');
        if (eventNameElem) eventNameElem.textContent = eventName;
        if (eventDateElem) {
            // Reemplaza el guion por un punto medio para el formato visual
            const fechaFormateada = eventDate.replace(' - ', ' • ');
            eventDateElem.innerHTML = '<i class="fas fa-calendar mr-2"></i>' + (fechaFormateada ? fechaFormateada : 'Fecha por confirmar');
        }
    }

    // Lógica de tickets dinámica por evento
    const eventPrices = {
        'Exposición de Fotografía Urbana': 8500,
        'Noche de Poesía Experimental': 12000,
        'Realidad Virtual': 10000
    };

    function getEventFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('event') || 'Exposición de Fotografía Urbana';
    }

    function getPricesForEvent(eventName) {
        const base = eventPrices[eventName] || 8500;
        return {
            regular: base,
            student: Math.round(base * 0.8),
            couple: Math.round(base * 2 * 0.85),
            base: base
        };
    }

    let regularCount = 0;
    let studentCount = 0;
    let coupleCount = 0;
    let currentPrices = getPricesForEvent(getEventFromURL());

    function updateTicketPrices() {
        // Forzar actualización de todos los precios
        const regularPriceElem = document.getElementById('regular-price');
        const studentPriceElem = document.getElementById('student-price');
        const studentLineElem = document.querySelector('#student-price + .text-sm');
        const couplePriceElem = document.getElementById('couple-price');
        const coupleLineElem = document.querySelector('#couple-price + .text-sm');
        if (regularPriceElem) regularPriceElem.textContent = `$${currentPrices.regular.toLocaleString('es-AR')}`;
        if (studentPriceElem) studentPriceElem.textContent = `$${currentPrices.student.toLocaleString('es-AR')}`;
        if (studentLineElem) studentLineElem.textContent = `$${currentPrices.regular.toLocaleString('es-AR')}`;
        if (couplePriceElem) couplePriceElem.textContent = `$${currentPrices.couple.toLocaleString('es-AR')}`;
        if (coupleLineElem) coupleLineElem.textContent = `$${(currentPrices.regular*2).toLocaleString('es-AR')}`;
    }

    function updateTotal() {
        const total = (regularCount * currentPrices.regular) + (studentCount * currentPrices.student) + (coupleCount * currentPrices.couple);
        document.getElementById('total-amount').textContent = `$${total.toLocaleString('es-AR')}`;
    }

    // Lógica para mostrar el campo de credencial de estudiante y validar archivo
    const studentCredentialDiv = document.getElementById('student-credential-upload');
    const studentCredentialFile = document.getElementById('student-credential-file');
    const buyButton = document.querySelector('button[type="submit"]');

    function checkStudentCredential() {
        // Mostrar campo si hay al menos 1 ticket estudiante
        if (studentCount > 0) {
            studentCredentialDiv.classList.remove('hidden');
            // Deshabilitar botón si no hay archivo
            if (!studentCredentialFile.files || studentCredentialFile.files.length === 0) {
                buyButton.disabled = true;
                buyButton.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                buyButton.disabled = false;
                buyButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        } else {
            studentCredentialDiv.classList.add('hidden');
            buyButton.disabled = false;
            buyButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // Inicializar todo al cargar
    updateEventHeader();
    currentPrices = getPricesForEvent(getEventFromURL());
    updateTicketPrices();
    updateTotal();

    // Exponer variables globales para otros scripts
    window.regularCount = regularCount;
    window.studentCount = studentCount;
    window.coupleCount = coupleCount;
    window.currentPrices = currentPrices;

    // Sincronizar los contadores globales al modificar tickets
    function syncGlobals() {
        window.regularCount = regularCount;
        window.studentCount = studentCount;
        window.coupleCount = coupleCount;
        window.currentPrices = currentPrices;
    }
    window.incrementTicket = function(type) {
        if (type === 'regular') regularCount++;
        if (type === 'student') studentCount++;
        if (type === 'couple') coupleCount++;
        document.getElementById('regular-count').textContent = regularCount;
        document.getElementById('student-count').textContent = studentCount;
        document.getElementById('couple-count').textContent = coupleCount;
        updateTotal();
        checkStudentCredential();
        syncGlobals();
    }
    window.decrementTicket = function(type) {
        if (type === 'regular' && regularCount > 0) regularCount--;
        if (type === 'student' && studentCount > 0) studentCount--;
        if (type === 'couple' && coupleCount > 0) coupleCount--;
        document.getElementById('regular-count').textContent = regularCount;
        document.getElementById('student-count').textContent = studentCount;
        document.getElementById('couple-count').textContent = coupleCount;
        updateTotal();
        checkStudentCredential();
        syncGlobals();
    }
    if (studentCredentialFile) {
        studentCredentialFile.addEventListener('change', checkStudentCredential);
    }
}); 
