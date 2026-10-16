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
  ArrowRight,
  Check,
  X,
  FileText
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
  const [annualBilling, setAnnualBilling] = useState(false);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);

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
      const orderRes = await api.createOrder({
        planTier: plan.id,
        notes: {
          userEmail: user?.email || 'guest@agrominds.local',
          billingCycle: annualBilling ? 'annual' : 'seasonal'
        }
      });

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to create payment order');
      }

      const orderData = orderRes.data;

      if (!orderData.isSimulated && window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'AgroMinds Platform',
          description: plan.name,
          order_id: orderData.orderId,
          handler: async function (response) {
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
          theme: { color: '#0f291e' }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setError(`Payment rejected: ${resp.error.description}`);
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Open simulated test checkout dialog
        setShowSimulatedModal(true);
        setTimeout(async () => {
          await verifyPaymentOnServer({
            orderId: orderData.orderId,
            paymentId: `pay_sim_${Date.now()}`,
            signature: 'simulated_test_signature'
          });
          setShowSimulatedModal(false);
        }, 1800);
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize payment.');
      setProcessing(false);
      setShowSimulatedModal(false);
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
          planName: activePlan?.name,
          amount: activePlan?.amount ? activePlan.amount / 100 : 499,
          isSimulated: res.data.isSimulated,
          notice: res.data.notice || 'Cryptographic signature verified successfully by backend server.'
        });

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
      {/* HEADER & BILLING TOGGLE */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
          Transparent Razorpay Sandbox
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-forest-950">
          Agricultural Testing & Advisory Passes
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
          Explore certified soil health cards, personalized agronomist consultation passes, and multi-plot farm management with zero financial risk in test mode.
        </p>

        {/* Billing cycle pill */}
        <div className="inline-flex items-center gap-3 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold mt-2">
          <button
            type="button"
            onClick={() => setAnnualBilling(false)}
            className={`px-4 py-2 rounded-xl transition ${
              !annualBilling ? 'bg-white text-forest-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Single Crop Season
          </button>
          <button
            type="button"
            onClick={() => setAnnualBilling(true)}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              annualBilling ? 'bg-forest-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Annual Kisan Pass</span>
            <span className="text-[10px] bg-emerald-400 text-forest-950 px-1.5 py-0.2 rounded-md font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* CONFIRMED RECEIPT CARD */}
      {paymentResult && (
        <div className="p-6 sm:p-8 bg-emerald-50 border border-emerald-200 rounded-3xl max-w-2xl mx-auto space-y-4 shadow-sm animate-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span className="text-base">Payment Verified & Order Confirmed!</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
              {paymentResult.isSimulated ? 'Simulated Sandbox' : 'Razorpay Verified'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-stone-700 bg-white/70 p-4 rounded-2xl border border-emerald-200/60">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Order ID</span>
              <span className="font-mono font-bold text-stone-900">{paymentResult.orderId}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Payment Ref</span>
              <span className="font-mono font-bold text-stone-900">{paymentResult.paymentId}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Package</span>
              <span className="font-semibold text-stone-900">{paymentResult.planName}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Amount</span>
              <span className="font-bold text-emerald-800">₹{paymentResult.amount} (INR)</span>
            </div>
          </div>

          <p className="text-xs text-emerald-800 font-medium">
            {paymentResult.notice}
          </p>

          <button
            onClick={() => setPaymentResult(null)}
            className="text-xs font-bold text-emerald-900 underline block"
          >
            Dismiss Receipt
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl max-w-2xl mx-auto text-xs text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* PRICING CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {loading ? (
          <div className="col-span-3 text-center py-20 text-stone-500 text-sm">
            Loading consultation plans...
          </div>
        ) : (
          plans.map((p) => {
            const isFeatured = p.id === 'expert_soil_kit';
            const basePrice = p.amount / 100;
            const finalPrice = annualBilling ? Math.round(basePrice * 12 * 0.8) : basePrice;

            return (
              <div
                key={p.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isFeatured
                    ? 'bg-gradient-to-b from-forest-900 to-forest-950 text-white shadow-2xl ring-2 ring-emerald-400'
                    : 'bg-white text-stone-900 border border-stone-200 shadow-xs hover:shadow-lg'
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-400 text-forest-950 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    Most Popular Choice
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className={`font-serif text-xl font-bold ${isFeatured ? 'text-white' : 'text-forest-950'}`}>
                      {p.name}
                    </h3>
                    <p className={`text-xs mt-1.5 leading-relaxed ${isFeatured ? 'text-stone-300' : 'text-stone-500'}`}>
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ₹{finalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className={`text-xs ml-1.5 ${isFeatured ? 'text-emerald-300' : 'text-stone-400'}`}>
                      / {annualBilling ? 'year' : 'season'}
                    </span>
                  </div>

                  <ul className={`space-y-3 text-xs pt-5 border-t ${isFeatured ? 'border-forest-800' : 'border-stone-100'}`}>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isFeatured ? 'text-emerald-400' : 'text-emerald-700'}`} />
                      <span>Priority AI agronomist inference</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isFeatured ? 'text-emerald-400' : 'text-emerald-700'}`} />
                      <span>Customized NPK nutrient charts</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isFeatured ? 'text-emerald-400' : 'text-emerald-700'}`} />
                      <span>Official test sandbox receipt & invoice</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isFeatured ? 'text-emerald-400' : 'text-emerald-700'}`} />
                      <span>Soil microbiome diagnostic report</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleInitiatePayment(p)}
                    disabled={processing}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs active:scale-98 ${
                      isFeatured
                        ? 'bg-emerald-400 text-forest-950 hover:bg-emerald-300'
                        : 'bg-forest-900 text-white hover:bg-forest-850'
                    }`}
                  >
                    {processing && activePlan?.id === p.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Sandbox Payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Test Checkout (₹{finalPrice})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* COMPARISON MATRIX TABLE */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-6 sm:p-8">
        <h3 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2">
          <FileText className="w-5 h-5 text-forest-700" />
          <span>Feature Comparison Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-bold">
              <tr>
                <th className="p-3">Feature</th>
                <th className="p-3 text-center">Free Community</th>
                <th className="p-3 text-center">Pro Agronomist</th>
                <th className="p-3 text-center text-emerald-800">Lab Soil Kit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="p-3 font-semibold text-stone-800">AI Agriculture Queries</td>
                <td className="p-3 text-center">Standard Quota</td>
                <td className="p-3 text-center font-bold text-emerald-700">Unlimited Priority</td>
                <td className="p-3 text-center font-bold text-emerald-700">Unlimited Priority</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-800">Crop Knowledge Base</td>
                <td className="p-3 text-center">Full Access</td>
                <td className="p-3 text-center">Full Access</td>
                <td className="p-3 text-center">Full Access</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-800">Physical Lab Soil Testing</td>
                <td className="p-3 text-center"><X className="w-4 h-4 mx-auto text-stone-300" /></td>
                <td className="p-3 text-center"><X className="w-4 h-4 mx-auto text-stone-300" /></td>
                <td className="p-3 text-center"><Check className="w-4 h-4 mx-auto text-emerald-600 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-800">Custom Fertigation Schedule</td>
                <td className="p-3 text-center"><X className="w-4 h-4 mx-auto text-stone-300" /></td>
                <td className="p-3 text-center"><Check className="w-4 h-4 mx-auto text-emerald-600 font-bold" /></td>
                <td className="p-3 text-center"><Check className="w-4 h-4 mx-auto text-emerald-600 font-bold" /></td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-stone-800">Multi-Plot Mapping</td>
                <td className="p-3 text-center"><X className="w-4 h-4 mx-auto text-stone-300" /></td>
                <td className="p-3 text-center"><X className="w-4 h-4 mx-auto text-stone-300" /></td>
                <td className="p-3 text-center"><Check className="w-4 h-4 mx-auto text-emerald-600 font-bold" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SIMULATED MODAL ANIMATION */}
      {showSimulatedModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="font-serif text-lg font-bold text-forest-950">
              Processing Sandbox Order
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Verifying cryptographic HMAC SHA-256 signature with the backend payment service...
            </p>
            <div className="p-2.5 bg-sand-50 rounded-xl text-[11px] text-stone-600 font-mono">
              [Razorpay Test Gateway Simulator]
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
