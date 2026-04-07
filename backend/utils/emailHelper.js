const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

// ✅ PDF GENERATOR
const generatePDF = (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.fontSize(22).fillColor('#8b5cf6').text('VetNexara ATS Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).fillColor('gray')
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.moveDown(2);

    doc.fontSize(18).fillColor('black').text('ATS Score');
    doc.fontSize(26).fillColor('#10b981').text(`${data.atsScore}/100`);

    const section = (title, items) => {
      doc.moveDown();
      doc.fontSize(14).fillColor('#8b5cf6').text(title);
      doc.moveDown(0.5);
      doc.fillColor('black');

      if (!items || items.length === 0) {
        doc.text('No data available');
        return;
      }

      items.forEach(item => doc.text(`• ${item}`));
    };

    section('Top Skills', data.parsedSkills);
    section('Missing Skills', data.missingSkills);
    section('Recommendations', data.recommendations);

    doc.moveDown();
    doc.fontSize(14).fillColor('#2563eb')
      .text(`Best Job Match: ${data.jobMatch || 'N/A'}`);

    doc.end();
  });
};

// ✅ EMAIL FUNCTION
const sendAtsReport = async (email, data) => {
  try {
    console.log("📧 Sending email to:", email);

    // ✅ FIXED TRANSPORTER (PUT HERE ONLY)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const pdfBuffer = await generatePDF(data);

    await transporter.sendMail({
      from: `"VetNexara" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your ATS Resume Report',
      html: `<h2>Your ATS Report is Ready 🚀</h2>`,
      attachments: [
        {
          filename: 'ATS_Report.pdf',
          content: pdfBuffer
        }
      ]
    });

    console.log("✅ Email sent successfully");

  } catch (err) {
    console.error("❌ Email Error:", err);
  }
};

module.exports = { sendAtsReport };