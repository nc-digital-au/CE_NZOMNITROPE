Use Case:
A patient attempts to submit an order without selecting any products.

Test:
Patient order - no product selected validation

Preconditions/Instructions:

Preconditions:
- The patient is logged in to the OmniPal portal
- The patient is on the Order Form step

Instructions:
1. From the Home dashboard, click "Order SurePal® Device and Consumables".
2. Complete the Patient Details step and click "Next".
3. On the Order Form step, do not select any Needle Kit or Pen Replacement option.
4. Click "Submit" to attempt to place the order.

Pass Criteria:
- A validation error message appears: "Please select one option."
- The order is NOT submitted.
- The user remains on the Order Form step.
