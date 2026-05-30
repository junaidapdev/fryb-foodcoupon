export type Employee = {
  id: string;
  name: string;
  employee_code: string;
  created_at: string;
  updated_at: string;
};

export type CouponSettings = {
  month: number;
  year: number;
  tier1_copies: number;
  tier2_copies: number;
};

export type Coupon = {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  coupon_code: string;
  coupon_value: number;
  copy_number: number;
  month: number;
  year: number;
};

export type EmployeeSheetGroup = {
  employee: Employee;
  coupons: Coupon[];
};
