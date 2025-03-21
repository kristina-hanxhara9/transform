<?php
// Define variables to store form data
$name = $email = $phone = $message = "";
$errorMessage = "";
$successMessage = "Your message has been sent. Thank you!";

// Process the form only if the request is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Sanitize and validate inputs
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    // Changed key from 'Phone number' to 'phone' for consistency
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errorMessage = "Invalid email format";
        echo json_encode(['error' => $errorMessage]);
        exit;
    }

    // Validate required fields
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        $errorMessage = "All fields are required";
        echo json_encode(['error' => $errorMessage]);
        exit;
    }

    // Set email recipient (update to your email)
    $to = "your-email@example.com";
    
    // Set email subject
    $subject = "New Contact Form Submission";
    
    // Create email content
    $email_content  = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n\n";
    $email_content .= "Message:\n$message\n";
    
    // Set email headers
    $headers = "From: $name <$email>\r\n";
    
    // Attempt to send the email
    if (mail($to, $subject, $email_content, $headers)) {
        echo json_encode(['success' => $successMessage]);
    } else {
        $errorMessage = "Oops! Something went wrong and we couldn't send your message.";
        echo json_encode(['error' => $errorMessage]);
    }
} else {
    // Not a POST request
    $errorMessage = "There was a problem with your submission, please try again.";
    echo json_encode(['error' => $errorMessage]);
}
?>
