
var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var currentTime = new Date().toLocaleString(); // Get current time

function trackPageView() {
    fetch('https://api.ipify.org?format=json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            var pageViewRef = database.ref('pageViews').push();
            pageViewRef.set({
                url: window.location.href,
                timestamp: Date.now(),
                visitedTime: currentTime,
                userAgent: navigator.userAgent,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                referer: document.referrer,
                language: navigator.languages ? navigator.languages[0] : navigator.language,
                cookie: document.cookie,
                cache: JSON.stringify(window.performance.getEntriesByType('resource')),
                ip: data.ip // Set the fetched IP address
            });
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);
        });
}

function closeModal() {
    if (document.getElementById('agreeCheckbox').checked) {
        localStorage.setItem('consentGiven', 'true');
        var consentRef = database.ref('consents').push();
        consentRef.set({
            timestamp: Date.now(),
            visitedTime: currentTime,
            userAgent: navigator.userAgent,
            ip: '', // Leave it empty here
            status: 'Agreed'
        });
    }
    setTimeout(() => {
        var consentModal = document.getElementById('consentModal');
        if (consentModal) {
            consentModal.style.display = 'none';
        }
        trackPageView();
    }, 2000); // Delay of 2000 milliseconds (2 seconds)
}

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('consentGiven')) {
        var consentModal = document.getElementById('consentModal');
        if (consentModal) {
            consentModal.style.display = 'block';
        }
    } else {
        trackPageView();
    }
});