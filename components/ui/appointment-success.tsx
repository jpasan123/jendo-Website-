import { CheckCircle } from 'lucide-react';

interface AppointmentSuccessProps {
  onClose: () => void;
}

export function AppointmentSuccess({ onClose }: AppointmentSuccessProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Appointment Successfully Booked!
          </h3>
          
          <p className="text-gray-600 mb-8">
            Thank you for booking an appointment with us. We will contact you soon to confirm the details.
          </p>

          <button 
            onClick={onClose}
            className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            Close and Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}