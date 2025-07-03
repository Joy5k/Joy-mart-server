
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
  productIds: string[];
  userId: string; 
  total_amount: number;
  currency?: string;
  customer: IPaymentCustomer;
  paymentMethod?: 'online' | 'cod' | 'wallet';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}