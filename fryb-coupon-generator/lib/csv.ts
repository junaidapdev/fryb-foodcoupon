import { Employee } from '../types';

export const parseCSV = (csvString: string, existingEmployees: Employee[]): { imported: Employee[], skipped: number } => {
  const lines = csvString.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length <= 1) return { imported: [], skipped: 0 };
  
  // Skip header
  const dataLines = lines.slice(1);
  const imported: Employee[] = [];
  let skipped = 0;
  
  const existingCodes = new Set(existingEmployees.map(e => e.employee_code.toLowerCase()));

  for (const line of dataLines) {
    const columns = line.split(',');
    const name = (columns[0] || '').trim();
    const employee_code = (columns[1] || '').trim();
    
    if (!name || !employee_code) {
      skipped++;
      continue;
    }
    
    if (existingCodes.has(employee_code.toLowerCase())) {
      skipped++;
      continue;
    }
    
    imported.push({
      id: crypto.randomUUID(),
      name,
      employee_code,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    
    existingCodes.add(employee_code.toLowerCase());
  }
  
  return { imported, skipped };
};

export const exportCSV = (employees: Employee[]) => {
  const header = ['name', 'employee_code'].join(',');
  const rows = employees.map(emp => 
    [
      emp.name.includes(',') ? `"${emp.name}"` : emp.name, 
      emp.employee_code
    ].join(',')
  );
  
  const csvContent = [header, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const date = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `fryb-employees-${date}.csv`);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
