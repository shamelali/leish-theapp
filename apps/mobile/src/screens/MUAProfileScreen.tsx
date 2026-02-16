import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../stores/appStore';

export default function MUAProfileScreen({ route, navigation }: any) {
  const { mua } = route.params;
  const [services, setServices] = useState<any[]>([]);
  const setSelectedMUA = useAppStore(state => state.setSelectedMUA);
  const setSelectedService = useAppStore(state => state.setSelectedService);

  useEffect(() => {
    loadServices();
    setSelectedMUA(mua);
  }, []);

  async function loadServices() {
    const { data } = await supabase
      .from('leish_services')
      .select('*')
      .eq('mua_id', mua.id);
    
    if (data) setServices(data);
  }

  function handleBookService(service: any) {
    setSelectedService(service);
    navigation.navigate('Booking');
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: mua.portfolio_images[0] }} style={styles.hero} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{mua.display_name}</Text>
        <Text style={styles.location}>📍 {mua.location}</Text>
        <Text style={styles.rating}>⭐ {mua.rating.toFixed(1)} Rating</Text>
        <Text style={styles.bio}>{mua.bio}</Text>

        <Text style={styles.sectionTitle}>Services</Text>
        {services.map(service => (
          <View key={service.id} style={styles.serviceCard}>
            <View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDuration}>⏱ {service.duration_minutes} minutes</Text>
              <Text style={styles.servicePrice}>RM{service.price}</Text>
            </View>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => handleBookService(service)}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { width: '100%', height: 300 },
  content: { padding: 16 },
  name: { fontSize: 28, fontWeight: 'bold' },
  location: { fontSize: 16, color: '#666', marginTop: 8 },
  rating: { fontSize: 16, marginTop: 4 },
  bio: { fontSize: 14, color: '#333', marginTop: 16, lineHeight: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  serviceCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 8,
    marginBottom: 12
  },
  serviceTitle: { fontSize: 18, fontWeight: '600' },
  serviceDuration: { fontSize: 14, color: '#666', marginTop: 4 },
  servicePrice: { fontSize: 20, fontWeight: 'bold', color: '#e91e63', marginTop: 4 },
  bookButton: { 
    backgroundColor: '#e91e63', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 8 
  },
  bookButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
