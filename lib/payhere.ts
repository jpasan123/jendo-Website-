import crypto from 'crypto';

// Configuration
const PAYHERE_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!;
const PAYHERE_SECRET = process.env.PAYHERE_SECRET!;
// Use live PayHere since merchant ID 239581 is a live merchant ID
export const PAYHERE_BASE_URL = 'https://www.payhere.lk/pay/checkout';

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
  'custom_1',
  'custom_2'
] as const;

export interface PayherePayment {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  order_id: string;
  items: string;
  currency: string;
  amount:  number;
  hash: string;
  custom_1?: string;
  custom_2?: string;
}

export function generateHash(payment: Omit<PayherePayment, 'merchant_id' | 'hash'>): string {
  const data = [
    PAYHERE_MERCHANT_ID,
    payment.order_id,
    payment.amount,
    payment.currency,
    PAYHERE_SECRET
  ].join('');
  
  return crypto.createHash('md5').update(data).digest('hex').toUpperCase();
}

export function createPaymentForm(payment: PayherePayment): PayherePayment {
  const formattedAmount = typeof payment.amount === 'number'
    ? payment.amount.toFixed(2)
    : parseFloat(payment.amount as string).toFixed(2);

  const paymentWithDefaults = {
    ...payment
  };

  return payment;
}

export const PAYHERE_REQUIRED_FIELDS = [
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
  'hash'
] as const;