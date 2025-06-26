
// src/modules/payment/payment.interface.ts
export interface IPaymentCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface IPaymentData {
  bookingIds: string[];
  total_amount: number;
  currency?: string;
  customer: IPaymentCustomer;
}