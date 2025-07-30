let tables = Array(10).fill().map((_, i) => ({ 
    id: i + 1, 
    bookings: [], 
    image: `assets/images/tables/table_${i + 1}.jpg` 
}));

function checkTableAvailability(context) {
    const date = document.getElementById(context === 'home' ? 'home-booking-date' : 'booking-date').value;
    const time = document.getElementById(context === 'home' ? 'home-booking-time' : 'booking-time').value;
    const slotsDiv = document.getElementById(context === 'home' ? 'home-table-slots' : 'table-slots');
    slotsDiv.innerHTML = tables.map(table => {
        const isBooked = table.bookings.some(booking => booking.date === date && booking.time === time);
        return `
            <div class="table-slot ${isBooked ? 'booked' : 'available'}">
                <img src="${table.image}" alt="Table ${table.id}">
                <p>Table ${table.id} - ${isBooked ? 'Booked' : 'Available'}</p>
                <p>Price: ₹250 for 2 hours</p>
                ${!isBooked ? `<button onclick="selectTable(${table.id}, '${date}', '${time}', '${context}')">Select</button>` : ''}
            </div>
        `;
    }).join('');
}

function selectTable(tableId, date, time, context) {
    document.getElementById(context === 'home' ? 'home-booking-details' : 'booking-details').style.display = 'block';
    window.selectedTable = { tableId, date, time, context };
}

function bookTable(context) {
    if (!currentUser) {
        showScreen('signin');
        return;
    }
    const { tableId, date, time } = window.selectedTable;
    tables[tableId - 1].bookings.push({ date, time });
    displayInvoice(250, 'Table Reservation');
    document.getElementById(context === 'home' ? 'home-booking-details' : 'booking-details').style.display = 'none';
}