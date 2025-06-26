declare module 'sslcommerz-lts' {
  interface SSLCommerzPaymentInitResponse {
    GatewayPageURL?: string;
    status?: string;
    failedreason?: string;
    sessionkey?: string;
    [key: string]: any;
  }

  interface SSLCommerzValidationResponse {
    status: 'VALID' | 'FAILED' | 'CANCELLED' | 'UNATTEMPTED' | 'EXPIRED';
    tran_date: string;
    tran_id: string;
    val_id: string;
    amount: string;
    store_amount: string;
    currency: string;
    bank_tran_id: string;
    card_type: string;
    card_no: string;
    card_issuer: string;
    card_brand: string;
    card_issuer_country: string;
    card_issuer_country_code: string;
    currency_type: string;
    currency_amount: string;
    currency_rate: string;
    base_fair: string;
    value_a: string;
    value_b: string;
    value_c: string;
    value_d: string;
    risk_title: string;
    risk_level: string;
    APIConnect: string;
    validated_on: string;
    gw_version: string;
  }

  interface SSLCommerzPaymentOptions {
    total_amount: number;
    currency?: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url?: string;
    shipping_method?: string;
    product_name?: string;
    product_category?: string;
    product_profile?: string;
    cus_name: string;
    cus_email: string;
    cus_add1?: string;
    cus_add2?: string;
    cus_city?: string;
    cus_state?: string;
    cus_postcode?: string;
    cus_country?: string;
    cus_phone: string;
    cus_fax?: string;
    ship_name?: string;
    ship_add1?: string;
    ship_add2?: string;
    ship_city?: string;
    ship_state?: string;
    ship_postcode?: string;
    ship_country?: string;
    multi_card_name?: string;
    value_a?: string;
    value_b?: string;
    value_c?: string;
    value_d?: string;
  }

  interface SSLCommerzValidationOptions {
    val_id: string;
  }

  class SSLCommerzPayment {
    constructor(storeId: string, storePassword: string, isLive: boolean);
    init(data: SSLCommerzPaymentOptions): Promise<SSLCommerzPaymentInitResponse>;
    validate(data: SSLCommerzValidationOptions): Promise<SSLCommerzValidationResponse>;
  }

  export = SSLCommerzPayment;
}