import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useAppStore } from '../stores/appStore';
import { supabase } from '../lib/supabase';

export default function BookingScreen({ navigation }: any) {
  const selectedMUA = useAppStore(state => state.selectedMUA);
  const selectedService = useAppStore(state => state.selectedService);
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-03-15');
  const [bookingTime, setBookingTime] = useState('10:00');

  async function handleBooking() {
    if (!clientName || !clientEmail || !clientPhone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const { data, error } = await supabase
      .from('leish_bookings')
      .insert({
        mua_id: selectedMUA.id,
        service_id: selectedService.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        total_amount: selectedService.price,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Success!', 'Booking created! Proceeding to payment...', [
      { text: 'OK', onPress: () => navigation.navigate('Payment', { booking: data }) }
    ]);
  }

  if (!selectedMUA || !selectedService) {
    return (
      <View style={styles.container}>
        <Text>No service selected</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>
      
      <View style={styles.summaryCard}>
        <Text style={styles.muaName}>{selectedMUA.display_name}</Text>
        <Text style={styles.serviceName}>{selectedService.title}</Text>
        <Text style={styles.price}>RM{selectedService.price}</Text>
      </View>

      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        placeholder=\"Enter your name\"
        value={clientName}
        onChangeText={setClientName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder=\"your@email.com\"
        keyboardType=\"email-address\"
        value={clientEmail}
        onChangeText={setClientEmail}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder=\"+60123456789\"
        keyboardType=\"phone-pad\"
        value={clientPhone}
        onChangeText={setClientPhone}
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder=\"YYYY-MM-DD\"
        value={bookingDate}
        onChangeText={setBookingDate}
      />

      <Text style={styles.label}>Time</Text>
      <TextInput
        style={styles.input}
        placeholder=\"HH:MM\"
        value={bookingTime}
        onChangeText={setBookingTime}
      />

      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  summaryCard: { 
    backgroundColor: '#f9f9f9', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 24 
  },
  muaName: { fontSize: 20, fontWeight: 'bold' },
  serviceName: { fontSize: 16, color: '#666', marginTop: 4 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#e91e63', marginTop: 8 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: { 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    paddingHorizontal: 16 
  },
  bookButton: { 
    backgroundColor: '#e91e63', 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 32,
    marginBottom: 32
  },
  bookButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  }
});
