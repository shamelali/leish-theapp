import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function PaymentScreen({ route, navigation }: any) {
  const { booking } = route.params;

  function handlePayment() {
    Alert.alert('Payment Successful!', 'Your booking is confirmed. Receipt sent to email.', [
      { text: 'OK', onPress: () => navigation.navigate('Home') }
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Amount to Pay</Text>
        <Text style={styles.amount}>RM{booking.total_amount}</Text>
        <Text style={styles.bookingId}>Booking ID: {booking.id.substring(0, 8)}</Text>
      </View>

      <TouchableOpacity style={styles.fpxButton}>
        <Text style={styles.buttonText}>💳 Pay with FPX</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardButton}>
        <Text style={styles.buttonText}>💳 Pay with Card</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ewalletButton}>
        <Text style={styles.buttonText}>📱 Pay with E-Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.mockButton} onPress={handlePayment}>
        <Text style={styles.mockButtonText}>✅ Mock Payment (Demo)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  card: { 
    backgroundColor: '#f9f9f9', 
    padding: 24, 
    borderRadius: 12, 
    marginBottom: 24,
    alignItems: 'center'
  },
  label: { fontSize: 16, color: '#666' },
  amount: { fontSize: 42, fontWeight: 'bold', color: '#e91e63', marginTop: 8 },
  bookingId: { fontSize: 12, color: '#999', marginTop: 8 },
  fpxButton: { 
    backgroundColor: '#4CAF50', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  cardButton: { 
    backgroundColor: '#2196F3', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  ewalletButton: { 
    backgroundColor: '#FF9800', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  mockButton: { 
    backgroundColor: '#9C27B0', 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 24 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  mockButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  }
});
