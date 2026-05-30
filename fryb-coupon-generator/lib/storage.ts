import { Employee, CouponSettings } from '../types';

export const getEmployees = (): Employee[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('fryb_employees');
    if (data) {
      try {
        return JSON.parse(data) as Employee[];
      } catch (e) {
        console.error('Failed to parse employees from localStorage', e);
      }
    }
  }
  return [];
};

export const setEmployees = (employees: Employee[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fryb_employees', JSON.stringify(employees));
  }
};

export const getCouponSettings = (): CouponSettings | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('fryb_coupon_settings');
    if (data) {
      try {
        return JSON.parse(data) as CouponSettings;
      } catch (e) {
        console.error('Failed to parse coupon settings from localStorage', e);
      }
    }
  }
  return null;
};

export const setCouponSettings = (settings: CouponSettings): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fryb_coupon_settings', JSON.stringify(settings));
  }
};
