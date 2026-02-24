Use Case:
A patient attempts to register with an invalid product barcode.

Test:
Patient registration - invalid barcode error

Preconditions/Instructions:

Preconditions:
- Patient registration feature is available in the application

Instructions:
1. Navigate to the OmniPal landing page.
2. Click the "REGISTER" button.
3. On the Welcome step, enter an invalid 4-digit barcode (e.g., "0000" or "9999").
4. Check the confirmation checkbox "I confirm that I have been prescribed Omnitrope (somatropin)."
5. Click "Next" to attempt to proceed.

Pass Criteria:
- An "Invalid barcode" error message is displayed.
- The user is NOT advanced to the Patient Details step.
- A patient record is NOT created in the system.
