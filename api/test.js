const payment_methods = [{ id: "ou1h3rgh2r" }];

const get_result = async () => {
  return {
    success: true,
    id: "asfast23f",
  };
};

console.log({
  amount: 1000,
  currency: "usd",
  customer: "asfasfasf",
  ...(!payment_methods.length
    ? {
        setup_future_usage: "on_session",
        automatic_payment_methods: {
          enabled: true,
        },
      }
    : {
        payment_method: payment_methods[0].id,
        off_session: true,
        confirm: true,
      }),
  transfer_data: {
    amount: 866,
    destination: "acct_1KhF1a2SrRftt3Df",
  },
});

const call_func = async () => {
  const res = await get_result();
  console.log(res);
};

call_func();
