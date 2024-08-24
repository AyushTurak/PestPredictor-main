// Initialize EmailJS
emailjs.init("Jk8EBqyVSIWl9-OTh"); // Replace with your EmailJS User ID

// Function to send email
function sendEmail(e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const fromName = "adarsh"; // Replace with the actual sender's name or retrieve from a form field
    const message = "This is a test message";
    // Define the email parameters
    const templateParams = {
        to_name: email,
        from_name: fromName,
        message: message
        // other parameters as needed
    };
    
    // Send the email
    emailjs.send('service_f8tiz4a', 'template_zg6gpyr', templateParams)
        .then(response => {
            document.getElementById('message').textContent = 'Email sent successfully!';
        })
        .catch(error => {
            document.getElementById('message').textContent = 'Failed to send email.';
            console.error('Error:', error);
        });
}

// Attach the function to the form submission
document.getElementById('email-form').addEventListener('submit', sendEmail);