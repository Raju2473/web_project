import { useEffect, useMemo, useState } from 'react'
import UserLayout from '../../layout/UserLayout'
import { PageShell, Panel, LoadingBlock } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatUnits } from '../../utils/formatters'

export default function PlansPage() {
  const { auth } = useAuth()
  const [plans, setPlans] = useState([])
  const [recommended, setRecommended] = useState([])
  const [orderInfo, setOrderInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buyingId, setBuyingId] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [planRes, recommendedRes] = await Promise.all([
          powerpulseApi.getRechargePlans(),
          powerpulseApi.getUsagePredictPlans().catch(() => ({ plans: [] }))
        ])
        setPlans(planRes.plans || [])
        setRecommended(recommendedRes.plans || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const combinedRecommended = useMemo(() => recommended.length ? recommended : plans.filter((p) => p.isRecommended), [recommended, plans])

  async function handleBuy(plan) {
    setBuyingId(plan.id)
    setError('')
    setOrderInfo(null)
    try {
      const baseAmount = Number(plan.amount || 0)
      const taxAmount = Number((baseAmount * 0.18).toFixed(2))
      const totalAmount = Number((baseAmount + taxAmount).toFixed(2))
      const order = await powerpulseApi.createRechargeOrder({
        consumerNo: auth.consumerNo,
        planId: plan.id,
        paymentMethod: 'UPI',
        baseAmount,
        taxAmount,
        totalAmount,
        unitsSnapshot: plan.units,
        validityDaysSnapshot: plan.validityDays,
        planNameSnapshot: plan.planName
      })
      await powerpulseApi.updateRechargeOrderStatus({
        orderId: order.orderId,
        paymentStatus: 'SUCCESS',
        transactionRef: `WEB-${Date.now()}`
      })
      const finalOrder = await powerpulseApi.getRechargeOrder(order.orderId)
      setOrderInfo(finalOrder.order)
    } catch (err) {
      setError(err.message)
    } finally {
      setBuyingId(null)
    }
  }

  return (
    <UserLayout>
      <PageShell title="Recharge plans" subtitle="Uses the same recharge plan and order endpoints from your Flask backend.">
        {loading ? <LoadingBlock label="Loading plans..." /> : error ? <div className="error-box">{error}</div> : (
          <>
            {combinedRecommended.length ? (
              <Panel title="Recommended plans" subtitle="Usage-based suggestions">
                <div className="card-grid">
                  {combinedRecommended.map((plan) => (
                    <div className="plan-card featured" key={`rec-${plan.id}`}>
                      <span className="pill">{plan.tag || 'Recommended'}</span>
                      <h3>{plan.planName}</h3>
                      <strong>{formatCurrency(plan.amount)}</strong>
                      <p>{formatUnits(plan.units)} • {plan.validityDays} days</p>
                    </div>
                  ))}
                </div>
              </Panel>
            ) : null}

            <div className="card-grid">
              {plans.map((plan) => (
                <div className="plan-card" key={plan.id}>
                  <span className="pill">{plan.tag || 'Plan'}</span>
                  <h3>{plan.planName}</h3>
                  <strong>{formatCurrency(plan.amount)}</strong>
                  <p>{formatUnits(plan.units)}</p>
                  <small>Validity: {plan.validityDays} days</small>
                  <button className="primary-button" onClick={() => handleBuy(plan)} disabled={buyingId === plan.id}>
                    {buyingId === plan.id ? 'Processing...' : 'Buy this plan'}
                  </button>
                </div>
              ))}
            </div>

            {orderInfo ? (
              <Panel title="Latest order summary" subtitle="Simulated success flow using current recharge order APIs">
                <div className="detail-list">
                  <div><span>Order reference</span><strong>{orderInfo.orderRef}</strong></div>
                  <div><span>Plan</span><strong>{orderInfo.planNameSnapshot}</strong></div>
                  <div><span>Total amount</span><strong>{formatCurrency(orderInfo.totalAmount)}</strong></div>
                  <div><span>Payment status</span><strong>{orderInfo.paymentStatus}</strong></div>
                  <div><span>Units</span><strong>{formatUnits(orderInfo.unitsSnapshot)}</strong></div>
                </div>
              </Panel>
            ) : null}
          </>
        )}
      </PageShell>
    </UserLayout>
  )
}
