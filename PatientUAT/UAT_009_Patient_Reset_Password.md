Use Case:
A patient resets their password using the reset link received via email.

Test:
Patient reset password - successful password reset

Preconditions/Instructions:

Preconditions:
- The patient has requested a password reset link
- The patient has access to the password reset email
- The reset link has not expired

Instructions:
1. Open the password reset email.
2. Click the password reset link in the email.
3. On the reset password page, enter a new password.
4. Confirm the new password.
5. Click "Submit" to reset the password.

Pass Criteria:
- A success message appears: "Your password reset attempt was successful."
- The patient can log in using the new password.
- The old password no longer works for login.
