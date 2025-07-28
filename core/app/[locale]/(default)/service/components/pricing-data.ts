export const pricingData = {
  storage: {
    leftColumn: [
      { label: 'Grace period', value: '7 days' },
      { label: 'Daily storage fee', value: '$5/day' },
      { label: 'Extended storage', value: 'By arrangement' }
    ],
    rightColumn: [
      { label: 'Service completion', value: 'Pickup required' },
      { label: 'Service on hold', value: 'Pickup required' },
      { label: 'Notification', value: "We'll contact you" }
    ],
    noteTitle: 'Storage Policy',
    noteText: 'Storage fees apply after 7-day grace period. Extended storage requires prior arrangement.'
  },
  laborRates: {
    leftColumn: [
      { label: 'Hourly rate', value: '$120/hr' },
      { label: 'Minimum charge', value: '$35' },
      { label: 'Emergency service', value: '$150/hr' }
    ],
    rightColumn: [
      { label: 'Diagnostic fee', value: '$35' },
      { label: 'Weekend service', value: 'By appointment' },
      { label: 'Service hours', value: 'Mon-Fri 9AM-6PM' }
    ],
    noteTitle: 'Labor Rates',
    noteText: 'Rates are subject to change. Emergency and weekend service available at premium rates.'
  },
  setRates: {
    leftColumn: [
      { label: 'Tire/Tube replacement', value: '$65/tire' },
      { label: 'Scooter suspension lowering', value: '$100' },
      { label: 'Install fingerprint sensor', value: '$35' },
      { label: 'Install new brake system', value: '$280' }
    ],
    rightColumn: [
      { label: 'Remove stripped screws', value: '$15ea.' },
      { label: 'Brake bleeding', value: '$60' },
      { label: 'General inspection', value: '$60' },
      { label: 'Tune-up', value: '$60' }
    ],
    noteTitle: 'Fixed Pricing',
    noteText: 'All prices are estimates and subject to change. We\'ll provide a detailed quote before starting work.'
  }
}; 