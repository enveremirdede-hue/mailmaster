importScripts('https://gstatic.com');
importScripts('https://gstatic.com');

// Firebase Ayarların
firebase.initializeApp({
    apiKey: "AIzaSyA1bzy3VaZJwUwlhybNt6yrVzurQsrcqLw",
    databaseURL: "https://firebaseio.com",
    projectId: "mailmaster-62785",
    messagingSenderId: "324963953782",
    appId: "1:324963953782:web:a2baa1cf64db51798bc357"
});

const messaging = firebase.messaging();

// Arka plan mesaj dinleyicisi
messaging.onBackgroundMessage(function(payload) {
    console.log("Arka planda mesaj alındı: ", payload);
    
    // Güvenli veri çekme işlemi (Çökmeleri önler)
    const notificationTitle = payload.notification ? payload.notification.title : 'Mailmaster Pro';
    const notificationOptions = {
        body: payload.notification ? payload.notification.body : 'Yeni bir mesajın var!',
        icon: 'https://flaticon.com',
        // Cihazın uykuya dalıp bildirimi yutmasını engeller:
        requireInteraction: true 
    };

    // Cihazın hafızasını (RAM) doğru temizlemesi için return ile döndürüyoruz
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

