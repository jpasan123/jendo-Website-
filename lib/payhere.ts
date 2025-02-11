import crypto from 'crypto';

// PayHere API configuration
const PAYHERE_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!;
const PAYHERE_SECRET = process.env.PAYHERE_SECRET!;
const PAYHERE_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.payhere.lk/pay/checkout'
  : 'https://sandbox.payhere.lk/pay/checkout';

export interface PayherePayment {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hash: string;
}

export function generateHash(orderId: string, amount: number): string {
  const data = `${PAYHERE_MERCHANT_ID}${orderId}${amount.toFixed(2)}LKR${PAYHERE_SECRET}`;
  return crypto.createHash('md5').update(data).digest('hex').toUpperCase();
}

export function createPaymentForm(payment: Omit<PayherePayment, 'merchant_id' | 'hash'>): PayherePayment {
  const hash = generateHash(payment.order_id, payment.amount);
  
  return {
    ...payment,
    merchant_id: PAYHERE_MERCHANT_ID,
    hash,
  };
}

export const PAYHERE_FORM_FIELDS = [
  'merchant_id',
  'return_url',
  'cancel_url',
  'notify_url',
  'order_id',
  'items',
  'currency',
  'amount',
  'first_name',
  'last_name',
  'email',
  'phone',
  'address',
  'city',
  'country',
  'hash',
] as const;