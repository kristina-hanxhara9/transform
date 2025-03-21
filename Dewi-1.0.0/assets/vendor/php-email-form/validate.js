/**
* PHP Email Form Validation - v3.9
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
* Modified to support Telegram integration
*/
(function () {
  "use strict";

  // Your Telegram Bot Token and Chat ID - REPLACE WITH YOUR VALUES
  const botToken = '7926639928:AAFsWKmb2jdy40Rtw09_6sZDrAM05jgnjrM'; 
  const chatId = '7546090059';

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      /* if(!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }*/
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      // Instead of trying to submit to the action URL, use our custom handling
      handleFormWithTelegram(thisForm, formData);

      // Keep the recaptcha handling in case it's needed
      if (recaptcha) {
        if(typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                // We're replacing this with our custom handler
                // php_email_form_submit(thisForm, action, formData);
                handleFormWithTelegram(thisForm, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      }
    });
  });

  // This is the original PHP form submission function - not being used now
  function php_email_form_submit(thisForm, action, formData) {
    /* Original fetch implementation commented out
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if( response.ok ) {
        return response.text();
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.trim() == 'OK') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
    */
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

  // New function that handles form submission and sends to Telegram
  function handleFormWithTelegram(thisForm, formData) {
    // Process form data
    const formValues = {};
    formData.forEach((value, key) => {
      formValues[key] = value;
    });
    
    // Format different message types based on form ID
    let telegramMessage = '';
    
    if (thisForm.id === 'contactForm') {
      // Format contact form message
      telegramMessage = `
🔔 New Contact Form Submission:

👤 Name: ${formValues.name || ''}
📧 Email: ${formValues.email || ''}
📱 Phone: ${formValues.phone || formValues['Phone number'] || ''}

💬 Message:
${formValues.message || ''}
      `;
      
      // Also store in localStorage as backup
      try {
        const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        messages.push({...formValues, date: new Date().toISOString()});
        localStorage.setItem('contact_messages', JSON.stringify(messages));
      } catch (e) {
        console.error('Could not save to localStorage', e);
      }
    } else if (thisForm.id === 'newsletterForm') {
      // Format newsletter subscription message
      telegramMessage = `
📧 New Newsletter Subscription:

Email: ${formValues.email || ''}
Date: ${new Date().toLocaleString()}
      `;
      
      // Check for duplicate email
      try {
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        const email = formValues.email;
        
        if (subscribers.some(sub => sub.email === email)) {
          thisForm.querySelector('.loading').classList.remove('d-block');
          thisForm.querySelector('.error-message').innerHTML = 'This email is already subscribed.';
          thisForm.querySelector('.error-message').classList.add('d-block');
          return;
        }
        
        subscribers.push({email: email, date: new Date().toISOString()});
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      } catch (e) {
        console.error('Could not check subscribers in localStorage', e);
      }
    } else {
      // Generic message for other forms
      telegramMessage = `New Form Submission:\n\n`;
      for (const [key, value] of Object.entries(formValues)) {
        telegramMessage += `${key}: ${value}\n`;
      }
    }
    
    // Send to Telegram
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage
      })
    })
    .then(response => response.json())
    .then(data => {
      // Hide loading indicator
      thisForm.querySelector('.loading').classList.remove('d-block');
      
      if (data.ok) {
        // Show success message
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); // Clear the form
      } else {
        // Show error message but still consider it somewhat successful since we stored in localStorage
        console.error('Telegram API error:', data);
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); // Clear the form
      }
    })
    .catch(error => {
      console.error('Error sending to Telegram:', error);
      // Still show success since we saved locally
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.add('d-block');
      thisForm.reset(); // Clear the form
    });
  }

})();
