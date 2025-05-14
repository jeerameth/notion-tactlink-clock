function updateClock() {
    const clockElements = Array.from(document.querySelectorAll('.clock'));
    const container = document.querySelector('.world-clock-grid-container');
    const largeItem = container.querySelector('.grid-item-large');
    const regularItems = clockElements.filter(item => !item.classList.contains('grid-item-large'));

    // Update Singapore clock
    const singaporeTimeElement = largeItem.querySelector('.time');
    const singaporeTimezone = largeItem.dataset.timezone;
    const nowSingapore = new Date();
    const singaporeTimeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: singaporeTimezone,
        hour12: true,
        hourCycle: 'h12',
        amPm: 'short'
    };
    singaporeTimeElement.textContent = new Intl.DateTimeFormat('en-US', singaporeTimeOptions).format(nowSingapore);

    regularItems.forEach(clockElement => {
        const timezone = clockElement.dataset.timezone;
        const timeElement = clockElement.querySelector('.time');
        const now = new Date();

        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone,
            hour12: true,
            hourCycle: 'h12',
            amPm: 'short'
        };

        timeElement.textContent = new Intl.DateTimeFormat('en-US', timeOptions).format(now);

        // No need to get the numeric timezone offset anymore for time display
    });

    // Sort the regular clock elements (based on local time for now, as timezone offset removal was requested)
    regularItems.sort((a, b) => {
        const timeA = new Date().toLocaleString('en-US', { timeZone: a.dataset.timezone, hourCycle: 'h24', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const timeB = new Date().toLocaleString('en-US', { timeZone: b.dataset.timezone, hourCycle: 'h24', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return new Date(`2000/01/01 ${timeA.split(' ')[1]}`).getTime() - new Date(`2000/01/01 ${timeB.split(' ')[1]}`).getTime();
    });

    // Clear the container (except the large item)
    container.innerHTML = '';
    container.appendChild(largeItem);

    // Append the sorted regular items and set their grid column
    regularItems.forEach((clock, index) => {
        const column = 2 + (index % 3); // Cycle through the next 3 columns
        const row = 1 + Math.floor(index / 3);
        clock.style.gridColumn = column;
        clock.style.gridRow = row;
        container.appendChild(clock);
    });
}

function adjustGrid() {
    updateClock(); // Re-calculate and re-layout on resize
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display and sort the time immediately
updateClock();

// Adjust layout on window resize (optional)
window.addEventListener('resize', adjustGrid);