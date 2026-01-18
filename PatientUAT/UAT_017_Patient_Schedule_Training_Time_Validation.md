Use Case:
A patient attempts to schedule an injection training session for today but with a time less than 1 hour from now.

Test:
Patient schedule training - time validation for today

Preconditions/Instructions:

Preconditions:
- The patient is logged in to the OmniPal portal
- Current time is at least 1 hour before midnight

Instructions:
1. From the Home dashboard, click "Schedule an Injection Training Session".
2. Verify pre-populated patient details.
3. In the Session Booking section, select today's date.
4. Select a time that is less than 1 hour from the current time.
5. Click "Submit Training Request".

Pass Criteria:
- A validation error is displayed indicating the session time must be at least 1 hour from now.
- The training request is NOT submitted.
- The user can correct the time and resubmit.
