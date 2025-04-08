const reg=document.getElementById("reg");
function toggleReg(event=null){
    if (event && event.target !== event.currentTarget) return;
    
    window.scrollTo(0,0);
    reg.classList.toggle("visible")
    reg.parentElement.classList.toggle("blurblackbg");
    document.documentElement.classList.toggle("overflow-hidden")
    if (reg.classList.contains('visible')) {
        history.pushState({},"","?internReg=true")
    } else {
        history.pushState({},"","/")
        document.getElementById('about').scrollIntoView();

    }

}


function getEvent(){
    const params = new URLSearchParams(window.location.search);
      const value = params.get('internReg');
      console.log(value);
      const isCurrentlyVisible = reg.classList.contains('visible');
       if (value === "true" && !isCurrentlyVisible) {
        reg.classList.add("visible");
        reg.parentElement.classList.add("blurblackbg");
        document.documentElement.classList.add("overflow-hidden");
    } else if (value !== "true" && isCurrentlyVisible) {
        reg.classList.remove("visible");
        reg.parentElement.classList.remove("blurblackbg");
        document.documentElement.classList.remove("overflow-hidden");
    }
  }
  window.addEventListener('load', getEvent)
  window.addEventListener("popstate",getEvent)




//   backend connect code

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const registrationForm = document.querySelector('#reg form');
    
    // Add event listener for form submission
    registrationForm.addEventListener('submit', handleFormSubmit);
    
    // Function to handle form submission
    async function handleFormSubmit(event) {
      // Prevent the default form submission
      event.preventDefault();
      
      // Get form input values
      const name = document.querySelector('input[placeholder="Enter your name"]').value.trim();
      const email = document.querySelector('input[placeholder="Enter your email"]').value.trim();
      const mobileNumber = document.querySelector('input[placeholder="Enter your number"]').value.trim();
      
      // Get domain selection
      const domainLabel = document.querySelector('label.selected');
      const selectedDomainInput = document.querySelector('input[name="option"]:checked');
      const domainOption = selectedDomainInput ? selectedDomainInput.id : 'all';
      
      // Map domain option to actual value
      let domain = "Select Domain"; // Default
      if (domainOption === 'option-1') {
        domain = "AI";
      } else if (domainOption === 'option-2') {
        domain = "Data Science";
      } else if (domainOption === 'option-3') {
        domain = "Web Development";
      } else if (domainOption === 'option-4') {
        domain = "Cybersecurity";
      } else if (domainOption === 'option-5') {
        domain = "Editing";
      } else if (domainOption === 'option-6') {
        domain = "Cinematography";
      } else if (domainOption === 'option-7') {
        domain = "Filmmaking";
      } else if (domainOption === 'option-8') {
        domain = "Content Creation";
      }
      
      // Get available period
      const availablePeriod = document.querySelector('input[placeholder="Enter Available Period"]').value.trim();
      
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
          document.querySelector('label.selected').textContent = 'Select Domain';
          
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
        displayError('input[placeholder="Enter your name"]', 'Name is required');
        isValid = false;
      }
      
      // Validate email
      if (!email) {
        displayError('input[placeholder="Enter your email"]', 'Email is required');
        isValid = false;
      } else if (!isValidEmail(email)) {
        displayError('input[placeholder="Enter your email"]', 'Please enter a valid email address');
        isValid = false;
      }
      
      // Validate mobile number
      if (!mobileNumber) {
        displayError('input[placeholder="Enter your number"]', 'Phone number is required');
        isValid = false;
      } else if (!isValidPhoneNumber(mobileNumber)) {
        displayError('input[placeholder="Enter your number"]', 'Please enter a valid phone number');
        isValid = false;
      }
      
      // Validate domain
      if (domain === 'Select Domain') {
        displayError('.select', 'Please select a domain');
        isValid = false;
      }
      
      // Validate available period
      if (!availablePeriod) {
        displayError('input[placeholder="Enter Available Period"]', 'Available period is required');
        isValid = false;
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
    
    // Handle dropdown functionality - Updated for your new HTML structure
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const selectedLabel = document.querySelector('label.selected');
    const options = document.querySelectorAll('.options input[type="radio"]');
    
    // When an option is selected
    options.forEach(option => {
      option.addEventListener('change', function() {
        const optionLabel = this.nextElementSibling;
        const optionText = optionLabel.getAttribute('data-txt');
        
        // Update the selected label text based on which option was selected
        if (this.id === 'all') {
          selectedLabel.textContent = selectedLabel.getAttribute('data-default');
        } else if (this.id === 'option-1') {
          selectedLabel.textContent = selectedLabel.getAttribute('data-one');
        } else if (this.id === 'option-2') {
          selectedLabel.textContent = selectedLabel.getAttribute('data-two');
        } else if (this.id === 'option-3') {
          selectedLabel.textContent = selectedLabel.getAttribute('data-three');
        } else if (this.id === 'option-4') {
          selectedLabel.textContent = selectedLabel.getAttribute('data-four');
        } else if (this.id === 'option-5') {
          selectedLabel.textContent = selectedLabel.getAttribute('data-five');
        } else if (this.id === 'option-6') {
          selectedLabel.textContent = selectedLabel.getAttribute('data-six');
        } else if (this.id === 'option-7') {
          selectedLabel.textContent = selectedLabel.getAttribute('data-seven');
        } else if (this.id === 'option-8') {
          selectedLabel.textContent = selectedLabel.getAttribute('data-eight');
        }
        
        // Clear any existing error messages for the domain selector
        const errorMsg = document.querySelector('.select').parentNode.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.remove();
        }
        document.querySelector('.select').style.borderColor = '';
      });
    });
  });
  
  // Function to handle the toggleReg event
  
  // Function to hide the registration form
  function hideRegistrationForm() {
    reg.classList.remove("visible");
    reg.parentElement.classList.remove("blurblackbg");
    document.documentElement.classList.remove("overflow-hidden");
    document.getElementById('about').scrollIntoView();
  }
  

