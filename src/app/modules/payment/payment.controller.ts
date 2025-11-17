// src/modules/payment/payment.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.services';
import { verifyToken } from '../Auth/auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';

// Initiate Payment
const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const { bookingIds, total_amount, currency, customer,productQuantity,productIds } = req.body;
   let token = req.cookies?.authToken; 
   
   const headersToken=req.headers.authorization as string
if(!token && headersToken){
  token=headersToken
}
  const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
  if (!bookingIds || !total_amount || !customer) {
    throw new Error('Missing required fields');
  }

  const result = await PaymentService.initiatePayment({

    userId,
    productIds, 
    bookingIds,
    productQuantity,
    total_amount,
    currency,
    customer
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: result
  });
});

// validate Payment
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  
  const result = await PaymentService.validatePayment(transactionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment validated successfully',
    data: result
  });
});

// Handle Payment IPN
const paymentIPN = catchAsync(async (req: Request, res: Response) => {
 const result= await PaymentService.handleIPN(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'IPN handled successfully',
    data:result
  });
});

// Tack order status
const trackOrder=catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
     let token = req.cookies?.authToken; 
   
   const headersToken=req.headers.authorization as string
if(!token && headersToken){
  token=headersToken
}
  const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
  const result = await PaymentService.trackOrderStatus(transactionId,userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status retrieved successfully',
    data: result
  });
})

// Get all order history
const getAllOrderHistoryFromDB=catchAsync(async (req: Request, res: Response) => {
     let token = req.cookies?.authToken; 
   
   const headersToken=req.headers.authorization as string
if(!token && headersToken){
  token=headersToken
}
  const {userId}=verifyToken(token,config.jwt_access_secret as string) as JwtPayload;  
  const result = await PaymentService.getAllOrderHistory(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order history retrieved successfully',
    data: result
  });
})

// Redirect handlers for SSL Commerz
const paymentSuccessRedirect = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful - Joy Mart</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
            <!-- Success Icon -->
            <div class="flex justify-center mb-6">
                <div class="relative">
                    <div class="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
                    <div class="relative bg-green-500 rounded-full p-3">
                        <i class="fas fa-check-circle text-4xl text-white"></i>
                    </div>
                </div>
            </div>
            
            <!-- Success Message -->
            <h1 class="text-2xl font-bold text-[#088178] mb-2">Payment Successful!</h1>
            <p class="text-gray-600 mb-4">Your payment has been processed successfully.</p>
            
            <!-- Transaction ID -->
            <div class="bg-gray-50 rounded-lg p-3 mb-6">
                <p class="text-sm text-gray-500">Transaction ID</p>
                <p class="text-lg font-mono font-bold text-[#088178]">${transactionId}</p>
            </div>

            <!-- Auto Redirect Message -->
            <div id="countdown" class="mb-6">
                <p class="text-gray-600 mb-2">Redirecting to order page in <span id="countdown-timer" class="font-bold text-[#088178]">5</span> seconds...</p>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="progress-bar" class="bg-[#088178] h-2 rounded-full w-0 transition-all duration-5000"></div>
                </div>
            </div>

            <!-- Manual Redirect Button -->
            <button onclick="redirectToSuccess()" class="w-full bg-[#088178] hover:bg-[#06635c] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center">
                <i class="fas fa-shopping-bag mr-2"></i>
                View Order Details
            </button>

            <!-- Support Link -->
            <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-500">Need help? 
                    <a href="${config.frontend_url}/contact" class="text-[#088178] hover:underline ml-1">Contact Support</a>
                </p>
            </div>
        </div>
    </div>

    <script>
        let countdown = 5;
        const countdownElement = document.getElementById('countdown-timer');
        const progressBar = document.getElementById('progress-bar');
        
        function redirectToSuccess() {
            window.location.href = '${config.frontend_url}/payment/success/${transactionId}';
        }
        
        function updateCountdown() {
            countdown--;
            countdownElement.textContent = countdown;
            progressBar.style.width = ((5 - countdown) / 5 * 100) + '%';
            
            if (countdown <= 0) {
                redirectToSuccess();
            } else {
                setTimeout(updateCountdown, 1000);
            }
        }
        
        // Start countdown when page loads
        setTimeout(updateCountdown, 1000);
    </script>
</body>
</html>
`;

  res.setHeader('Content-Type', 'text/html');
  res.send(htmlTemplate);
});

const paymentFailRedirect = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed - Joy Mart</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
            <!-- Error Icon -->
            <div class="flex justify-center mb-6">
                <div class="bg-red-100 rounded-full p-3">
                    <i class="fas fa-exclamation-circle text-4xl text-red-500"></i>
                </div>
            </div>
            
            <!-- Error Message -->
            <h1 class="text-2xl font-bold text-red-500 mb-2">Payment Failed</h1>
            <p class="text-gray-600 mb-4">We couldn't process your payment. Please try again.</p>
            
            <!-- Transaction ID -->
            <div class="bg-gray-50 rounded-lg p-3 mb-6">
                <p class="text-sm text-gray-500">Transaction ID</p>
                <p class="text-lg font-mono font-bold text-gray-700">${transactionId}</p>
            </div>

            <!-- Auto Redirect Message -->
            <div id="countdown" class="mb-6">
                <p class="text-gray-600 mb-2">Redirecting to checkout in <span id="countdown-timer" class="font-bold text-red-500">8</span> seconds...</p>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="progress-bar" class="bg-red-500 h-2 rounded-full w-0 transition-all duration-8000"></div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
                <button onclick="redirectToRetry()" class="w-full bg-[#088178] hover:bg-[#06635c] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300">
                    <i class="fas fa-redo mr-2"></i>
                    Try Again Now
                </button>
                <button onclick="redirectToHome()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-300">
                    <i class="fas fa-home mr-2"></i>
                    Back to Home
                </button>
            </div>

            <!-- Support Link -->
            <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-500">Need help? 
                    <a href="${config.frontend_url}/contact" class="text-[#088178] hover:underline ml-1">Contact Support</a>
                </p>
            </div>
        </div>
    </div>

    <script>
        let countdown = 8;
        const countdownElement = document.getElementById('countdown-timer');
        const progressBar = document.getElementById('progress-bar');
        
        function redirectToRetry() {
            window.location.href = '${config.frontend_url}/checkout';
        }
        
        function redirectToHome() {
            window.location.href = '${config.frontend_url}';
        }
        
        function updateCountdown() {
            countdown--;
            countdownElement.textContent = countdown;
            progressBar.style.width = ((8 - countdown) / 8 * 100) + '%';
            
            if (countdown <= 0) {
                redirectToRetry();
            } else {
                setTimeout(updateCountdown, 1000);
            }
        }
        
        // Start countdown when page loads
        setTimeout(updateCountdown, 1000);
    </script>
</body>
</html>
`;

  res.setHeader('Content-Type', 'text/html');
  res.send(htmlTemplate);
});

const paymentCancelRedirect = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Cancelled - Joy Mart</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
            <!-- Cancel Icon -->
            <div class="flex justify-center mb-6">
                <div class="bg-yellow-100 rounded-full p-3">
                    <i class="fas fa-times-circle text-4xl text-yellow-500"></i>
                </div>
            </div>
            
            <!-- Cancel Message -->
            <h1 class="text-2xl font-bold text-yellow-600 mb-2">Payment Cancelled</h1>
            <p class="text-gray-600 mb-4">Your payment was cancelled. You can try again anytime.</p>
            
            <!-- Transaction ID -->
            <div class="bg-gray-50 rounded-lg p-3 mb-6">
                <p class="text-sm text-gray-500">Transaction ID</p>
                <p class="text-lg font-mono font-bold text-gray-700">${transactionId}</p>
            </div>

            <!-- Auto Redirect Message -->
            <div id="countdown" class="mb-6">
                <p class="text-gray-600 mb-2">Redirecting to cart in <span id="countdown-timer" class="font-bold text-yellow-600">6</span> seconds...</p>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="progress-bar" class="bg-yellow-500 h-2 rounded-full w-0 transition-all duration-6000"></div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
                <button onclick="redirectToCart()" class="w-full bg-[#088178] hover:bg-[#06635c] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300">
                    <i class="fas fa-shopping-cart mr-2"></i>
                    Back to Cart
                </button>
                <button onclick="redirectToHome()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-300">
                    <i class="fas fa-home mr-2"></i>
                    Continue Shopping
                </button>
            </div>
        </div>
    </div>

    <script>
        let countdown = 6;
        const countdownElement = document.getElementById('countdown-timer');
        const progressBar = document.getElementById('progress-bar');
        
        function redirectToCart() {
            window.location.href = '${config.frontend_url}/cart';
        }
        
        function redirectToHome() {
            window.location.href = '${config.frontend_url}';
        }
        
        function updateCountdown() {
            countdown--;
            countdownElement.textContent = countdown;
            progressBar.style.width = ((6 - countdown) / 6 * 100) + '%';
            
            if (countdown <= 0) {
                redirectToCart();
            } else {
                setTimeout(updateCountdown, 1000);
            }
        }
        
        // Start countdown when page loads
        setTimeout(updateCountdown, 1000);
    </script>
</body>
</html>
`;

  res.setHeader('Content-Type', 'text/html');
  res.send(htmlTemplate);
});
export const PaymentController = {
  initiatePayment,
  validatePayment,
  paymentIPN,
  trackOrder,
  getAllOrderHistoryFromDB,
  paymentSuccessRedirect,
  paymentFailRedirect,
  paymentCancelRedirect
};