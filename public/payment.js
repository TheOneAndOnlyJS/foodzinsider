const stripe = Stripe('pk_test_51May9dSDxJRIdwCCM8LvOKNvmDnr670ndwVRomWJpa5xmrd2FOKnyZFBldcRkDNMWsFlZTnEIH9e3rojPQRwPHKN00sY4CIWAb');
const quantity = document.getElementById('quantity');

document.getElementById('payment_button').addEventListener('click', (e) => {
  e.preventDefault();

  fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantity: quantity.value
    })
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch session');
    }
    return res.json();
  })
  .then((session) => {
    stripe.redirectToCheckout({ sessionId: session.id })
  })
  .catch((error) => {
    console.error(error);
  });

});
