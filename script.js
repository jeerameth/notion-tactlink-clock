function updateClock() {
    const clockElements = document.querySelectorAll('.clock');

    clockElements.forEach(clockElement => {
        const timezone = clockElement.dataset.timezone;
        const timeElement = clockElement.querySelector('.time');
        const offsetElement = clockElement.querySelector('.timezone-offset');
        const now = new Date();

        // Options for formatting the time (without seconds)
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone
        };

        timeElement.textContent = new Intl.DateTimeFormat('en-US', timeOptions).format(now);

        // Get the timezone offset in minutes
        const offsetMinutes = new Date().toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'numeric' }).slice(-6);

        // Format the offset to +/-HH:MM
        const offsetSign = offsetMinutes.startsWith('-') ? '-' : '+';
        const offsetHours = String(Math.floor(Math.abs(parseInt(offsetMinutes)) / 60)).padStart(2, '0');
        const offsetMins = String(Math.abs(parseInt(offsetMinutes)) % 60).padStart(2, '0');
        offsetElement.textContent = `UTC${offsetSign}${offsetHours}:${offsetMins}`;
    });
}

// Update the clock every minute (since we removed seconds)
setInterval(updateClock, 60000);

// Initial call to display the time immediately
updateClock();