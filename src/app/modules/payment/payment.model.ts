import { model, Schema } from "mongoose";

const paymentSchema= new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   productIds: [
    {productId:{  
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    productQuantity:{type:Number,require:true}}
  ],
    orderId: { 
      type: String,
      index: true,
      default: () => `JMART_TXN-${Date.now()}${Math.random().toString(36).substring(2, 15)}`, 
      sparse: true 
    },
    orderStatus: { 
      type: String, 
      required: true,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'

    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cod', 'wallet']
    },
    totalAmount: Number,
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    contactInfo: {
      phone: String,
      email: String
    },
    paymentDetails: {
      amount: Number,
      currency: { type: String, default: 'BDT' },
      paymentGateway: String,
      transactionTime: Date,
      cardLast4: String
    },
    trackingInfo: {
      trackingNumber: String,
      carrier: String,
      estimatedDelivery: Date,
      actualDelivery: Date
    }
 
 
    

}, { timestamps: true })

export const Payment = model('Payment', paymentSchema);