document.addEventListener('DOMContentLoaded', function() {
    let deferredPrompt;
    const pwaContainer = document.getElementById('pwaInstallContainer');
    const installBtn = document.getElementById('pwaHorizontalBtn');

    // 1. Capturar el evento nativo de instalación de la PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Mostrar el contenedor flotante de instalación si está disponible
        if (pwaContainer) {
            pwaContainer.style.display = 'block';
        }
    });

    // 2. Ejecutar la instalación al hacer clic en el botón personalizado
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Elección del usuario: ${outcome}`);
            
            deferredPrompt = null;
            if (pwaContainer) {
                pwaContainer.style.display = 'none';
            }
        });
    }

    // 3. Ocultar si la app ya fue instalada con éxito
    window.addEventListener('appinstalled', () => {
        console.log('¡PWA de Taccto instalada con éxito!');
        if (pwaContainer) {
            pwaContainer.style.display = 'none';
        }
    });

    // 4. Animaciones para las tarjetas de servicio (Tus estilos originales)
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
