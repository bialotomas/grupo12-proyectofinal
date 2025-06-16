document.addEventListener('DOMContentLoaded', function() {
    try {
        // Inicialización del menú móvil
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Solo inicializar componentes de tickets si estamos en la página de tickets
        if (window.location.pathname.includes('tickets.html')) {
            // Mostrar nombre y fecha del evento en la cabecera
            function updateEventHeader() {
                try {
                    const params = new URLSearchParams(window.location.search);
                    const eventName = params.get('event') || 'Exposición de Fotografía Urbana';
                    const eventDate = params.get('date') || '';
                    const eventNameElem = document.getElementById('event-name');
                    const eventDateElem = document.getElementById('event-date');
                    if (eventNameElem) eventNameElem.textContent = eventName;
                    if (eventDateElem) {
                        const fechaFormateada = eventDate.replace(' - ', ' • ');
                        eventDateElem.innerHTML = '<i class="fas fa-calendar mr-2"></i>' + (fechaFormateada ? fechaFormateada : 'Fecha por confirmar');
                    }
                } catch (error) {
                    console.warn('Error al actualizar el encabezado del evento:', error);
                }
            }

            // Lógica de tickets dinámica por evento
            const eventPrices = {
                'Exposición de Fotografía Urbana': 8500,
                'Noche de Poesía Experimental': 12000,
                'Realidad Virtual': 10000
            };

            function getEventFromURL() {
                try {
                    const params = new URLSearchParams(window.location.search);
                    return params.get('event') || 'Exposición de Fotografía Urbana';
                } catch (error) {
                    console.warn('Error al obtener el evento de la URL:', error);
                    return 'Exposición de Fotografía Urbana';
                }
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
                try {
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
                } catch (error) {
                    console.warn('Error al actualizar precios:', error);
                }
            }

            function updateTotal() {
                try {
                    const total = (regularCount * currentPrices.regular) + (studentCount * currentPrices.student) + (coupleCount * currentPrices.couple);
                    const totalAmountElem = document.getElementById('total-amount');
                    if (totalAmountElem) {
                        totalAmountElem.textContent = `$${total.toLocaleString('es-AR')}`;
                    }
                } catch (error) {
                    console.warn('Error al actualizar el total:', error);
                }
            }

            // Lógica para mostrar el campo de credencial de estudiante y validar archivo
            const studentCredentialDiv = document.getElementById('student-credential-upload');
            const studentCredentialFile = document.getElementById('student-credential-file');
            const buyButton = document.querySelector('button[type="submit"]');

            function checkStudentCredential() {
                try {
                    if (!studentCredentialDiv || !studentCredentialFile || !buyButton) return;

                    if (studentCount > 0) {
                        studentCredentialDiv.classList.remove('hidden');
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
                } catch (error) {
                    console.warn('Error al verificar credencial de estudiante:', error);
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
                try {
                    if (type === 'regular') regularCount++;
                    if (type === 'student') studentCount++;
                    if (type === 'couple') coupleCount++;
                    
                    const regularCountElem = document.getElementById('regular-count');
                    const studentCountElem = document.getElementById('student-count');
                    const coupleCountElem = document.getElementById('couple-count');
                    
                    if (regularCountElem) regularCountElem.textContent = regularCount;
                    if (studentCountElem) studentCountElem.textContent = studentCount;
                    if (coupleCountElem) coupleCountElem.textContent = coupleCount;
                    
                    updateTotal();
                    checkStudentCredential();
                    syncGlobals();
                } catch (error) {
                    console.warn('Error al incrementar ticket:', error);
                }
            }

            window.decrementTicket = function(type) {
                try {
                    if (type === 'regular' && regularCount > 0) regularCount--;
                    if (type === 'student' && studentCount > 0) studentCount--;
                    if (type === 'couple' && coupleCount > 0) coupleCount--;
                    
                    const regularCountElem = document.getElementById('regular-count');
                    const studentCountElem = document.getElementById('student-count');
                    const coupleCountElem = document.getElementById('couple-count');
                    
                    if (regularCountElem) regularCountElem.textContent = regularCount;
                    if (studentCountElem) studentCountElem.textContent = studentCount;
                    if (coupleCountElem) coupleCountElem.textContent = coupleCount;
                    
                    updateTotal();
                    checkStudentCredential();
                    syncGlobals();
                } catch (error) {
                    console.warn('Error al decrementar ticket:', error);
                }
            }

            if (studentCredentialFile) {
                studentCredentialFile.addEventListener('change', checkStudentCredential);
            }
        }
    } catch (error) {
        console.warn('Error en la inicialización:', error);
    }
}); 
