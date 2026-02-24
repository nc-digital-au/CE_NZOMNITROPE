Use Case:
A patient attempts to proceed with registration without confirming they have been prescribed Omnitrope.

Test:
Patient registration - consent checkbox validation

Preconditions/Instructions:

Preconditions:
- Patient registration feature is available in the application

Instructions:
1. Navigate to the OmniPal landing page.
2. Click the "REGISTER" button.
3. On the Welcome step, enter the last 4 digits of a valid product barcode.
4. Leave the confirmation checkbox unchecked.
5. Click "Next" to attempt to proceed.

Pass Criteria:
- A validation error message appears: "Please confirm to proceed."
- The user is NOT advanced to the Patient Details step.
- A patient record is NOT created in the system.
