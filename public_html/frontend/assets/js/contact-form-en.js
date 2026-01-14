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
    if (!gdpr || !gdpr.checked) {
      valid = false
      messages.push('You must accept the privacy policy to submit the form.')
    }
    if (!valid) {
      e.preventDefault()
      errorBox.innerHTML = messages.join('<br>')
      errorBox.style.display = 'block'
    } else {
      e.preventDefault()
      errorBox.style.display = 'none'
      // Submit form via AJAX
      submitContactForm(form, errorBox)
    }
  })

  // reCAPTCHA site key
  var RECAPTCHA_SITE_KEY = '6LfQIEosAAAAADOI8cbCjqCX6HIHEsnP_qukVSx9'

  // Function to submit form via AJAX
  async function submitContactForm(form, errorBox) {
    var submitBtn = form.querySelector('button[type="submit"]')
    var originalBtnText = submitBtn.textContent

    try {
      // Disable button and change text
      submitBtn.disabled = true
      submitBtn.textContent = 'Sending...'

      // Get reCAPTCHA token
      var recaptchaToken = null
      if (typeof grecaptcha !== 'undefined') {
        try {
          if (typeof grecaptcha.ready === 'function') {
            await new Promise(function (resolve) { grecaptcha.ready(resolve) })
          }
          recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'contact_form'})
        } catch (recaptchaError) {
          console.warn('reCAPTCHA error:', recaptchaError)
        }
      }
      if (!recaptchaToken) {
        throw new Error('reCAPTCHA validation failed. Please reload the page.')
      }

      // Collect form data
      var formData = {
        name: form.querySelector('#first-name').value.trim() + ' ' + form.querySelector('#last-name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        phone: form.querySelector('#phone').value.trim(),
        subject: form.querySelector('#subject') ? form.querySelector('#subject').value.trim() : '',
        message: form.querySelector('#notes').value.trim(),
        recaptcha_token: recaptchaToken,
        language: 'en'
      }

      // Send data to API
      console.log('📧 Sending contact message...', formData)
      var response = await fetch('/api/public/contact.php', {
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
        // Display success message
        console.log('✅ Email sent successfully!')
        errorBox.style.color = '#28a745'
        errorBox.innerHTML = result.message
        errorBox.style.display = 'block'
        // Reset form
        form.reset()
        // Hide message after 5 seconds
        setTimeout(function() {
          errorBox.style.display = 'none'
          errorBox.style.color = '#ff4500'
        }, 5000)
      } else {
        throw new Error(result.message || 'Error sending message')
      }

    } catch (error) {
      console.error('❌ Error sending email:', error)
      errorBox.style.color = '#ff4500'
      errorBox.innerHTML = 'Error: ' + error.message + '. Please try again.'
      errorBox.style.display = 'block'
    } finally {
      // Re-enable button and restore text
      submitBtn.disabled = false
      submitBtn.textContent = originalBtnText
    }
  }

  // Remove error highlight on input
  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      el.classList.remove('input-error')
    })
  })
}) 


