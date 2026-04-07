const PDFDocument = require('pdfkit');

const generatePDF = (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(20).text('VetNexara ATS Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`ATS Score: ${data.atsScore}`);
    doc.moveDown();

    doc.text('Top Skills:');
    data.parsedSkills?.forEach(skill => doc.text(`• ${skill}`));

    doc.moveDown();
    doc.text('Missing Skills:');
    data.missingSkills?.forEach(skill => doc.text(`• ${skill}`));

    doc.moveDown();
    doc.text('Recommendations:');
    data.recommendations?.forEach(rec => doc.text(`• ${rec}`));

    doc.moveDown();
    doc.text(`Best Job Match: ${data.jobMatch}`);

    doc.end();
  });
};

module.exports = { generatePDF };