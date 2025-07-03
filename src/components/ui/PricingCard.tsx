'use client'

import { Check, X } from 'lucide-react'
import { PRICING_PLANS, PricingPlan } from '@/lib/stripe'

interface PricingCardProps {
  plan: PricingPlan
  isPopular?: boolean
  onSelectPlan: (plan: PricingPlan) => void
}

export function PricingCard({ plan, isPopular = false, onSelectPlan }: PricingCardProps) {
  const planData = PRICING_PLANS[plan]
  
  return (
    <div className={`relative rounded-2xl border p-8 shadow-sm ${
      isPopular 
        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500' 
        : 'border-gray-200 bg-white'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            人気プラン
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {planData.name}
        </h3>
        
        <div className="mt-4 flex items-baseline justify-center">
          <span className="text-4xl font-bold tracking-tight text-gray-900">
            ¥{planData.price.toLocaleString()}
          </span>
          {planData.price > 0 && (
            <span className="text-sm font-medium text-gray-500 ml-1">
              /月
            </span>
          )}
        </div>
        
        {planData.price === 0 && (
          <p className="mt-2 text-sm text-gray-500">
            永久無料
          </p>
        )}
      </div>
      
      <ul className="mt-8 space-y-3">
        {planData.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
        
        {planData.limitations.map((limitation, index) => (
          <li key={index} className="flex items-start">
            <X className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-500">{limitation}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => onSelectPlan(plan)}
        className={`mt-8 w-full rounded-lg py-3 px-4 text-center text-sm font-semibold transition-colors ${
          isPopular
            ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            : planData.price === 0
            ? 'bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-100'
            : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50'
        }`}
      >
        {planData.price === 0 ? '無料で始める' : 'プランを選択'}
      </button>
      
      {planData.price > 0 && (
        <p className="mt-4 text-xs text-center text-gray-500">
          いつでもキャンセル可能
        </p>
      )}
    </div>
  )
}