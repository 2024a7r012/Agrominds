import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function PaymentPage() {
  const { isAuthenticated, user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState(null);

  // Load plans
  useEffect(() => {
    api.getPlans()
      .then((res) => {
        if (res.success && res.data) {
          setPlans(res.data);
        }
      })
      .catch((err) => setError('Failed to load pricing tiers.'))
      .finally(() => setLoading(false));

    if (isAuthenticated) {
      api.getPaymentHistory()
        .then((res) => {
          if (res.success && res.data) {
            setHistory(res.data);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleInitiatePayment = async (plan) => {
    setError(null);
    setPaymentResult(null);
    setActivePlan(plan);
    setProcessing(true);

    try {
      // 1. Create order on backend
      const orderRes = await api.createOrder({
        planTier: plan.id,
        notes: { userEmail: user?.email || 'guest@agrominds.local' }
      });

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to create payment order');
      }

      const orderData = orderRes.data;

      // Check if real Razorpay keys are configured and available in window
      if (!orderData.isSimulated && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'AgroMinds Platform',
          description: plan.name,
          order_id: orderData.orderId,
          handler: async function (response) {
            // Verify signature on backend
            verifyPaymentOnServer({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
          },
          prefill: {
            name: user?.user_metadata?.full_name || 'Farmer',
            email: user?.email || 'farmer@agrominds.org'
          },
          theme: { color: '#1b4332' }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setError(`Payment failed: ${resp.error.description}`);
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Simulated test mode verification flow
        setTimeout(async () => {
          await verifyPaymentOnServer({
            orderId: orderData.orderId,
            paymentId: `pay_sim_${Date.now()}`,
            signature: 'simulated_test_signature'
          });
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize payment.');
      setProcessing(false);
    }
  };

  const verifyPaymentOnServer = async ({ orderId, paymentId, signature }) => {
    try {
      const res = await api.verifyPayment({ orderId, paymentId, signature });
      if (res.success && res.data) {
        setPaymentResult({
          status: 'success',
          orderId,
          paymentId,
          isSimulated: res.data.isSimulated,
          notice: res.data.notice || 'Cryptographic signature verified successfully by backend server.'
        });

        // Refresh history
        if (isAuthenticated) {
          api.getPaymentHistory().then((r) => r.success && setHistory(r.data));
        }
      } else {
        setError('Cryptographic signature verification failed.');
      }
    } catch (err) {
      setError(err.message || 'Payment verification failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
          Transparent Razorpay Sandbox
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
          Soil Testing & Advisory Consultation Plans
        </h1>
        <p className="text-sm text-stone-600">
          Test-mode enabled. All transactions utilize the Razorpay test sandbox or verified cryptographic mock validation without charging live funds.
        </p>
      </div>

      {/* Result Alert */}
      {paymentResult && (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-2xl mx-auto space-y-3 shadow-xs animate-in zoom-in-95">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Payment Verified & Order Confirmed!</span>
          </div>
          <div className="text-xs text-stone-700 space-y-1">
            <p><strong>Order Reference:</strong> {paymentResult.orderId}</p>
            <p><strong>Payment Reference:</strong> {paymentResult.paymentId}</p>
            <p className="text-emerald-700 font-medium">{paymentResult.notice}</p>
          </div>
          <button
            onClick={() => setPaymentResult(null)}
            className="text-xs font-semibold text-emerald-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl max-w-2xl mx-auto text-xs text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {loading ? (
          <div className="col-span-3 text-center py-16 text-stone-500 text-sm">
            Loading consultation plans...
          </div>
        ) : (
          plans.map((p) => {
            const isFeatured = p.id === 'expert_soil_kit';
            return (
              <div
                key={p.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition relative ${
                  isFeatured
                    ? 'bg-forest-900 text-white shadow-xl ring-2 ring-emerald-400'
                    : 'bg-white text-stone-900 border border-stone-200 shadow-xs hover:shadow-md'
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-400 text-forest-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className={`font-serif text-xl font-bold ${isFeatured ? 'text-white' : 'text-forest-950'}`}>
                      {p.name}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${isFeatured ? 'text-stone-300' : 'text-stone-500'}`}>
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-3xl font-extrabold tracking-tight">
                      {p.displayPrice}
                    </span>
                    <span className={`text-xs ml-1 ${isFeatured ? 'text-stone-300' : 'text-stone-400'}`}>
                      / per season
                    </span>
                  </div>

                  <ul className={`space-y-2.5 text-xs pt-4 border-t ${isFeatured ? 'border-forest-800' : 'border-stone-100'}`}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${isFeatured ? 'text-emerald-400' : 'text-forest-700'}`} />
                      <span>Priority AI agronomist prompt processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${isFeatured ? 'text-emerald-400' : 'text-forest-700'}`} />
                      <span>Custom NPK nutrient chart generator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${isFeatured ? 'text-emerald-400' : 'text-forest-700'}`} />
                      <span>Official test mode receipt & invoice</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleInitiatePayment(p)}
                    disabled={processing}
                    className={`w-full py-3 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                      isFeatured
                        ? 'bg-emerald-400 text-forest-950 hover:bg-emerald-300'
                        : 'bg-forest-900 text-white hover:bg-forest-800'
                    }`}
                  >
                    {processing && activePlan?.id === p.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Sandbox Order...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Test Checkout ({p.displayPrice})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Security notice banner */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-sand-100 border border-stone-200 text-xs text-stone-600 flex items-center gap-3">
        <Lock className="w-5 h-5 text-forest-800 shrink-0" />
        <div>
          <span className="font-bold text-stone-800">Security Architecture:</span> Orders are validated server-side using HMAC SHA-256 signatures. No raw card or UPI details are stored or transmitted through our frontend.
        </div>
      </div>

      {/* Transaction History (if authenticated) */}
      {isAuthenticated && history.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4 pt-6">
          <h3 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-forest-700" />
            <span>Recent Test Orders & Verification Logs</span>
          </h3>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="p-3.5 font-mono text-[11px] text-stone-800">{item.orderId}</td>
                    <td className="p-3.5 font-medium">{item.planTier}</td>
                    <td className="p-3.5 font-bold">₹{item.amount}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
