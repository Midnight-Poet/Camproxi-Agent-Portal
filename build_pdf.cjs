const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('Camproxi_Agent_Portal_Features.pdf'));

doc.fontSize(24).text('Camproxi Agent Portal: Core Features', { align: 'center' });
doc.moveDown();

doc.fontSize(16).text('1. Unified Agent Onboarding & Profile Management');
doc.fontSize(12).text('Agents can seamlessly register and manage their digital identity. This includes setting up their bio, uploading profile pictures, linking to specific campuses, and keeping their business details up to date.');
doc.moveDown();

doc.fontSize(16).text('2. Robust Verification System');
doc.fontSize(12).text('Security is prioritized via a real-time OTP verification flow. Agents must verify both their Email and Phone numbers through a sleek, glassmorphic modal, ensuring trust and authenticity before they can fully interact with students.');
doc.moveDown();

doc.fontSize(16).text('3. Multi-Category Listings');
doc.fontSize(12).text('The platform supports three distinct types of agent operations:\n• Lodges (Landlords): Add housing details, select amenities, specify unit quantities, and define yearly rent.\n• Products (Vendors): Sell items (e.g., food, apparel) with detailed delivery options including Campus Delivery or Doorstep delivery.\n• Services (Providers): Offer specialized services, specifying available working days, operational hours, and per-unit pricing.');
doc.moveDown();

doc.fontSize(16).text('4. Interactive & Responsive Dashboard');
doc.fontSize(12).text('A high-contrast, modern dashboard that provides agents with an immediate overview of their business. It features live statistics on total listings, active reservations, and pending requests, along with \'Quick Actions\' to rapidly add new listings or review student demands.');
doc.moveDown();

doc.fontSize(16).text('5. Advanced Listing Management');
doc.fontSize(12).text('The \'My Listings\' interface allows agents to filter their inventory by status (Active, Pending, Taken). Creating or editing a listing summons a unified, fully responsive modal overlay (bottom sheet on mobile, floating window on desktop) that includes image uploads and data validation.');
doc.moveDown();

doc.fontSize(16).text('6. Student Requests & Matching');
doc.fontSize(12).text('Agents receive direct requests from students for their listings. They can view detailed student profiles (including the student\'s verification status and bio) to make informed decisions before accepting or declining a reservation or order.');
doc.moveDown();

doc.fontSize(16).text('7. Interactive Map Integration');
doc.fontSize(12).text('For real estate listings, the portal integrates Leaflet maps, allowing landlords to precisely drop pins for their properties. This geographic data ensures students know exactly where a lodge is located.');

doc.end();
