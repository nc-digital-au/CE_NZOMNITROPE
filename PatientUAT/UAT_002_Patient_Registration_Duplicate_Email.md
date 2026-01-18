Use Case:
A patient attempts to register with an email address that is already registered in the system.

Test:
Patient registration - duplicate email error

Preconditions/Instructions:

Preconditions:
- Patient registration feature is available in the application
- An existing user account already uses the email address that will be entered
- The patient has a valid product barcode

Instructions:
1. Navigate to the OmniPal landing page.
2. Click the "REGISTER" button.
3. On the Welcome step, enter the last 4 digits of a valid product barcode.
4. Check the confirmation checkbox "I confirm that I have been prescribed Omnitrope (somatropin)."
5. Click "Next" to proceed to Patient Details.
6. Enter patient details, using an email address that is already registered in the system.
7. Click "Next" to attempt to proceed to the next step.

Pass Criteria:
- A validation error message appears indicating the email address cannot be used to register for this program.
- The user is NOT advanced to the Guardian Details step.
- A new patient record is NOT created in the system.
