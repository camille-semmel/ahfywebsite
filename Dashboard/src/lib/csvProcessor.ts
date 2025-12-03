import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';

export interface CSVStudentRow {
  email?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  [key: string]: string | undefined;
}

export interface ProcessingResult {
  matched: number;
  created: number;
  updated: number;
  errors: string[];
}

export const parseCSV = (file: File): Promise<CSVStudentRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim().replace(/\s+/g, '_'),
      complete: (results) => {
        resolve(results.data as CSVStudentRow[]);
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
};

export const matchStudentByEmail = (
  csvRow: CSVStudentRow,
  existingStudents: any[]
): any | null => {
  if (!csvRow.email) return null;
  
  const normalizedEmail = csvRow.email.toLowerCase().trim();
  return existingStudents.find(
    (student) => student.email?.toLowerCase().trim() === normalizedEmail
  ) || null;
};

export const matchStudentByName = (
  csvRow: CSVStudentRow,
  existingStudents: any[]
): any | null => {
  if (!csvRow.first_name || !csvRow.last_name) return null;
  
  const normalizedFirstName = csvRow.first_name.toLowerCase().trim();
  const normalizedLastName = csvRow.last_name.toLowerCase().trim();
  
  return existingStudents.find((student) => {
    const studentFirstName = student.first_name?.toLowerCase().trim() || '';
    const studentLastName = student.last_name?.toLowerCase().trim() || '';
    
    return (
      studentFirstName === normalizedFirstName &&
      studentLastName === normalizedLastName
    );
  }) || null;
};

export const processStudentCSV = async (file: File): Promise<ProcessingResult> => {
  const result: ProcessingResult = {
    matched: 0,
    created: 0,
    updated: 0,
    errors: [],
  };

  try {
    // Parse CSV file
    const csvRows = await parseCSV(file);
    
    if (csvRows.length === 0) {
      result.errors.push('CSV file is empty or invalid');
      return result;
    }

    // Fetch existing students from userspub table
    const { data: existingStudents, error: fetchError } = await supabase
      .from('userspub')
      .select('*');

    if (fetchError) {
      result.errors.push(`Failed to fetch existing students: ${fetchError.message}`);
      return result;
    }

    // Process each CSV row
    for (const [index, csvRow] of csvRows.entries()) {
      try {
        // Try email match first
        let matchedStudent = matchStudentByEmail(csvRow, existingStudents || []);
        
        // If no email match, try name match
        if (!matchedStudent) {
          matchedStudent = matchStudentByName(csvRow, existingStudents || []);
        }

        // Prepare student data with fallbacks
        const studentData = {
          email: csvRow.email || 'Not Available',
          first_name: csvRow.first_name || 'Not Available',
          last_name: csvRow.last_name || 'Not Available',
        };

        if (matchedStudent) {
          // Update existing student
          const { error: updateError } = await supabase
            .from('userspub')
            .update(studentData)
            .eq('id', matchedStudent.id);

          if (updateError) {
            result.errors.push(`Row ${index + 1}: ${updateError.message}`);
          } else {
            result.matched++;
            result.updated++;
          }
        } else {
          // Create new student entry - generate UUID for new student
          const { error: insertError } = await supabase
            .from('userspub')
            .insert([{
              id: crypto.randomUUID(),
              ...studentData,
            }]);

          if (insertError) {
            result.errors.push(`Row ${index + 1}: ${insertError.message}`);
          } else {
            result.created++;
          }
        }
      } catch (rowError: any) {
        result.errors.push(`Row ${index + 1}: ${rowError.message}`);
      }
    }

    return result;
  } catch (error: any) {
    result.errors.push(`Processing failed: ${error.message}`);
    return result;
  }
};
