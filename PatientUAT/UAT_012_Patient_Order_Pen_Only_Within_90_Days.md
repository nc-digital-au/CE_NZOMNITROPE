Use Case:
A patient orders a pen replacement when their last order was placed within the last 90 days.

Test:
Patient order pen only - within 90 days of last order

Preconditions/Instructions:

Preconditions:
- The patient is logged in to the OmniPal portal
- The patient has placed an order within the last 90 days

Instructions:
1. From the Home dashboard, click "Order SurePal® Device and Consumables".
2. On the Patient Details step, verify pre-populated patient information.
3. Enter or verify the delivery address.
4. Click "Next" to proceed to Order Form.
5. Observe that only Pen Replacement options are available (Needle Kit options are not shown).
6. Select a Pen Replacement option (5mg, 10mg, or 15mg Pen).
7. Click "Submit" to place the order.

Pass Criteria:
- Only Pen Replacement options are displayed on the Order Form step.
- Needle Kit options are NOT displayed.
- A success message appears confirming the order has been placed.
- The order is recorded in the system with only the pen replacement.
