import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';

const StripeIntegration = () => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      `http://192.168.1.168:3000/create_payment_intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          helper: 'account1',
        }),
      },
    );
    const {paymentIntent, customer} = await response.json();

    console.log('Response', paymentIntent);

    return {
      paymentIntent,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, customer} = await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      customerId: customer,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      merchantDisplayName: 'Helpt',
      testEnv: true,
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    console.log('Pressed');
    const {error} = await presentPaymentSheet();

    Toast.show({
      type: error ? 'error' : 'success',
      text1: error
        ? `Error code: ${error.code} ${error.message}`
        : `Payment Success`,
    });
  };

  useEffect(() => {}, []);

  return (
    <StripeProvider
      publishableKey="{{PUBLISHER_KEY}}"
      merchantIdentifier="merchant1234124">
      <SafeAreaView>
        <View style={{margin: 8}}>
          <TouchableOpacity
            style={styles.SubmitButtonStyle}
            activeOpacity={0.7}
            onPress={openPaymentSheet}>
            <Text style={styles.TextStyle}> Make Payment </Text>
          </TouchableOpacity>
        </View>
        <View style={{margin: 10}}>
          <Button title="Init Payment" onPress={initializePaymentSheet} />
        </View>
      </SafeAreaView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  SubmitButtonStyle: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: '#00BCD4',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default StripeIntegration;
