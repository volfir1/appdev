const Household = require('../models/Household');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Generate summary statistics grouped by riskLevel and barangay, send as CSV
exports.downloadPovertyReport = async (req, res) => {
  try {
    // Filter for worker role
    let matchStage = {};
    if (req.user.role === 'worker') {
      if (!req.user.barangay) {
        return res.status(400).json({ message: 'Worker account has no assigned barangay' });
      }
      matchStage = { barangay: req.user.barangay };
    }
    const stats = await Household.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { barangay: '$barangay', riskLevel: '$riskLevel' },
          count: { $sum: 1 },
          avgPovertyScore: { $avg: '$povertyScore' },
          avgIncome: { $avg: '$familyIncome' }
        }
      },
      {
        $group: {
          _id: '$_id.barangay',
          povertyLevels: {
            $push: {
              riskLevel: '$_id.riskLevel',
              count: '$count',
              avgPovertyScore: '$avgPovertyScore',
              avgIncome: '$avgIncome'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'barangays',
          localField: '_id',
          foreignField: '_id',
          as: 'barangayInfo'
        }
      },
      { $unwind: { path: '$barangayInfo', preserveNullAndEmptyArrays: true } },
      { $sort: { 'barangayInfo.name': 1 } }
    ]);

    // Flatten for CSV: one row per barangay, columns for each poverty level
    const povertyLevels = ['High', 'Moderate', 'Low'];
    const data = stats.map(item => {
      const row = {
        'Barangay': item.barangayInfo?.name || item._id
      };
      povertyLevels.forEach(level => {
        const found = item.povertyLevels.find(pl => pl.riskLevel === level);
        row[`${level} - No. of Households`] = found ? found.count : 0;
        row[`${level} - Avg. Poverty Score`] = found && found.avgPovertyScore != null ? found.avgPovertyScore.toFixed(2) : '';
        row[`${level} - Avg. Family Income`] = found && found.avgIncome != null ? found.avgIncome.toFixed(2) : '';
      });
      return row;
    });

    const fields = [
      'Barangay',
      ...povertyLevels.flatMap(level => [
        `${level} - No. of Households`,
        `${level} - Avg. Poverty Score`,
        `${level} - Avg. Family Income`
      ])
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('poverty_report.csv');
    res.send(csv);
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};

// Generate enhanced summary statistics with analytics, send as PDF
exports.downloadPovertyReportPDF = async (req, res) => {
  try {
    // Logo paths - using absolute paths for better reliability
    const logo1Path = path.resolve(__dirname, '../src/icon.png');
    const logo2Path = path.resolve(__dirname, '../src/tup_logo.png');
    
    console.log('Logo 1 path:', logo1Path);
    console.log('Logo 2 path:', logo2Path);
    console.log('Logo 1 exists:', fs.existsSync(logo1Path));
    console.log('Logo 2 exists:', fs.existsSync(logo2Path));
    
    // Filter for worker role
    let matchStage = {};
    if (req.user.role === 'worker') {
      if (!req.user.barangay) {
        return res.status(400).json({ message: 'Worker account has no assigned barangay' });
      }
      matchStage = { barangay: req.user.barangay };
    }
    const stats = await Household.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { barangay: '$barangay', riskLevel: '$riskLevel' },
          count: { $sum: 1 },
          avgPovertyScore: { $avg: '$povertyScore' },
          avgIncome: { $avg: '$familyIncome' },
          totalIncome: { $sum: '$familyIncome' },
          minIncome: { $min: '$familyIncome' },
          maxIncome: { $max: '$familyIncome' }
        }
      },
      {
        $group: {
          _id: '$_id.barangay',
          povertyLevels: {
            $push: {
              riskLevel: '$_id.riskLevel',
              count: '$count',
              avgPovertyScore: '$avgPovertyScore',
              avgIncome: '$avgIncome',
              totalIncome: '$totalIncome',
              minIncome: '$minIncome',
              maxIncome: '$maxIncome'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'barangays',
          localField: '_id',
          foreignField: '_id',
          as: 'barangayInfo'
        }
      },
      { $unwind: { path: '$barangayInfo', preserveNullAndEmptyArrays: true } },
      { $sort: { 'barangayInfo.name': 1 } }
    ]);

    // Calculate overall statistics
    let totalHouseholds = 0;
    let totalPovertyScore = 0;
    let totalIncome = 0;
    let riskLevelCounts = { High: 0, Moderate: 0, Low: 0 };
    let barangayStats = [];

    // Prepare data for table and calculate overall stats
    const povertyLevels = ['High', 'Moderate', 'Low'];
    const data = stats.map(item => {
      const row = {
        barangay: item.barangayInfo?.name || item._id
      };
      
      let barangayTotal = 0;
      let barangayTotalScore = 0;
      let barangayTotalIncome = 0;
      
      povertyLevels.forEach(level => {
        const found = item.povertyLevels.find(pl => pl.riskLevel === level);
        const count = found ? found.count : 0;
        const avgScore = found && found.avgPovertyScore != null ? found.avgPovertyScore : 0;
        const avgIncome = found && found.avgIncome != null ? found.avgIncome : 0;
        const totalIncomeLevel = found && found.totalIncome != null ? found.totalIncome : 0;
        
        row[`${level}_count`] = count;
        row[`${level}_avgScore`] = avgScore > 0 ? avgScore.toFixed(2) : '-';
        row[`${level}_avgIncome`] = avgIncome > 0 ? avgIncome.toFixed(2) : '-';
        
        // Update totals
        totalHouseholds += count;
        riskLevelCounts[level] += count;
        totalPovertyScore += (avgScore * count);
        totalIncome += totalIncomeLevel;
        
        barangayTotal += count;
        barangayTotalScore += (avgScore * count);
        barangayTotalIncome += totalIncomeLevel;
      });
      
      // Calculate barangay overall averages
      row.barangayTotalHouseholds = barangayTotal;
      row.barangayAvgScore = barangayTotal > 0 ? (barangayTotalScore / barangayTotal).toFixed(2) : '0.00';
      row.barangayAvgIncome = barangayTotal > 0 ? (barangayTotalIncome / barangayTotal).toFixed(2) : '0.00';
      
      barangayStats.push({
        name: row.barangay,
        totalHouseholds: barangayTotal,
        avgScore: parseFloat(row.barangayAvgScore),
        avgIncome: parseFloat(row.barangayAvgIncome)
      });
      
      return row;
    });

    // Calculate overall averages
    const overallAvgPovertyScore = totalHouseholds > 0 ? (totalPovertyScore / totalHouseholds).toFixed(2) : '0.00';
    const overallAvgIncome = totalHouseholds > 0 ? (totalIncome / totalHouseholds).toFixed(2) : '0.00';

    // Create PDF document
    const doc = new PDFDocument({ 
      margin: 50, 
      size: 'A4', 
      layout: 'landscape',
      bufferPages: true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="poverty_analytics_report.pdf"');
    doc.pipe(res);

    // Function to draw header on each page
    const drawHeader = (doc, pageNumber = 1) => {
      // Background gradient effect
      doc.rect(0, 0, doc.page.width, 140).fillColor('#FFF1F2').fill();
      doc.rect(0, 70, doc.page.width, 70).fillColor('#FFE4E6').fill();

      // Logo handling with fallback
      try {
        if (fs.existsSync(logo1Path)) {
          doc.image(logo1Path, 50, 20, { width: 80, height: 60 });
        } else {
          doc.rect(50, 20, 80, 60).strokeColor('#EF4444').lineWidth(2).stroke();
          doc.fontSize(8).fillColor('#374151').text('LOGO 1', 55, 45, { width: 70, align: 'center' });
        }

        if (fs.existsSync(logo2Path)) {
          doc.image(logo2Path, doc.page.width - 130, 20, { width: 80, height: 60 });
        } else {
          doc.rect(doc.page.width - 130, 20, 80, 60).strokeColor('#EF4444').lineWidth(2).stroke();
          doc.fontSize(8).fillColor('#374151').text('LOGO 2', doc.page.width - 125, 45, { width: 70, align: 'center' });
        }
      } catch (error) {
        console.log('Logo loading error:', error.message);
        doc.rect(50, 20, 80, 60).strokeColor('#EF4444').lineWidth(2).stroke();
        doc.fontSize(8).fillColor('#374151').text('LOGO 1', 55, 45, { width: 70, align: 'center' });
        doc.rect(doc.page.width - 130, 20, 80, 60).strokeColor('#EF4444').lineWidth(2).stroke();
        doc.fontSize(8).fillColor('#374151').text('LOGO 2', doc.page.width - 125, 45, { width: 70, align: 'center' });
      }

      // System name
      doc.fontSize(10).fillColor('#B91C1C').font('Helvetica-Bold').text('ActOnPov', 50, 85, { align: 'left' });

      // Title with red background
      const titleX = 180;
      const titleWidth = doc.page.width - 360;
      doc.rect(titleX, 25, titleWidth, 50).fillColor('#EF4444').fill();
      
      doc.fontSize(18).fillColor('#FFFFFF').font('Helvetica-Bold')
         .text('POVERTY ANALYTICS & SUMMARY REPORT', titleX + 10, 40, { 
           width: titleWidth - 20, 
           align: 'center' 
         });

      // Date and time stamps
      const now = new Date();
      const dateStamp = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const timeStamp = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });

      doc.fontSize(9).fillColor('#374151').font('Helvetica')
         .text(`Generated on: ${dateStamp}`, 50, 105, { align: 'left' })
         .text(`Time: ${timeStamp}`, 50, 118, { align: 'left' })
         .text(`Page ${pageNumber}`, doc.page.width - 100, 105, { align: 'right' });

      // Subtitle
      doc.fontSize(11).fillColor('#374151').font('Helvetica')
         .text('Comprehensive poverty analysis with statistics and insights for all households', 
               50, 150, { 
                 width: doc.page.width - 100, 
                 align: 'center' 
               });
    };

    // Function to draw analytics overview
    const drawAnalyticsOverview = (doc, startY) => {
      let currentY = startY;
      
      // Analytics overview section
      doc.rect(50, currentY, 735, 120).fillColor('#F87171').opacity(0.1).fill()
         .strokeColor('#EF4444').lineWidth(2).stroke();

      doc.fontSize(14).fillColor('#B91C1C').font('Helvetica-Bold').opacity(1)
         .text('ANALYTICS OVERVIEW', 60, currentY + 15);

      // Key metrics in columns
      const col1X = 70, col2X = 280, col3X = 490, col4X = 650;
      
      doc.fontSize(10).fillColor('#374151').font('Helvetica-Bold')
         .text('OVERALL STATISTICS', col1X, currentY + 45);
      
      doc.fontSize(9).font('Helvetica')
         .text(`Total Barangays: ${data.length}`, col1X, currentY + 60)
         .text(`Total Households: ${totalHouseholds}`, col1X, currentY + 75)
         .text(`Avg. Poverty Score: ${overallAvgPovertyScore}`, col1X, currentY + 90);

      doc.fontSize(10).fillColor('#374151').font('Helvetica-Bold')
         .text('FINANCIAL METRICS', col2X, currentY + 45);
      
      doc.fontSize(9).font('Helvetica')
         .text(`Avg. Family Income: ${overallAvgIncome}`, col2X, currentY + 60)
         .text(`Total Community Income: ${totalIncome.toLocaleString()}`, col2X, currentY + 75);

      doc.fontSize(10).fillColor('#374151').font('Helvetica-Bold')
         .text('RISK DISTRIBUTION', col3X, currentY + 45);
      
      const highPercentage = totalHouseholds > 0 ? ((riskLevelCounts.High / totalHouseholds) * 100).toFixed(1) : '0.0';
      const moderatePercentage = totalHouseholds > 0 ? ((riskLevelCounts.Moderate / totalHouseholds) * 100).toFixed(1) : '0.0';
      const lowPercentage = totalHouseholds > 0 ? ((riskLevelCounts.Low / totalHouseholds) * 100).toFixed(1) : '0.0';
      
      doc.fontSize(9).font('Helvetica')
         .text(`High Risk: ${riskLevelCounts.High} (${highPercentage}%)`, col3X, currentY + 60)
         .text(`Moderate Risk: ${riskLevelCounts.Moderate} (${moderatePercentage}%)`, col3X, currentY + 75)
         .text(`Low Risk: ${riskLevelCounts.Low} (${lowPercentage}%)`, col3X, currentY + 90);

      // Risk level visual indicator (simple bar chart)
      const barY = currentY + 50;
      const barHeight = 8;
      const maxBarWidth = 90;
      
      if (totalHouseholds > 0) {
        // High risk bar
        const highBarWidth = (riskLevelCounts.High / totalHouseholds) * maxBarWidth;
        doc.rect(col4X, barY, highBarWidth, barHeight).fillColor('#DC2626').fill();
        doc.fontSize(7).fillColor('#FFFFFF').text('HIGH', col4X + 2, barY + 1);
        
        // Moderate risk bar
        const moderateBarWidth = (riskLevelCounts.Moderate / totalHouseholds) * maxBarWidth;
        doc.rect(col4X, barY + 15, moderateBarWidth, barHeight).fillColor('#F59E0B').fill();
        doc.fontSize(7).fillColor('#FFFFFF').text('MOD', col4X + 2, barY + 16);
        
        // Low risk bar
        const lowBarWidth = (riskLevelCounts.Low / totalHouseholds) * maxBarWidth;
        doc.rect(col4X, barY + 30, lowBarWidth, barHeight).fillColor('#059669').fill();
        doc.fontSize(7).fillColor('#FFFFFF').text('LOW', col4X + 2, barY + 31);
      }

      return currentY + 130;
    };

    // Draw initial header and analytics
    drawHeader(doc, 1);
    let currentY = drawAnalyticsOverview(doc, 180);

    // Enhanced table setup with additional columns
    const columns = [
      { header: 'Barangay', width: 85, x: 50 },
      { header: 'Total\nHouseholds', width: 55, x: 135 },
      { header: 'Barangay\nAvg Score', width: 55, x: 190 },
      { header: 'Barangay\nAvg Income', width: 65, x: 245 },
      { header: 'High Risk\nCount', width: 50, x: 310 },
      { header: 'High Risk\nAvg Score', width: 55, x: 360 },
      { header: 'High Risk\nAvg Income', width: 60, x: 415 },
      { header: 'Mod. Risk\nCount', width: 50, x: 475 },
      { header: 'Mod. Risk\nAvg Score', width: 55, x: 525 },
      { header: 'Mod. Risk\nAvg Income', width: 60, x: 580 },
      { header: 'Low Risk\nCount', width: 50, x: 640 },
      { header: 'Low Risk\nAvg Score', width: 55, x: 690 },
      { header: 'Low Risk\nAvg Income', width: 45, x: 745 }
    ];

    // Function to draw enhanced table header
    const drawTableHeader = (y) => {
      doc.rect(50, y, 740, 35).fillColor('#DC2626').fill();
      doc.rect(50, y, 740, 35).strokeColor('#B91C1C').lineWidth(2).stroke();
      
      let currentX = 50;
      columns.forEach((col, index) => {
        if (index > 0) {
          doc.moveTo(currentX, y).lineTo(currentX, y + 35)
             .strokeColor('#FFFFFF').opacity(0.5).lineWidth(1).stroke();
        }
        currentX += col.width;
      });
      
      doc.fontSize(8).fillColor('#FFFFFF').font('Helvetica-Bold').opacity(1);
      columns.forEach(col => {
        doc.text(col.header, col.x + 2, y + 10, { 
          width: col.width - 4, 
          align: 'center' 
        });
      });

      return y + 40;
    };

    // Draw table header
    currentY = drawTableHeader(currentY);

    // Table data with enhanced information
    doc.fontSize(7).fillColor('#374151').font('Helvetica');

    data.forEach((row, index) => {
      // Check if we need a new page
      if (currentY > doc.page.height - 120) {
        doc.addPage({ margin: 50, size: 'A4', layout: 'landscape' });
        drawHeader(doc, Math.ceil((index + 2) / 20));
        currentY = drawTableHeader(190);
      }

      const rowHeight = 20;
      if (index % 2 === 0) {
        doc.rect(50, currentY - 2, 740, rowHeight).fillColor('#FECACA').opacity(0.2).fill();
      }

      doc.rect(50, currentY - 2, 740, rowHeight)
         .strokeColor('#EF4444').opacity(0.2).lineWidth(0.5).stroke();

      // Column separators
      let currentX = 50;
      columns.forEach((col, colIndex) => {
        if (colIndex > 0) {
          doc.moveTo(currentX, currentY - 2).lineTo(currentX, currentY + rowHeight - 2)
             .strokeColor('#EF4444').opacity(0.15).lineWidth(0.5).stroke();
        }
        currentX += col.width;
      });

      // Enhanced row data
      const rowData = [
        row.barangay,
        row.barangayTotalHouseholds.toString(),
        row.barangayAvgScore,
        row.barangayAvgIncome,
        row.High_count.toString(),
        row.High_avgScore,
        row.High_avgIncome !== '-' ? row.High_avgIncome : '-',
        row.Moderate_count.toString(),
        row.Moderate_avgScore,
        row.Moderate_avgIncome !== '-' ? row.Moderate_avgIncome : '-',
        row.Low_count.toString(),
        row.Low_avgScore,
        row.Low_avgIncome !== '-' ? row.Low_avgIncome : '-'
      ];

      doc.fontSize(7).fillColor('#374151').font('Helvetica').opacity(1);

      columns.forEach((col, colIndex) => {
        const textAlign = colIndex === 0 ? 'left' : 'center';
        doc.text(rowData[colIndex], col.x + 2, currentY + 4, { 
          width: col.width - 4, 
          align: textAlign
        });
      });

      currentY += rowHeight;
    });

    // Enhanced summary section
    currentY += 30;
    if (currentY > doc.page.height - 200) {
      doc.addPage({ margin: 50, size: 'A4', layout: 'landscape' });
      drawHeader(doc, Math.ceil(data.length / 20) + 1);
      currentY = 210;
    }

    // Insights and recommendations section
    doc.rect(50, currentY, 735, 140).fillColor('#F87171').opacity(0.1).fill()
       .strokeColor('#EF4444').lineWidth(2).stroke();

    doc.fontSize(14).fillColor('#B91C1C').font('Helvetica-Bold').opacity(1)
       .text('KEY INSIGHTS & RECOMMENDATIONS', 60, currentY + 15);

    // Handle edge case where barangayStats might be empty
    if (barangayStats.length > 0) {
      // Find barangay with highest risk
      const highestRiskBarangay = barangayStats.reduce((prev, current) => 
        (prev.avgScore > current.avgScore) ? prev : current
      );
      
      // Find barangay with lowest income
      const lowestIncomeBarangay = barangayStats.reduce((prev, current) => 
        (prev.avgIncome < current.avgIncome) ? prev : current
      );

      doc.fontSize(10).fillColor('#374151').font('Helvetica')
         .text(`• Highest Risk Area: ${highestRiskBarangay.name} (Avg Score: ${highestRiskBarangay.avgScore})`, 70, currentY + 45)
         .text(`• Lowest Income Area: ${lowestIncomeBarangay.name} (Avg Income: ${lowestIncomeBarangay.avgIncome})`, 70, currentY + 65)
         .text(`• Priority Focus: ${riskLevelCounts.High} households require immediate intervention`, 70, currentY + 85)
         .text(`• Overall Community Health: ${totalHouseholds > 0 ? ((riskLevelCounts.Low / totalHouseholds) * 100).toFixed(1) : '0'}% of households are in low-risk category`, 70, currentY + 105);
    } else {
      doc.fontSize(10).fillColor('#374151').font('Helvetica')
         .text('• No data available for analysis', 70, currentY + 45)
         .text('• Please ensure household data is properly recorded', 70, currentY + 65);
    }

    // Footer
    const drawFooter = (doc, pageHeight) => {
      const footerY = pageHeight - 80;
      
      // Footer background
      doc.rect(0, footerY, doc.page.width, 80).fillColor('#374151').fill();
      
      // Footer content
      doc.fontSize(10).fillColor('#FFFFFF').font('Helvetica-Bold')
         .text('ActOnPov - Poverty Assessment & Management System', 50, footerY + 15);
      
      doc.fontSize(8).font('Helvetica')
         .text('This report provides comprehensive poverty analytics to support data-driven decision making', 50, footerY + 35)
         .text('for community development and poverty alleviation programs.', 50, footerY + 48);
      
      doc.text(`Generated: ${new Date().toLocaleString()} | Total Records Analyzed: ${totalHouseholds}`, 50, footerY + 62);
      
      // System info on the right
      doc.text('ActOnPov v2.0', doc.page.width - 150, footerY + 15, { align: 'right' })
         .text('Confidential Report', doc.page.width - 150, footerY + 30, { align: 'right' });
    };

    // Add footer to current page
    drawFooter(doc, doc.page.height);

    doc.end();
  } catch (error) {
    console.error('Download enhanced PDF report error:', error);
    res.status(500).json({ message: 'Failed to generate enhanced PDF report', error: error.message });
  }
};