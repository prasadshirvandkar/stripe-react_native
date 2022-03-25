const stripe = require("stripe")("{{STRIPE_SECRET_KEY}}");

const Keyv = require("keyv");
const keyv = new Keyv();
const express = require("express");
const app = express();
app.use(express.json());

const init_keys = async () => {
  await keyv.set("account1", "acct_1KgIjbPhD2uKPGHX");
  await keyv.set("account2", "acct_1KgIKrPhZ1zVpl9q");
  await keyv.set("account3", "acct_1KgH0L2fZiolSwtF");
  await keyv.set("customer1", "cus_LNmucu9b4Pg1ti");
  console.log("Key Value Initialized!!");
};

const paymentMethods = [
  "ach_credit_transfer",
  "card",
  "klarna",
  "afterpay_clearpay",
];

app.get("/create_account", async (req, res) => {
  console.log("Called GET");
  const new_account = await stripe.accounts.create({
    country: "US",
    type: "express",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: "individual",
    business_profile: { url: "https://prasadshirvandkar.github.io/" },
  });
  console.log(new_account);
  res.send({
    paymentIntent: new_account.id,
  });
});

app.get("/create_customer", async (req, res) => {
  const customer = await stripe.customers.create();
  console.log(customer);
  res.send({
    message: "Success",
  });
});

app.get("/get_cards", async (req, res) => {
  const cust = await keyv.get("customer1");
  const payment_methods = await stripe.paymentMethods.list({
    customer: cust,
    type: "card",
  });
  res.send({
    paymentMethods: payment_methods,
  });
});

app.post("/create_payment_intent", async (req, res) => {
  console.log("Hitted URL");
  const cust = await keyv.get("customer1");
  /*const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'usd',
    customer: cust,
    payment_method: 'pm_1KhEvqCangI7u3VMrPUUaVEX',
    off_session: true,
    confirm: true,
  });*/
  /*
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'usd',
    customer: cust,
    setup_future_usage: 'on_session',
    automatic_payment_methods: {
      enabled: true,
    },
  });*/

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    customer: cust,
    setup_future_usage: "on_session",
    payment_method_types: ["card"],
    transfer_data: {
      amount: 677,
      destination: "acct_1KhF1a2SrRftt3Df",
    },
  });

  res.send({
    paymentIntent: paymentIntent.client_secret,
    customer: cust,
  });

  /*var helper_name = req.body.helper;
  if (helper_name != null || helper_name != undefined || helper_name != '') {
    var account = await keyv.get(helper_name);
    console.log('Account: ', account);

    if (account == null || account == undefined) {
      const new_account = await stripe.accounts.create({type: 'express'});
      account = new_account.id;
      await keyv.set(req.body.helper, account);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'usd',
      transfer_data: {
        amount: 677,
        destination: account,
      },
    });

    res.send({
      paymentIntent: paymentIntent.client_secret,
    });
  } else {
    res.send({
      paymentIntent:
        'pi_3KfswSGRg3jHeyqJ356v4yR0_secret_YxCKQVneOtMR4fNRfqwZoVCBk',
    });
  }*/
});

app.listen(3000, () => {
  console.log("Server Listening on Port 3000 ....");
  init_keys();
});
