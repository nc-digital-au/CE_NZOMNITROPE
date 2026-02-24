Use Case:
A patient attempts to schedule an injection training session for a past date.

Test:
Patient schedule training - past date validation

Preconditions/Instructions:

Preconditions:
- The patient is logged in to the OmniPal portal

Instructions:
1. From the Home dashboard, click "Schedule an Injection Training Session".
2. Verify pre-populated patient details.
3. In the Session Booking section, attempt to select a date in the past.
4. Click "Submit Training Request".

Pass Criteria:
- Past dates are not selectable in the date picker (dates before today are disabled).
- If somehow a past date is entered, a validation error is displayed.
- The training request is NOT submitted.
