import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HomeScreen({ navigation }: any) {
  const [muas, setMuas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMUAs();
  }, []);

  async function loadMUAs() {
    const { data, error } = await supabase
      .from('leish_muas')
      .select('*')
      .order('rating', { ascending: false });
    
    if (data) setMuas(data);
    setLoading(false);
  }

  const filteredMuas = muas.filter(mua => 
    mua.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mua.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Perfect MUA</Text>
      <TextInput
        style={styles.searchBar}
        placeholder=\"Search by location (Cyberjaya, KL, etc.)\"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FlatList
        data={filteredMuas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('MUAProfile', { mua: item })}
          >
            <Image 
              source={{ uri: item.portfolio_images[0] }} 
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.muaName}>{item.display_name}</Text>
              <Text style={styles.location}>📍 {item.location}</Text>
              <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
              <Text style={styles.price}>From RM{item.price_start}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  searchBar: { 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    paddingHorizontal: 16,
    marginBottom: 16 
  },
  card: { 
    marginBottom: 16, 
    borderRadius: 12, 
    backgroundColor: '#f9f9f9',
    overflow: 'hidden'
  },
  image: { width: '100%', height: 200 },
  cardContent: { padding: 12 },
  muaName: { fontSize: 20, fontWeight: 'bold' },
  location: { fontSize: 14, color: '#666', marginTop: 4 },
  rating: { fontSize: 14, marginTop: 4 },
  price: { fontSize: 16, fontWeight: '600', color: '#e91e63', marginTop: 4 }
});
