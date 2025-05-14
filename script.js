function updateClock() {
    const clockElements = document.querySelectorAll('.clock');

    clockElements.forEach(clockElement => {
        const timezone = clockElement.dataset.timezone;
        const timeElement = clockElement.querySelector('.time');
        const now = new Date();

        // Options for formatting the time
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: timezone
        };

        timeElement.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
    });
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display the time immediately
updateClock();