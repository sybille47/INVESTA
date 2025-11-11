// Temp script: call postOrders directly to reproduce server-side error
const { postOrders } = require('../models/messages');

async function run() {
  try {
    const sample = {
      isin: 'LU1700000001',
      amount: '1000',
      units: '',
      order_type: 'Subscription',
      trade_date: '2025-10-10',
      auth0UserId: 'auth0|localtest'
    };

    console.log('Running postOrders repro with sample:', sample);
    const res = await postOrders(
      sample.isin,
      sample.amount,
      sample.units,
      sample.order_type,
      sample.trade_date,
      sample.auth0UserId
    );
    console.log('postOrders result:', res);
  } catch (err) {
    console.error('postOrders repro error:', err);
    process.exit(1);
  }
}

run();
