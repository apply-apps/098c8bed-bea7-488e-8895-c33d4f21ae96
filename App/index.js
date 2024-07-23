// Filename: index.js
// Combined code from all files

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, ActivityIndicator, Alert, View } from 'react-native';
import axios from 'axios';

const SQUARE_API_URL = 'https://connect.squareup.com/v2'; // Mock URL, replace with actual
const ACCESS_TOKEN = 'YOUR_SQUARE_ACCESS_TOKEN'; // Replace with your Square access token

const fetchAvailableServices = async () => {
  try {
    const response = await axios.get(`${SQUARE_API_URL}/catalog/list`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.objects.filter(item => item.type === 'ITEM');
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

const createBooking = async (bookingDetails) => {
  try {
    const response = await axios.post(`${SQUARE_API_URL}/appointments`, bookingDetails, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export default function App() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ name: '', email: '', service: '' });
  const [loading, setLoading] = useState(false);

  useState(() => {
    setLoading(true);
    fetchAvailableServices()
      .then(data => setServices(data))
      .catch(error => Alert.alert("Error loading services"))
      .finally(() => setLoading(false));
  }, []);

  const handleBooking = () => {
    if (!bookingDetails.name || !bookingDetails.email || !selectedService) {
      Alert.alert("Please fill all details");
      return;
    }

    setLoading(true);
    createBooking({ ...bookingDetails, service: selectedService })
      .then(() => Alert.alert("Booking created successfully"))
      .catch(error => Alert.alert("Error creating booking"))
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Book a Service</Text>
        {loading && <ActivityIndicator size="large" />}

        {!loading && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={bookingDetails.name}
              onChangeText={(text) => setBookingDetails({ ...bookingDetails, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={bookingDetails.email}
              onChangeText={(text) => setBookingDetails({ ...bookingDetails, email: text })}
            />

            <Text style={styles.label}>Select a Service:</Text>
            {services.map(service => (
              <Button
                key={service.id}
                title={service.item_data.name}
                onPress={() => setSelectedService(service.id)}
                color={selectedService === service.id ? 'blue' : 'gray'}
              />
            ))}

            <Button title="Book Now" onPress={handleBooking} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginTop: 12,
  },
});