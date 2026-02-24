Use Case:
A patient changes the delivery address type between business and private address during order placement.

Test:
Patient order - change delivery address type

Preconditions/Instructions:

Preconditions:
- The patient is logged in to the OmniPal portal
- The patient has started an order

Instructions:
1. From the Home dashboard, click "Order SurePal® Device and Consumables".
2. On the Patient Details step, note the current Delivery Address Type selection.
3. Change the selection from "Place of business" to "Private address" (or vice versa).
4. Observe the address form fields update.
5. Enter the appropriate address details.
6. Complete the order process.

Pass Criteria:
- When "Place of business" is selected, a business name field is displayed.
- When "Private address" is selected, the business name field is hidden or disabled.
- The address form refreshes when the address type is changed.
- Previously entered address details for the patient are pre-populated based on the selected type.
