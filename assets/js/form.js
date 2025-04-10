document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#contact-form');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading indicator
      form.querySelector('.loading').style.display = 'block';
      form.querySelector('.error-message').style.display = 'none';
      form.querySelector('.sent-message').style.display = 'none';
      
      // Get form data
      const formData = {
        name: document.getElementById('name-field').value,
        email: document.getElementById('email-field').value,
        subject: document.getElementById('subject-field').value,
        message: document.getElementById('message-field').value
      };
      
      // Send the data to your backend API
      fetch('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Hide loading indicator
        form.querySelector('.loading').style.display = 'none';
        
        // Show success message
        form.querySelector('.sent-message').style.display = 'block';
        form.reset(); // Clear the form
      })
      .catch(error => {
        // Hide loading and show error
        form.querySelector('.loading').style.display = 'none';
        form.querySelector('.error-message').textContent = 'Failed to send email. Please try again later.';
        form.querySelector('.error-message').style.display = 'block';
        console.error('Error:', error);
      });
    });
  });