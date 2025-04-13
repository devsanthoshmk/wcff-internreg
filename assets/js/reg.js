// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
// for newsletter
// Get the newsletter form element
const newsletterForm = document.querySelectorAll('.newsletter');
// Add event listener for form submission
newsletterForm.forEach(form => {
  form.addEventListener('submit', handleNewsletterSubmit);
});


// Function to handle newsletter form submission  
async function handleNewsletterSubmit(event) {
  // Prevent the default form submission  
  event.preventDefault();
  // Get form input values
  const email = event.target.querySelector('input[type="email"]').value.trim();
  // Validate email
  if (!isValidEmail(email)) {
    displayError('#email', 'Please enter a valid email address');
    return;
  }
  // Create data object to send to the API
  const formData = { email: email };
  try {
    // Show loading state
    const submitButton = event.target.querySelector('input[type="submit"]');
    const originalButtonValue = submitButton.value;
    submitButton.value = 'Submitting...';
    submitButton.disabled = true;
    // Send the data to the API
    const response = await fetch('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    // Parse the response
    const result = await response.json();
    // Reset button state
    submitButton.value = originalButtonValue;
    submitButton.disabled = false;
    // Handle the response
    if (response.ok) {
      // Show success message
      showMessage('Subscription successful!', 'success');
      // Reset the form
      event.target.reset();
    } else {
      // Show error message
      showMessage(result.error || 'Subscription failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    showMessage('An error occurred. Please check your connection and try again.', 'error');
    
    // Reset button
    document.querySelector('.button input[type="submit"]').value = originalButtonValue;
    document.querySelector('.button input[type="submit"]').disabled = false;
  }

}

  
  // Get the form element
  const registrationForm = document.querySelector('#reg form');
  
  // Add event listener for form submission
  registrationForm.addEventListener('submit', handleFormSubmit);
  
  // Function to handle form submission
  async function handleFormSubmit(event) {
    // Prevent the default form submission
    event.preventDefault();
    
    // Get form input values
    const name = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobileNumber = document.getElementById('phone').value.trim();
    
    // Get domain selection
    const selectedDomainInput = document.querySelector('input[name="domain"]:checked');
    const domain = selectedDomainInput ? selectedDomainInput.value : '';
    
    // Get available period from the two month dropdowns
    const fromMonth = document.querySelector('input[name="from-month"]:checked').value;
    const toMonth = document.querySelector('input[name="to-month"]:checked').value;
    const availablePeriod = fromMonth && toMonth ? `${fromMonth} to ${toMonth}` : '';
    
    // Set the hidden period field value
    document.getElementById('period').value = availablePeriod;
    
    // Get mode (online/offline)
    const isOnline = document.querySelector('#dot-1').checked;
    const isOffline = document.querySelector('#dot-2').checked;
    const mode = isOnline ? 'online' : (isOffline ? 'offline' : '');
    
    // Validate form data
    if (!validateForm(name, email, mobileNumber, domain, availablePeriod, mode)) {
      return;
    }
    
    // Create data object to send to the API
    const formData = {
      name: name,
      mobile_number: mobileNumber,
      email: email,
      domain: domain,
      available_period: availablePeriod,
      mode: mode
    };
    
    try {
      // Show loading state
      const submitButton = document.querySelector('.button input[type="submit"]');
      const originalButtonValue = submitButton.value;
      submitButton.value = 'Submitting...';
      submitButton.disabled = true;
      
      // Send the data to the API
      const response = await fetch('http://localhost:3000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      // Parse the response
      const result = await response.json();
      
      // Reset button state
      submitButton.value = originalButtonValue;
      submitButton.disabled = false;
      
      // Handle the response
      if (response.ok) {
        // Show success message
        showMessage('Registration successful!', 'success');
        
        // Reset the form
        registrationForm.reset();
        
        // Reset the dropdown text displays
        document.querySelector('label[for="dropdown-toggle"] .selected-text').textContent = 'Select Domain';
        document.querySelector('label[for="from-month-toggle"] .selected-text').textContent = 'From Month';
        document.querySelector('label[for="to-month-toggle"] .selected-text').textContent = 'To Month';
        
        // Hide the registration form after successful submission
        setTimeout(() => {
          hideRegistrationForm();
        }, 2000);
      } else {
        // Show error message
        showMessage(result.error || 'Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showMessage('An error occurred. Please check your connection and try again.', 'error');
      
      // Reset button
      document.querySelector('.button input[type="submit"]').value = originalButtonValue;
      document.querySelector('.button input[type="submit"]').disabled = false;
    }
  }
  
  // Form validation function
  function validateForm(name, email, mobileNumber, domain, availablePeriod, mode) {
    // Reset any previous error messages
    clearErrorMessages();
    
    let isValid = true;
    
    // Validate name
    if (!name) {
      displayError('#fullname', 'Name is required');
      isValid = false;
    }
    
    // Validate email
    if (!email) {
      displayError('#email', 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      displayError('#email', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate mobile number
    if (!mobileNumber) {
      displayError('#phone', 'Phone number is required');
      isValid = false;
    } else if (!isValidPhoneNumber(mobileNumber)) {
      displayError('#phone', 'Please enter a valid phone number');
      isValid = false;
    }
    
    // Validate domain
    if (domain === '' || domain === 'none') {
      displayError('.select', 'Please select a domain');
      isValid = false;
    }
    
    // Validate available period (both from and to months should be selected)
    const fromMonth = document.querySelector('input[name="from-month"]:checked').value;
    const toMonth = document.querySelector('input[name="to-month"]:checked').value;
    
    if (!fromMonth) {
      displayError('.from-month .select', 'Please select a starting month');
      isValid = false;
    }
    
    if (!toMonth) {
      displayError('.to-month .select', 'Please select an ending month');
      isValid = false;
    }
    
    // Check if "to month" comes after "from month"
    if (fromMonth && toMonth) {
      const months = [
        'January 2025', 'February 2025', 'March 2025', 'April 2025', 
        'May 2025', 'June 2025', 'July 2025', 'August 2025', 
        'September 2025', 'October 2025', 'November 2025', 'December 2025'
      ];
      
      const fromIndex = months.indexOf(fromMonth);
      const toIndex = months.indexOf(toMonth);
      
      if (fromIndex > toIndex) {
        displayError('.to-month .select', 'End month must be after start month');
        isValid = false;
      }
    }
    
    // Validate mode
    if (!mode) {
      displayError('.gender-details', 'Please select online or offline mode');
      isValid = false;
    }
    
    return isValid;
  }
  
  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Phone number validation function
  function isValidPhoneNumber(phone) {
    // Basic validation - adjust as needed for your requirements
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone.replace(/[-()\s]/g, ''));
  }
  
  // Function to display error messages
  function displayError(selector, message) {
    const inputElement = document.querySelector(selector);
    
    // Check if there's an existing error message for this element
    const existingError = inputElement.parentNode.querySelector('.error-message');
    
    if (existingError) {
      // Update existing error message
      existingError.textContent = message;
    } else {
      // Create new error message
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.style.color = 'red';
      errorElement.style.fontSize = '12px';
      errorElement.style.marginTop = '5px';
      errorElement.textContent = message;
      
      // Insert error message after the input element
      inputElement.parentNode.appendChild(errorElement);
    }
    
    // Highlight the input field
    inputElement.style.borderColor = 'red';
  }
  
  // Function to clear all error messages
  function clearErrorMessages() {
    // Remove all error message elements
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(element => element.remove());
    
    // Reset input field styling
    const inputFields = document.querySelectorAll('input, .select');
    inputFields.forEach(field => field.style.borderColor = '');
  }
  
  // Function to show success/error message to user
  function showMessage(message, type) {
    // Check if a message container already exists
    let messageContainer = document.querySelector('.message-container');
    
    // If not, create one
    if (!messageContainer) {
      messageContainer = document.createElement('div');
      messageContainer.className = 'message-container';
      messageContainer.style.position = 'fixed';
      messageContainer.style.top = '20px';
      messageContainer.style.right = '20px';
      messageContainer.style.padding = '15px 20px';
      messageContainer.style.borderRadius = '5px';
      messageContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      messageContainer.style.zIndex = '1000';
      messageContainer.style.minWidth = '250px';
      messageContainer.style.textAlign = 'center';
      messageContainer.style.zIndex = "1100";
      document.body.appendChild(messageContainer);
    }
    
    // Set appropriate styling based on message type
    if (type === 'success') {
      messageContainer.style.backgroundColor = '#4CAF50';
      messageContainer.style.color = 'white';
    } else if (type === 'error') {
      messageContainer.style.backgroundColor = '#f44336';
      messageContainer.style.color = 'white';
    }
    
    // Set the message text
    messageContainer.textContent = message;
    
    // Make the message visible
    messageContainer.style.display = 'block';
    
    // Hide the message after 5 seconds
    setTimeout(() => {
      messageContainer.style.display = 'none';
    }, 5000);
  }
  
  // Handle domain dropdown functionality
  const options = document.querySelectorAll('.options input[name="domain"]');
  options.forEach(option => {
    option.addEventListener('change', function() {
      const selectedText = this.nextElementSibling.getAttribute('data-txt');
      document.querySelector('label[for="dropdown-toggle"] .selected-text').textContent = selectedText;
      
      // Clear any existing error messages for the domain selector
      const errorMsg = document.querySelector('.select').parentNode.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.remove();
      }
      document.querySelector('.select').style.borderColor = '';
    });
  });

  // Handle "From Month" dropdown functionality
  const fromMonthOptions = document.querySelectorAll('.options input[name="from-month"]');
  fromMonthOptions.forEach(option => {
    option.addEventListener('change', function() {
      const selectedText = this.nextElementSibling.getAttribute('data-txt');
      document.querySelector('label[for="from-month-toggle"] .selected-text').textContent = selectedText;
      
      // Clear any existing error messages
      const errorMsg = document.querySelector('.from-month .select').parentNode.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.remove();
      }
      document.querySelector('.from-month .select').style.borderColor = '';
    });
  });

  // Handle "To Month" dropdown functionality
  const toMonthOptions = document.querySelectorAll('.options input[name="to-month"]');
  toMonthOptions.forEach(option => {
    option.addEventListener('change', function() {
      const selectedText = this.nextElementSibling.getAttribute('data-txt');
      document.querySelector('label[for="to-month-toggle"] .selected-text').textContent = selectedText;
      
      // Clear any existing error messages
      const errorMsg = document.querySelector('.to-month .select').parentNode.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.remove();
      }
      document.querySelector('.to-month .select').style.borderColor = '';
    });
  });
});

// Function to hide the registration form
function hideRegistrationForm() {
  const reg = document.getElementById('reg');
  reg.classList.remove("visible");
  reg.parentElement.classList.remove("blurblackbg");
  document.documentElement.classList.remove("overflow-hidden");
  document.getElementById('about').scrollIntoView();
}