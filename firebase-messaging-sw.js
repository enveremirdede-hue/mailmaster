// ARTIK HARİCİ KÜTÜPHANE YOK! Tarayıcı güvenlik duvarlarına asla takılmaz.

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Arka planda push sinyali alındı.');

    // Firebase Realtime Database URL (En son mesajı çekmek için doğrudan güvenli JSON endpoint kullanımı)
    const dbUrl = "https://firebaseio.com\"$key\"&limitToLast=1";

    // Tüm cihazlar ve bilgisayarlar için güvenli varsayılan değerler (Fallback)
    let notificationTitle = 'Mailmaster Pro';
    let notificationOptions = {
        body: 'Yeni bir mesajın var!',
        icon: 'https://flaticon.com',
        badge: 'https://flaticon.com', // Android durum çubuğu için küçük ikon
        
        // 🔥 İPAD, İPHONE & PC MEKANİZMASI 1:
        // Kullanıcı tıklayana veya kapatana kadar bildirim ekranda kilitli kalır, kendi kendine kaybolamaz.
        requireInteraction: true,
        
        // Android ve mobil cihazlar için standart titreşim şablonu (PC'lerde hata vermemesi için düzgün dizi formatında)
        vibrate:,
        
        // Bildirim verilerinin zaman damgası
        data: { time: Date.now() }
    };

    // 🔥 İPAD, İPHONE & ANDROID MEKANİZMASI 2 (Kusursuzluk Akışı):
    // Veritabanından mesaj bilgileri çekilene ve bildirim ekrana basılana kadar
    // Apple (iOS/iPadOS) ve Android sistemlerinin Service Worker sürecini arka planda öldürmesini KESİNLİKLE engeller.
    const pipeline = fetch(dbUrl)
        .then(response => {
            if (!response.ok) throw new Error('Veritabanı yanıt vermedi');
            return response.json();
        })
        .then(data => {
            if (data) {
                const keys = Object.keys(data);
                if (keys.length > 0) {
                    const lastMessage = data[keys[0]]; // En son eklenen mesaj nesnesini güvenle alıyoruz
                    
                    // Veritabanınızdaki alan adlarına göre başlık ve mesajı dinamik yerleştiriyoruz
                    if (lastMessage.senderName) notificationTitle = lastMessage.senderName;
                    if (lastMessage.text) notificationOptions.body = lastMessage.text;
                    
                    // Eğer veritabanınızda oda/grup ismi varsa başlığa şık bir şekilde ekler (#Genel Sohbet gibi)
                    if (lastMessage.roomName) {
                        notificationTitle += ` (#${lastMessage.roomName})`;
                    }
                }
            }
            // Bildirimi tarayıcıya/işletim sistemine resmi olarak teslim et
            return self.registration.showNotification(notificationTitle, notificationOptions);
        })
        .catch(err => {
            console.error("[Service Worker] Veri çekme veya işletim sistemi hatası:", err);
            // İnternet kopuk olsa veya veritabanı anlık yanıt vermese bile süreci çökertme, yedek bildirimi göster!
            return self.registration.showNotification(notificationTitle, notificationOptions);
        });

    // İşletim sistemine (Özellikle iPadOS/iOS): "Bu akış bitene kadar arka plan motorunu açık tut" emrini veriyoruz.
    event.waitUntil(pipeline);
});

// 🔥 BİLGİSAYAR & MOBİL ETKİLEŞİM MEKANİZMASI:
// Bildirime tıklandığında uygulamanın/sitenin otomatik ön plana gelmesini sağlar.
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Bildirim kutucuğunu kapat

    // Eğer site sekmelerde zaten açıksa oraya odaklan (parlat), kapalıysa yeni sekmede temizce aç
    const urlToOpen = self.location.origin;
    
    const clickProcess = clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // Eğer site zaten bir sekmede açıksa oraya odaklan
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Sitenin sekmesi tamamen kapalıysa yeni sekme aç
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        });

    event.waitUntil(clickProcess);
});

