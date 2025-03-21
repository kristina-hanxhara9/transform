<?php
/**
 * Requires the "PHP Email Form" library.
 * The library should be uploaded to: vendor/php-email-form/php-email-form.php
 * More info: https://bootstrapmade.com/php-email-form/
 */

// Replace with your real receiving email address
$receiving_email_address = 'contact@example.com';

// Check if the library file exists and include it
$library_path = '../assets/vendor/php-email-form/php-email-form.php';
if (file_exists($library_path)) {
    include($library_path);
} else {
    die('Unable to load the "PHP Email Form" Library!');
}

// Process only if the request is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Instantiate the email form object
    $contact = new PHP_Email_Form;
    $contact->ajax = true;
    
    $contact->to = $receiving_email_address;
    
    // Assuming the form only collects an email for subscription
    $submittedEmail = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    
    // Validate email input
    if (!filter_var($submittedEmail, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['error' => 'Invalid email format']);
        exit;
    }
    
    // Set sender details; adjust if you collect more info
    $contact->from_name = $submittedEmail;
    $contact->from_email = $submittedEmail;
    $contact->subject = "New Subscription: " . $submittedEmail;

    // Add the message content (in this case, just the email)
    $contact->add_message($submittedEmail, 'Email');

    // Uncomment and set your SMTP details if needed
    /*
    $contact->smtp = array(
      'host' => 'example.com',
      'username' => 'example',
      'password' => 'pass',
      'port' => '587'
    );
    */

    echo $contact->send();
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
