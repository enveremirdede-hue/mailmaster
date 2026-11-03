// ARTIK IMPORTSCRIPTS YOK! Tarayıcı güvenlik duvarına takılamaz.

// Arka planda bir push (bildirim) sinyali geldiğinde tetiklenen yerel fonksiyon
self.addEventListener('push', function(event) {
    console.log('Arka planda ham push sinyali alındı.');

    let notificationTitle = 'Mailmaster Pro';
    let notificationOptions = {
        body: 'Yeni bir mesajın var!',
        icon: 'https://flaticon.com',
        requireInteraction: true
    };

    // Eğer gelen bildirim verisi (payload) varsa içeriği direkt oradan oku
    if (event.data) {
        try {
            const data = event.data.json();
            
            // Eğer bildirim doğrudan backend/kod tarafından doldurulduysa
            if (data.notification) {
                notificationTitle = data.notification.title || notificationTitle;
                notificationOptions.body = data.notification.body || notificationOptions.body;
            } 
            // Veya esnek data objesiyle geldiyse
            else if (data.data) {
                notificationTitle = data.data.sender || notificationTitle;
                notificationOptions.body = data.data.message || notificationOptions.body;
            }
        } catch (e) {
            // Eğer gelen veri JSON değilse düz metin olarak oku
            notificationOptions.body = event.data.text();
        }
    }

    // Bildirimi ekrana bas
    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});

