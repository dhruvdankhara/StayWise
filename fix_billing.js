const fs = require('fs');
const fn = 'd:/StayWise/hotel-management-ui/src/app/panels/receptionist/receptionist-billing-page.component.ts';
let c = fs.readFileSync(fn, 'utf8');

c = c.replace(/<span\s+class=\"w-2 h-2 rounded-full bg-emerald-500\"><\/span>\s*Billing Desk\s*<\/p>\s*<h1.*?<\/h1>\s*<p.*?>.*?<\/p>\s*<\/section>\s*<div.*?>.*?<\/div>\s*<form.*?>.*?<\/div>\s*@if \(invoice\(\); as invoice\) \{.*?<\/div>\s*<div.*?>.*?<\/div>\s*<div.*?>.*?<\/span>\s*@if.*?\{/s, '');

