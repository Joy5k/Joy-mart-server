
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
  bookingIds:string[];
  productIds: [{productId:string,productQuantity:number}];
  userId: string; 
  total_amount: number;
  currency?: string;
  customer: IPaymentCustomer;
  paymentMethod?: 'online' | 'cod' | 'wallet';
  productQuantity?: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}