import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TextInput, Alert, Button,TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { CheckBox } from 'react-native-elements';

const ProfileScreen = ({ navigation }) => {
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isChecked4, setIsChecked4] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [isFromHome, setIsFromHome] = useState(false);

  const save = async () => {

    try {
      await AsyncStorage.setItem("userFirstName", firstName || ""); 
      await AsyncStorage.setItem("userLastName", LastName || ""); // Use `lastName` instead of `LastName`
      await AsyncStorage.setItem("userImage", image || ""); 
      await AsyncStorage.setItem("userEmail", email || ""); 
      await AsyncStorage.setItem("userCheck1", String(isChecked1)); // Convert boolean to string
      await AsyncStorage.setItem("userCheck2", String(isChecked2)); // Convert boolean to string
      await AsyncStorage.setItem("userCheck3", String(isChecked3)); // Convert boolean to string
      await AsyncStorage.setItem("userCheck4", String(isChecked4)); // Convert boolean to string
      await AsyncStorage.setItem("userPhone", phone || ""); 

      await AsyncStorage.setItem("lastSavedState", JSON.stringify({
        firstName,
        LastName,
        image,
        email,
        isChecked1,
        isChecked2,
        isChecked3,
        isChecked4,
        phone
      }));
    } catch (e) {
      console.error("Failed to save data.", e);
    }
  };
  
  const loadLastSavedState = async () => {
    try {
      const lastSavedState = await AsyncStorage.getItem("lastSavedState");
      if (lastSavedState) {
        const state = JSON.parse(lastSavedState);
        setFirstName(state.firstName);
        setLastName(state.LastName);
        setImage(state.image);
        setEmail(state.email);
        setIsChecked1(state.isChecked1);
        setIsChecked2(state.isChecked2);
        setIsChecked3(state.isChecked3);
        setIsChecked4(state.isChecked4);
        setPhone(state.phone);
      }
    } catch (e) {
      console.error("Failed to load last saved state.", e);
    }
  };
  const discardChanges = async () => {
    await loadLastSavedState(); // Load last saved state and update form fields
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const isFromHome = await AsyncStorage.getItem('FromHome');
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (isFromHome){
          loadLastSavedState();
          setIsFromHome('false');
        } else{
          setIsFromHome('false');
        }

      } catch (e) {
        console.error('Failed to load user data.', e);
      }
    };
    
    loadUserData();
  }, []);
  const pickImage = async () => {
    // Request permission to access the image library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need permission to access your photos!');
      return;
    }

    // Open the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Update the state with the selected image URI
    }
  };
  const removeImage = async () => {
    setImage(null)
  }

  const changeScreen = async () => {
    try {
      await AsyncStorage.setItem("onboardingComplete", "false");
      await AsyncStorage.removeItem("userFirstName"); 
      await AsyncStorage.removeItem("userLastName"); 
      await AsyncStorage.removeItem("userImage"); 
      await AsyncStorage.removeItem("userEmail"); 
      await AsyncStorage.removeItem("userCheck1"); 
      await AsyncStorage.removeItem("userCheck2"); 
      await AsyncStorage.removeItem("userCheck3"); 
      await AsyncStorage.removeItem("userCheck4"); 
      await AsyncStorage.removeItem("userPhone"); 
      await AsyncStorage.removeItem("lastSavedState")
      navigation.replace("Onboarding")
    } catch (e) {
      console.error('Error clearing onboarding flag', e);
    }
  };
  const isEmailValid = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  
  const validatePhoneNumber = (phone) => {
    // Regex pattern for USA phone numbers
    const phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phonePattern.test(phone);
  };
  const isButtonPressable = firstName && LastName && isEmailValid(email) &&validatePhoneNumber(phone);
  const back = async () => {
    try {
      save();
      navigation.replace("Home")
    } catch (e) {
      console.error('Error clearing onboarding flag', e);
    }
  };
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    const initials = names.map(n => n.charAt(0).toUpperCase()).join('');
    return initials;
  };
  const getNames =(name) =>{
    const names2 = name.split(' ');
    const first = names2[0]; // First part of the name
    const last = names2.length > 1 ? names2[1] : '';
    setFirstName(first);
    setLastName(last);
  };
  useEffect(() => {
    getNames(name);
  }, [name]);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={back}>
        <Image
          source={require("../assets/Button_Header.png")}
          style={styles.backButton}
        />
      </TouchableOpacity>
        </View>
      
      <Image
          style={styles.logo} 
          source={require("../assets/LEMON.png")}
        />
        <Text style={styles.textHeader}>LITTLE LEMON</Text>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.profilePicH}
          />
        ) : (
          <View style={styles.profilePicH}>
            <Text style={styles.initialsText2}>{getInitials(name)}</Text>
          </View>
        )}
      </View>
      <ScrollView style={styles.scrollableContent}>
      <Text style={styles.textStyle}>Personal Information</Text>
      <View style={styles.imageContainer}>
    
      {image ? (
          <Image
            source={{ uri: image }}
            style={styles.profilePic}
          />
        ) : (
          <View style={styles.profilePic}>
            <Text style={styles.initialsText}>{getInitials(name)}</Text>
          </View>
        )}
        
        <View style={styles.buttonRow}>
        <TouchableOpacity 
        onPress={pickImage} 
        style={styles.button}>
          <Text style={styles.buttonText}>Change</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={removeImage}
        style={styles.button2}>
          <Text style={styles.buttonText2}>Remove</Text>
        </TouchableOpacity>
        </View>
        
      </View>
      <Text style={styles.textStyle}>First Name</Text>
      <TextInput 
        style={styles.inputStyle}
        placeholder={firstName}
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.textStyle}>Last Name</Text>
      <TextInput 
        style={styles.inputStyle}
        placeholder={LastName}
        value={LastName}
        onChangeText={setLastName}
      />
      <Text style={styles.textStyle}>Email</Text>
      <TextInput 
        style={styles.inputStyle}
        placeholder={email}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <Text style={styles.textStyle}>Phone number</Text>
      <TextInput 
        style={styles.inputStyle}
        placeholder={phone}
        value={phone}
        onChangeText={setPhone}
        maxLength={10}
        keyboardType="numeric"
        textContentType="numeric"
      />
      <Text style={styles.textStyle}>Email Notifications</Text>
      <CheckBox
        title='Order Statuses'
        checked={isChecked1}
        onPress={() => setIsChecked1(!isChecked1)}
        checkedColor='#009522'
      />
      <CheckBox
        title='Password Changes'
        checked={isChecked2}
        onPress={() => setIsChecked2(!isChecked2)}
        checkedColor='#009522'
      />
      <CheckBox
        title='Special Offers'
        checked={isChecked3}
        onPress={() => setIsChecked3(!isChecked3)}
        checkedColor='#009522'
      />
      <CheckBox
        title='Newsletter'
        checked={isChecked4}
        onPress={() => setIsChecked4(!isChecked4)}
        checkedColor='#009522'
      />
      </ScrollView>

    <View style={styles.buttonContainer}>
    <TouchableOpacity 
      style={styles.logoutButton}
      onPress={changeScreen}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
    <View style={styles.buttonRow}>
      <View style={styles.saveButton}>
        <Button 
          title="Save Changes" 
          color="#009522"
          onPress={save}
          disabled={!isButtonPressable}/>
          
      </View>
      <View style={styles.discardButton}>
        <Button 
          title="Discard Changes" 
          color="#009522"
          onPress={discardChanges}/>
      </View>
    </View>
    </View>    
  </View>


);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginVertical: 16,
  },
  title: {
    marginTop: 48,
    paddingVertical: 10,
    color: "#333333",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Pushes the buttons towards the bottom
    paddingBottom: 20,
    marginTop: 130,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  buttonText2: {
    fontSize: 16,
    color: 'black'
  },
  discardButton: {
    width: '50%', // Custom width for Discard Changes button
    height: 50,   // Custom height
    alignSelf: 'center',
    marginVertical: 10,
  },
  saveButton: {
    width: '40%', // Custom width for Save Changes button
    height: 50,   // Custom height
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between the buttons
    marginVertical: 0,
  },
  logoutButton: {
    backgroundColor: '#edde24',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 50,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePic:{
    width: 100, // Width of the image
    height: 100, // Height of the image
    borderRadius: 50, // Half of the width/height to make it circular
    borderWidth: 2, // Optional: border width
    borderColor: 'black', // Optional: border color
    marginRight:10,
    backgroundColor: '#edde24',
    textAlign: 'center'
  },
  profilePicH:{
    width: 60, // Width of the image
    height: 60, // Height of the image
    borderRadius: 30, // Half of the width/height to make it circular
    borderWidth: 2, // Optional: border width
    borderColor: 'black', // Optional: border color
    backgroundColor: '#edde24',
    textAlign: 'center',
    position: 'absolute', // Use absolute positioning
    top: 16, // Position from the top of the screen
    right: 10, // Position from the right side of the screen
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items vertically at the start
    alignItems: 'flex-start', // Align items horizontally at the start
    marginBottom: 10,
    marginTop: 20,
    width: '100%', // Ensure container takes full width
    paddingLeft: 10, // Add padding to the left if needed
  },
  textHeader:{
    fontSize: 20,
    fontWeight: 'bold',
    color: "#136f00",
    marginRight:40
  },
  header: {
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#009522',
    padding: 10,
    borderRadius: 5,
    marginTop: 25,
    marginLeft:30
  },
  button2: {
    backgroundColor: '#edde24',
    padding: 10,
    borderRadius: 5,
    marginTop: 25,
    marginLeft:30
  },
  initialsText: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center'
  },
  initialsText2: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  backButton:{
    width: 50, // Width of the image
    height: 50, // Height of the image
    resizeMode: 'contain',
    
  },
  backButtonContainer:{
    position: 'absolute',
    top: 25,   // Adjust the vertical position of the back button
    left: 0,  // Adjust the horizontal position of the back button
  },
  inputStyle: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollableContent: {
    flexGrow: 1,
  }
});

export default ProfileScreen;
