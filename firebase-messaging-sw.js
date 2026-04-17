importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Senin Firebase Proje Ayarların
firebase.initializeApp({
    apiKey: "AIzaSyA1bzy3VaZJwUwlhybNt6yrVzurQsrcqLw",
    projectId: "mailmaster-62785",
    messagingSenderId: "324963953782",
    appId: "1:324963953782:web:a2baa1cf64db51798bc357"
});

const messaging = firebase.messaging();

// Site tamamen kapalıyken veya arka plandayken mesaj gelirse bu çalışır
messaging.onBackgroundMessage(function(payload) {
    console.log("Arka planda mesaj alındı: ", payload);
    
    // BURASI DÜZELTİLDİ: payload.data yerine payload.notification okuyoruz!
    const notificationTitle = payload.notification ? payload.notification.title : 'Mailmaster Pro';
    const notificationOptions = {
        body: payload.notification ? payload.notification.body : 'Yeni bir mesajın var!',
        icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
