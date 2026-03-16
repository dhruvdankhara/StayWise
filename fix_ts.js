const fs = require('fs');
const fn = 'd:/StayWise/hotel-management-ui/src/app/panels/receptionist/receptionist-billing-page.component.ts';
let c = fs.readFileSync(fn, 'utf8');
c = c.replace(/paymentForm\.value\.amount <= 0/g, '(paymentForm.value.amount || 0) <= 0');
fs.writeFileSync(fn, c);
