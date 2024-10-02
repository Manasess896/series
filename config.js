
var firebaseConfig = {
    apiKey: "AIzaSyCHsM7ilPDcoybvEhGkviM4p_4l7LB4mrE",
    authDomain: "psychic-heading-419408.firebaseapp.com",
    databaseURL: "https://psychic-heading-419408-default-rtdb.firebaseio.com",
    projectId: "psychic-heading-419408",
    storageBucket: "psychic-heading-419408.appspot.com",
    messagingSenderId: "178132155551",
    appId: "1:178132155551:web:a221e700a40e8585adb6aa",
    measurementId: "G-DWC79ZBE43"
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
