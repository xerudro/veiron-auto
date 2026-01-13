document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('.contact-form')
  if (!form) return

  var errorBox = document.createElement('div')
  errorBox.className = 'form-error-box'
  errorBox.style.display = 'none'
  errorBox.style.color = '#ff4500'
  errorBox.style.fontWeight = '600'
  errorBox.style.marginBottom = '0.7rem'
  form.insertBefore(errorBox, form.firstChild)

  form.addEventListener('submit', function (e) {
    var valid = true
    var fields = [
      { id: 'nume', label: 'Nume' },
      { id: 'prenume', label: 'Prenume' },
      { id: 'telefon', label: 'Telefon' },
      { id: 'email', label: 'Email' }
    ]
    var messages = []
    fields.forEach(function (f) {
      var input = form.querySelector('#' + f.id)
      if (!input || !input.value.trim()) {
        valid = false
        input.classList.add('input-error')
        messages.push('Câmpul "' + f.label + '" este obligatoriu.')
      }
    })
    // Validare suplimentară pentru telefon
    var telefon = form.querySelector('#telefon')
    if (telefon && telefon.value.trim()) {
      var telVal = telefon.value.trim()
      var telValid = /^\+\d{6,}/.test(telVal.replace(/\s+/g, '')) && telVal.replace(/\D/g, '').length >= 10
      if (!telValid) {
        valid = false
        telefon.classList.add('input-error')
        messages.push('Numărul de telefon trebuie să conțină codul țării (ex: +40) și să fie complet.')
      }
    }
    // Validare suplimentară pentru email
    var email = form.querySelector('#email')
    if (email && email.value.trim()) {
      var emailVal = email.value.trim()
      var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)
      if (!emailValid) {
        valid = false
        email.classList.add('input-error')
        messages.push('Adresa de email nu este validă.')
      }
    }
    var gdpr = form.querySelector('#gdpr')
    if (!gdpr.checked) {
      valid = false
      messages.push('Trebuie să accepți politica de confidențialitate pentru a trimite formularul.')
    }
    var notRobot = form.querySelector('#not-robot')
    if (!notRobot.checked) {
      valid = false
      messages.push('Te rugăm să confirmi că nu ești robot.')
    }
    if (!valid) {
      e.preventDefault()
      errorBox.innerHTML = messages.join('<br>')
      errorBox.style.display = 'block'
    } else {
      e.preventDefault()
      errorBox.style.display = 'none'
      // Trimite formularul prin AJAX
      submitContactForm(form, errorBox)
    }
  })

  // Funcție pentru trimiterea formularului prin AJAX
  async function submitContactForm(form, errorBox) {
    var submitBtn = form.querySelector('button[type="submit"]')
    var originalBtnText = submitBtn.textContent

    try {
      // Dezactivează butonul și schimbă textul
      submitBtn.disabled = true
      submitBtn.textContent = 'Se trimite...'

      // Colectează datele din formular
      var formData = {
        name: form.querySelector('#nume').value.trim() + ' ' + form.querySelector('#prenume').value.trim(),
        email: form.querySelector('#email').value.trim(),
        phone: form.querySelector('#telefon').value.trim(),
        subject: form.querySelector('#subiect') ? form.querySelector('#subiect').value.trim() : '',
        message: form.querySelector('#observatii').value.trim()
      }

      // Trimite datele către API
      console.log('📧 Sending contact message...', formData)
      var response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
      })

      console.log('📧 Response status:', response.status, response.statusText)
      var result = await response.json()
      console.log('📧 Response data:', result)

      if (result.success) {
        // Afișează mesaj de succes
        console.log('✅ Email sent successfully!')
        errorBox.style.color = '#28a745'
        errorBox.innerHTML = result.message
        errorBox.style.display = 'block'
        // Resetează formularul
        form.reset()
        // Ascunde mesajul după 5 secunde
        setTimeout(function() {
          errorBox.style.display = 'none'
          errorBox.style.color = '#ff4500'
        }, 5000)
      } else {
        throw new Error(result.message || 'Eroare la trimiterea mesajului')
      }

    } catch (error) {
      console.error('❌ Error sending email:', error)
      errorBox.style.color = '#ff4500'
      errorBox.innerHTML = 'Eroare: ' + error.message + '. Vă rugăm să încercați din nou.'
      errorBox.style.display = 'block'
    } finally {
      // Reactivează butonul și restaurează textul
      submitBtn.disabled = false
      submitBtn.textContent = originalBtnText
    }
  }

  // Elimină highlight-ul roșu la corectare
  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      el.classList.remove('input-error')
    })
  })
}) 