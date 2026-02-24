Use Case:
A patient schedules an injection training session with a program administrator.

Test:
Patient schedule injection training - successful request

Preconditions/Instructions:

Preconditions:
- The patient is logged in to the OmniPal portal
- The patient has received their SurePal device

Instructions:
1. From the Home dashboard, click "Schedule an Injection Training Session".
2. Verify pre-populated patient details (first name, last name, NHI number, email, mobile).
3. Verify or enter guardian details if applicable.
4. In the Session Booking section, select a future date for the session.
5. Select a time for the session (at least 1 hour from now if today's date is selected).
6. Click "Submit Training Request".

Pass Criteria:
- A success message appears: "Thank you, your injection training request has been submitted."
- The message indicates the Program Administrator will contact the patient to confirm date and time.
- Contact number for queries (0800 666 487) is displayed.
- The training request is recorded in the system.
