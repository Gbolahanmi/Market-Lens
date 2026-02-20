"use client";

import { useNotification } from "@/hooks/useNotification";
import { useToast } from "@/context/ToastContext";

/**
 * Example component showing all toast notification usage patterns
 * This can be used as a reference for implementing notifications throughout your app
 */

export default function NotificationExamples() {
  const notify = useNotification();
  const { addToast } = useToast();

  const handleSuccessExample = () => {
    notify.success("Awesome!", "Your changes have been saved");
  };

  const handleErrorExample = () => {
    notify.error("Oops!", "Something went wrong. Please try again");
  };

  const handleWarningExample = () => {
    notify.warning("Be careful", "This action cannot be undone");
  };

  const handleInfoExample = () => {
    notify.info("FYI", "Check out our new menu items!");
  };

  const handleLongDurationExample = () => {
    notify.success("Custom Duration", "This toast lasts 6 seconds", 6000);
  };

  const handleActionExample = () => {
    addToast({
      type: "error",
      title: "Address Failed",
      message: "Could not save your address",
      duration: 0, // Don't auto-dismiss
      action: {
        label: "Retry",
        onClick: () => {
          // console.log("Retrying address save...");
          notify.success("Address saved!", "Your address has been updated");
        },
      },
    });
  };

  const handleCheckoutExample = () => {
    addToast({
      type: "success",
      title: "Order Placed!",
      message: "Order #SKU123456 confirmed - Delivery in 30-45 mins",
      duration: 5000,
      action: {
        label: "Track Order",
        onClick: () => {
          console.log("Opening order tracking...");
        },
      },
    });
  };

  const handleMultipleToasts = () => {
    notify.info("Processing", "Validating your order...");
    setTimeout(() => {
      notify.success("Success!", "Order confirmed");
    }, 1000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Toast Notification Examples</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Success */}
        <button
          onClick={handleSuccessExample}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition"
        >
          Success Toast
        </button>

        {/* Error */}
        <button
          onClick={handleErrorExample}
          className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition"
        >
          Error Toast
        </button>

        {/* Warning */}
        <button
          onClick={handleWarningExample}
          className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold transition"
        >
          Warning Toast
        </button>

        {/* Info */}
        <button
          onClick={handleInfoExample}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition"
        >
          Info Toast
        </button>

        {/* Long Duration */}
        <button
          onClick={handleLongDurationExample}
          className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold transition"
        >
          6-Second Toast
        </button>

        {/* With Action */}
        <button
          onClick={handleActionExample}
          className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition"
        >
          With Retry Action
        </button>

        {/* Checkout Example */}
        <button
          onClick={handleCheckoutExample}
          className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold transition"
        >
          Order Placed Toast
        </button>

        {/* Multiple Toasts */}
        <button
          onClick={handleMultipleToasts}
          className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-semibold transition"
        >
          Sequential Toasts
        </button>
      </div>

      {/* Usage Guide */}
      <div className="mt-12 space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-3">Quick Usage</h2>
          <pre className="bg-white p-4 rounded border overflow-auto text-sm">
            {`import { useNotification } from "@/hooks/useNotification";

const notify = useNotification();

// Success
notify.success("Title", "Message", 3000);

// Error
notify.error("Title", "Message");

// Warning  
notify.warning("Title", "Message");

// Info
notify.info("Title", "Message");`}
          </pre>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-3">With Actions</h2>
          <pre className="bg-white p-4 rounded border overflow-auto text-sm">
            {`import { useToast } from "@/context/ToastContext";

const { addToast } = useToast();

addToast({
  type: "error",
  title: "Failed",
  message: "Could not save",
  duration: 0,
  action: {
    label: "Retry",
    onClick: () => {
      // Handle retry
    },
  },
});`}
          </pre>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold mb-3 text-blue-900">
            Common Use Cases
          </h2>
          <ul className="text-blue-900 space-y-2">
            <li>✅ Cart notifications (already integrated)</li>
            <li>✅ Address save/delete confirmation</li>
            <li>✅ Order placement feedback</li>
            <li>✅ Form submission status</li>
            <li>✅ Payment processing updates</li>
            <li>✅ Favorites add/remove confirmation</li>
            <li>✅ Error handling & recovery prompts</li>
            <li>✅ User feedback & guidance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
