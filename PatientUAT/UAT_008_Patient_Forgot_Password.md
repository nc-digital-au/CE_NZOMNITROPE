Use Case:
A patient requests a password reset link because they have forgotten their password.

Test:
Patient forgot password - request reset link

Preconditions/Instructions:

Preconditions:
- The patient has a registered account
- The patient has access to their registered email address

Instructions:
1. Navigate to the OmniPal landing page.
2. Click the "Click here" link under "Forgot your password?"
3. Enter the registered email address in the form.
4. Click "Submit" to request the reset link.

Pass Criteria:
- A success message appears: "Your request to reset your password was processed. Please check your email inbox for the reset password link."
- A password reset email is sent to the registered email address.
- The "Back to login" button is displayed.
