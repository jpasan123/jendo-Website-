import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { formType, formData } = await req.json();
    console.log(`Processing ${formType} data:`, formData);
    
    // Create directory if it doesn't exist
    const dirPath = path.join(process.cwd(), 'excel-data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Define filename based on form type
    const filePath = path.join(dirPath, `${formType}_data.xlsx`);
    
    // Add timestamp to the data
    const dataWithTimestamp = {
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    let workbook;
    let worksheet;
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      // If exists, read the file
      workbook = XLSX.readFile(filePath);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Get the current data
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Add new data
      jsonData.push(dataWithTimestamp);
      
      // Replace worksheet with updated data
      worksheet = XLSX.utils.json_to_sheet(jsonData);
    } else {
      // If not exists, create new
      workbook = XLSX.utils.book_new();
      worksheet = XLSX.utils.json_to_sheet([dataWithTimestamp]);
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    
    // Write to file
    XLSX.writeFile(workbook, filePath);
    
    console.log(`Data exported to ${filePath}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data exported to Excel successfully' 
    });
    
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to export to Excel' },
      { status: 500 }
    );
  }
}