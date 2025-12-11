// Quick Booking: transformă butoanele Book now să trimită către booking-en.html cu parametri
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.quick-card').forEach(function(card) {
    var btn = card.querySelector('.book-btn')
    var carTitle = card.querySelector('.car-title').textContent.trim()
    // Normalizează carId: ex: "Audi A6" -> "AudiA6"
    var carId = carTitle.replace(/[^a-zA-Z0-9]/g, '')
    btn.setAttribute('href', 'booking.html?quick=1&carId=' + encodeURIComponent(carId))
  })
})