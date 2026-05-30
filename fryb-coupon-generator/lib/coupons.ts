import { Employee, CouponSettings, EmployeeSheetGroup, Coupon } from '../types';

const MONTH_ABBR = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

const MONTH_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const generateCoupons = (
  employees: Employee[],
  settings: CouponSettings
): EmployeeSheetGroup[] => {
  const groups: EmployeeSheetGroup[] = [];

  const monthAbbr = MONTH_ABBR[settings.month - 1];
  const monthFull = MONTH_FULL[settings.month - 1];
  const year2 = settings.year.toString().slice(-2);
  
  // Build unique initials map
  const initialsCount: Record<string, number> = {};
  const employeeInitialsMap = new Map<string, string>();
  
  for (const emp of employees) {
    const rawInitials = emp.name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const baseInitials = rawInitials || 'EMP';
    
    if (!initialsCount[baseInitials]) {
      initialsCount[baseInitials] = 1;
      employeeInitialsMap.set(emp.id, baseInitials);
    } else {
      initialsCount[baseInitials]++;
      employeeInitialsMap.set(emp.id, `${baseInitials}${initialsCount[baseInitials]}`);
    }
  }

  for (const emp of employees) {
    const coupons: Coupon[] = [];
    const empInitials = employeeInitialsMap.get(emp.id);

    // Generate exactly 30 coupons per employee
    for (let day = 1; day <= 30; day++) {
      const dayStr = day.toString().padStart(2, '0');
      const coupon_code = `${monthAbbr}${year2}-${empInitials}-${dayStr}`;
      const coupon_date = `${dayStr} ${monthFull} ${settings.year}`;
      
      coupons.push({
        id: crypto.randomUUID(),
        employee_id: emp.id,
        employee_name: emp.name,
        employee_code: emp.employee_code,
        coupon_code,
        coupon_date,
        coupon_value: settings.coupon_value,
        copy_number: day,
        month: settings.month,
        year: settings.year
      });
    }
    
    groups.push({
      employee: emp,
      coupons
    });
  }

  return groups;
};
