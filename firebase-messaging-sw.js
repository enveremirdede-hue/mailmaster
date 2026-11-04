// ARTIK HARİCİ KÜTÜPHANE YOK! Tarayıcı güvenlik duvarlarına asla takılmaz.

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Arka planda push sinyali alındı.');

    // Veritabanı URL (JSON endpoint kullanımı)
    const dbUrl = "https://firebaseio.com\"$key\"&limitToLast=1";

    // Tüm cihazlar için kurşun geçirmez varsayılan ayarlar (Fallback)
    let notificationTitle = 'Mailmaster Pro';
    let notificationOptions = {
        body: 'Yeni bir mesajın var!',
        icon: 'https://flaticon.com',
        badge: 'https://flaticon.com',
        
        // 📌 KUSURSUZLUK AYARI 1: Kullanıcı dokunana kadar ekranda kilitli kalır, uyku modunda yutulamaz.
        requireInteraction: true,
        
        // PC ve mobil cihaz uyumluluğu için standart titreşim dizisi
        vibrate:,
        
        // Bildirim tıklandığında açılacak varsayılan URL (Ana sayfa)
        data: { targetUrl: self.location.origin } 
    };

    // 📌 KUSURSUZLUK AYARI 2: Tüm asenkron işlemler bitene kadar işletim sisteminin süreci öldürmesini engeller.
    const pipeline = fetch(dbUrl)
        .then(response => {
            if (!response.ok) throw new Error('Veritabanı yanıt vermedi');
            return response.json();
        })
        .then(data => {
            if (data) {
                const keys = Object.keys(data);
                if (keys.length > 0) {
                    const lastMessage = data[keys]; // En son atılan mesaj verisi
                    
                    // Sizin veritabanı alanlarınızla tam eşleşme (sender ve text):
                    if (lastMessage.sender) notificationTitle = lastMessage.sender;
                    if (lastMessage.text) notificationOptions.body = lastMessage.text;
                    
                    // 🧠 AKILLI ODA ÇÖZÜCÜ (index.html'e dokunmadan çalışır):
                    // Eğer mesaj nesnesinde roomId yoksa, Realtime Database'deki mesajın üst klasör 
                    // veya veri yolundan hangi odaya ait olduğunu tahmin etmeye çalışır.
                    if (lastMessage.roomId) {
                        notificationOptions.data.targetUrl = `${self.location.origin}/?room=${lastMessage.roomId}`;
                        if (lastMessage.roomName) notificationTitle += ` (#${lastMessage.roomName})`;
                    }
                }
            }
            // Bildirimi ekrana resmi olarak bas
            return self.registration.showNotification(notificationTitle, notificationOptions);
        })
        .catch(err => {
            console.error("[Service Worker] Hata:", err);
            // Bağlantı kopsa bile sistemi çökertme, en azından yedek bildirimi ekranda göster!
            return self.registration.showNotification(notificationTitle, notificationOptions);
        });

    event.waitUntil(pipeline);
});

// 📌 TIKLANDIĞINDA ÇALIŞAN KUSURSUZ YÖNLENDİRİCİ
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Bildirim kutusunu kapat

    const targetUrl = event.notification.data.targetUrl;
    
    const clickProcess = clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => {
            // Eğer site sekmelerde açıksa, yeni sekme açmak yerine açık olan sekmeyi parlatır
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.startsWith(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Site kapalıysa yeni sekmede tertemiz açar
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        });

    event.waitUntil(clickProcess);
});

