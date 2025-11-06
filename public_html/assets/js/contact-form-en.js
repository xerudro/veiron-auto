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
      { id: 'first-name', label: 'First Name' },
      { id: 'last-name', label: 'Last Name' },
      { id: 'phone', label: 'Phone' },
      { id: 'email', label: 'Email' }
    ]
    var messages = []
    fields.forEach(function (f) {
      var input = form.querySelector('#' + f.id)
      if (!input || !input.value.trim()) {
        valid = false
        input.classList.add('input-error')
        messages.push('Field "' + f.label + '" is required.')
      }
    })
    // Phone validation
    var phone = form.querySelector('#phone')
    if (phone && phone.value.trim()) {
      var phoneVal = phone.value.trim()
      var phoneValid = /^\+\d{6,}/.test(phoneVal.replace(/\s+/g, '')) && phoneVal.replace(/\D/g, '').length >= 10
      if (!phoneValid) {
        valid = false
        phone.classList.add('input-error')
        messages.push('Phone number must include the country code (e.g. +40) and be complete.')
      }
    }
    // Email validation
    var email = form.querySelector('#email')
    if (email && email.value.trim()) {
      var emailVal = email.value.trim()
      var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)
      if (!emailValid) {
        valid = false
        email.classList.add('input-error')
        messages.push('Email address is not valid.')
      }
    }
    var gdpr = form.querySelector('#gdpr')
    if (!gdpr.checked) {
      valid = false
      messages.push('You must accept the privacy policy to submit the form.')
    }
    var notRobot = form.querySelector('#not-robot')
    if (!notRobot.checked) {
      valid = false
      messages.push('Please confirm you are not a robot.')
    }
    if (!valid) {
      e.preventDefault()
      errorBox.innerHTML = messages.join('<br>')
      errorBox.style.display = 'block'
    } else {
      errorBox.style.display = 'none'
    }
  })

  // Remove error highlight on input
  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      el.classList.remove('input-error')
    })
  })
}) 