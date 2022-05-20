const stripe = require("stripe")(
  "sk_test_51Iv1hbD489m64q12QrI9v1Y4thevYkZzFNe2NrhRFe8tLqxnmt1JlW042EH5QHFHTw42Qj4uLs7ABMS0PlzVoHWX00Y9BjjaMs"
);

const Keyv = require("keyv");
const keyv = new Keyv();
const express = require("express");
const app = express();
app.use(express.json());

const init_keys = async () => {
  await keyv.set("account1", "acct_1KschORWL68Q24XD");
  await keyv.set("account2", "acct_1KschORWL68Q24XD");
  await keyv.set("customer1", "cus_L04hg8yJ6MAiIj");
  console.log("Key Value Initialized!!");
};

app.get("/create_account", async (req, res) => {
  console.log("Called GET");
  var currentDateTime = new Date();
  const new_account = await stripe.accounts.create({
    country: "US",
    type: "custom",
    email: "test1@test.com",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: "individual",
    business_profile: {
      url: "https://helpt.app/",
      mcc: "7299",
    },
    individual: {
      address: {
        line1: "7664 Behm Rd",
        city: "West Falls",
        state: "New York",
        postal_code: "14214",
      },
      dob: {
        day: "15",
        month: "10",
        year: "1996",
      },
      email: "test1@test.com",
      first_name: "Custom Test",
      last_name: "Surname 988",
      phone: "+17160001101",
      ssn_last_4: "0000",
    },
    tos_acceptance: {
      date: Math.round(currentDateTime.getTime() / 1000),
      ip: req.connection.remoteAddress,
    },
    external_account: {
      object: "bank_account",
      country: "US",
      currency: "usd",
      account_holder_name: "Account 1",
      account_holder_type: "individual",
      routing_number: "110000000",
      account_number: "000111111116",
    },
  });

  console.log(new_account);
  res.send({
    new_account,
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
  const account1 = await keyv.get("account1");

  /**const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    customer: cust,
    payment_method: "pm_1KkcsgD489m64q12OM128goS",
    off_session: true,
    confirm: true,
  });

  console.log(paymentIntent);*/

  /*const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    customer: cust,
    setup_future_usage: "on_session",
    automatic_payment_methods: {
      enabled: true,
    },
  });*/

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    customer: cust,
    setup_future_usage: "on_session",
    automatic_payment_methods: {
      enabled: true,
    },
    transfer_data: {
      amount: 677,
      destination: account1,
    },
  });

  console.log(paymentIntent);

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

app.listen(8090, () => {
  console.log("Server Listening on Port 8090 ....");
  init_keys();
});
