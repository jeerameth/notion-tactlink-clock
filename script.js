function updateClock() {
    const clockElements = Array.from(document.querySelectorAll('.clock'));
    const container = document.querySelector('.world-clock-grid-container');
    const largeItem = container.querySelector('.grid-item-large');
    const regularItems = clockElements.filter(item => !item.classList.contains('grid-item-large'));

    // Get Singapore time and timezone offset
    const singaporeTimezone = largeItem.dataset.timezone;
    const nowSingapore = new Date();
    const singaporeOffsetString = nowSingapore.toLocaleString('en-US', { timeZone: singaporeTimezone, timeZoneName: 'shortOffset' });
    let singaporeOffsetTotalMinutes = 0;

    const partsSingapore = singaporeOffsetString.match(/([+-])(\d{1,2}):?(\d{2})?/);
    if (partsSingapore) {
        const sign = partsSingapore[1] === '-' ? -1 : 1;
        const hours = parseInt(partsSingapore[2] || 0);
        const minutes = parseInt(partsSingapore[3] || 0);
        singaporeOffsetTotalMinutes = sign * (hours * 60 + minutes);
    } else if (singaporeOffsetString.startsWith('GMT')) {
        const gmtParts = singaporeOffsetString.match(/GMT([+-])(\d{1,2})(\d{2})?/);
        if (gmtParts) {
            const sign = gmtParts[1] === '-' ? -1 : 1;
            const hours = parseInt(gmtParts[2] || 0);
            const minutes = parseInt(gmtParts[3] || 0);
            singaporeOffsetTotalMinutes = sign * (hours * 60 + minutes);
        }
    }

    // Update Singapore clock
    const singaporeTimeElement = largeItem.querySelector('.time');
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
        const diffElement = clockElement.querySelector('.time-diff');
        const nowOther = new Date();

        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timezone,
            hour12: true,
            hourCycle: 'h12',
            amPm: 'short'
        };
        timeElement.textContent = new Intl.DateTimeFormat('en-US', timeOptions).format(nowOther);

        // Calculate time difference from Singapore
        const otherOffsetString = nowOther.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'shortOffset' });
        let otherOffsetTotalMinutes = 0;

        const partsOther = otherOffsetString.match(/([+-])(\d{1,2}):?(\d{2})?/);
        if (partsOther) {
            const sign = partsOther[1] === '-' ? -1 : 1;
            const hours = parseInt(partsOther[2] || 0);
            const minutes = parseInt(partsOther[3] || 0);
            otherOffsetTotalMinutes = sign * (hours * 60 + minutes);
        } else if (otherOffsetString.startsWith('GMT')) {
            const gmtParts = otherOffsetString.match(/GMT([+-])(\d{1,2})(\d{2})?/);
            if (gmtParts) {
                const sign = gmtParts[1] === '-' ? -1 : 1;
                const hours = parseInt(gmtParts[2] || 0);
                const minutes = parseInt(gmtParts[3] || 0);
                otherOffsetTotalMinutes = sign * (hours * 60 + minutes);
            }
        }

        const diffMinutes = otherOffsetTotalMinutes - singaporeOffsetTotalMinutes;
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = Math.abs(diffMinutes) % 60;
        const sign = diffMinutes > 0 ? '+' : diffMinutes < 0 ? '-' : '';

        diffElement.textContent = sign ? `(${sign}${Math.abs(diffHours)}h ${String(remainingMinutes).padStart(2, '0')}m)` : '(same)';
    });

    // Sort the regular clock elements (based on local time for now)
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