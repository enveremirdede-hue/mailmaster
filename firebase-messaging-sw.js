// GÜVENLİ CDN: Tırnak işaretlerinin içindeki tam URL'ler tarayıcının yönlendirme yapmasını engeller
importScripts('https://gstatic.com');
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
const database = firebase.database();

// Arka plan mesaj dinleyicisi
messaging.onBackgroundMessage(function(payload) {
    console.log("Arka planda tetiklenme alındı: ", payload);

    // Veritabanına gidip en son düşen mesajı çekiyoruz
    return database.ref('messages').limitToLast(1).once('value').then(snapshot => {
        let notificationTitle = 'Mailmaster Pro';
        let notificationBody = 'Yeni bir mesajın var!';

        snapshot.forEach(childSnapshot => {
            const messageData = childSnapshot.val();
            // Veritabanındaki 'senderName' ve 'text' alanlarını ekrana basıyoruz
            if (messageData.senderName) notificationTitle = messageData.senderName;
            if (messageData.text) notificationBody = messageData.text;
        });

        const notificationOptions = {
            body: notificationBody,
            icon: 'https://flaticon.com',
            requireInteraction: true 
        };

        return self.registration.showNotification(notificationTitle, notificationOptions);
    }).catch(err => {
        console.error("Veritabanından mesaj okuma hatası:", err);
    });
});

