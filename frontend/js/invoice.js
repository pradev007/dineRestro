function displayInvoice(amount, type) {
    const invoiceDiv = document.getElementById('invoice-content');
    invoiceDiv.innerHTML = `
        <h3>${type} Invoice</h3>
        <p>Username: ${currentUser.username}</p>
        ${type === 'Order' ? `<p>Items: ${cart.map(item => item.name).join(', ')}</p>` : `<p>Table: ${window.selectedTable.tableId}</p><p>Date: ${window.selectedTable.date}</p><p>Time: ${window.selectedTable.time}</p>`}
        <p>Total: ₹${amount}</p>
    `;
    showScreen('invoice');
}