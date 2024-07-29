import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import CustomDropdown from '../components/Dropdown';
import RoleSelectorModal from '../components/SearchBarDropDown';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard';
import zonesSchools from '../utils/zonesAndSchools.json';
import { API_URL } from '../.env';

const PrincipalDetailsScreen = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedPrincipal, setSelectedPrincipal] = useState(null);
  const [principalsData, setPrincipalsData] = useState([]);
  const [rolePrincipalsData, setRolePrincipalsData] = useState([]);
  const [filteredPrincipals, setFilteredPrincipals] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [zones, setZones] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);
  const [roleApiCalled, setRoleApiCalled] = useState(false);
  const [Isinfo , setIsinfo] = useState(false);

  useEffect(() => {
    const zoneData = Object.keys(zonesSchools).map(zone => ({ label: zone, value: zone }));
    setZones(zoneData);
  }, []);

  useEffect(() => {
    if (selectedZone) {
      const selectedSchools = zonesSchools[selectedZone].map(school => ({ label: school, value: school }));
      setSchools(selectedSchools);
    } else {
      setSchools([]);
    }
  }, [selectedZone]);

  const fetchPrincipalsBySchoolAndRole = async (school, role) => {
    try {
      setIsinfo(false)
      const url = `${API_URL}?school=${encodeURIComponent(school)}&role=${encodeURIComponent(role)}`;
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)

      if (data.length == []){
        setIsinfo(true)
      }
      setLoading(false);
      
      setApiCalled(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data from the API.');
      setLoading(false);
    }
  };

  const fetchPrincipalsByRole = async (role) => {
    try {
      setIsinfo(false)
      const url = `${API_URL}?role=${encodeURIComponent(role)}`;
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      setPrincipalsData(null);
      setLoading(false);
      setRolePrincipalsData(data);
      setFilteredPrincipals(data);
      setSelectedPrincipal(null);
      setRoleApiCalled(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data from the API.');
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setIsinfo(false)
    setSearchText(text);
    setShowSearchResults(true);
    if (text) {
      const filteredResults = rolePrincipalsData.filter(principal =>
        principal.principalName && principal.principalName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPrincipals(filteredResults);
    } else {
      setFilteredPrincipals([]);
    }
  };

  const handlePrincipalSelect = (principal) => {
    setSelectedPrincipal(principal);
    setSearchText(principal.principalName);
    setFilteredPrincipals([]); 
    setShowSearchResults(false); 
  };

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    setSelectedPrincipal(null); 
    await fetchPrincipalsByRole(role);
  };

  const handleDropdownSelect = async (zone, school, role) => {
    if (zone && school && role) {
      setSelectedZone(zone);
      setSelectedSchool(school);
      setSelectedRole(role);
      setSelectedPrincipal(null);
      await fetchPrincipalsBySchoolAndRole(school, role);
    }
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied to Clipboard', `${text} has been copied to the clipboard.`);
  };

  const renderPrincipalDetails = ({ item }) => (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsText}>Name: {item.principalName || 'Not found'}</Text>
      <TouchableOpacity onPress={() => copyToClipboard(item.contactNumber.toString() || 'Not found')}>
        <Text style={styles.detailsText}>Contact: {item.contactNumber || 'Not found'}</Text>
      </TouchableOpacity>
      <Text style={styles.detailsText}>School: {item.school || 'Not found'}</Text>
      <Text style={styles.detailsText}>Role: {item.role || 'Not found'}</Text>
      <Text style={styles.detailsText}>Location: {item.location || 'Not found'}</Text>
    </View>
  );

  const roles = [
    { label: 'Principal', value: 'Principal' },
    { label: 'Ops Manager', value: 'Ops Manager' },
    { label: 'CIC', value: 'CIC' },
    { label: 'Co-ordinator', value: 'Co-ordinator' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={[styles.circle, styles.circle1]}></View>
        <View style={[styles.circle, styles.circle2]}></View>
        <View style={[styles.circle, styles.circle3]}></View>
        <Text style={styles.header}>OIS Details</Text>
        <View style={styles.inputContainer}>
          <Icon name="search" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            onChangeText={handleSearch}
            value={searchText}
            placeholder="Search by Name"
            placeholderTextColor="#888"
            editable={!!selectedRole}
          />
          <TouchableOpacity onPress={() => setIsRoleModalVisible(true)}>
            <Icon name="chevron-down" size={20} color="#888" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <RoleSelectorModal
          visible={isRoleModalVisible}
          roles={roles}
          onSelect={handleRoleSelect}
          onClose={() => setIsRoleModalVisible(false)}
        />
        {showSearchResults && searchText.length > 0 && filteredPrincipals.length > 0 && (
          <FlatList
            data={filteredPrincipals}
            keyExtractor={(item, index) => `${item.school}-${item.principalName}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePrincipalSelect(item)} style={styles.resultItemContainer}>
                <Text style={styles.resultItem}>{item.principalName}</Text>
              </TouchableOpacity>
            )}
            style={styles.searchResults}
          />
        )}
        <CustomDropdown
          items={zones}
          placeholder="Select a Zone"
          onValueChange={(value) => {
            setSelectedZone(value);
            setSelectedSchool(null);
            setSelectedPrincipal(null);
          }}
          customStyles={styles.dropdown}
        />
        {selectedZone && (
          <CustomDropdown
            items={schools}
            placeholder="Select a School"
            onValueChange={(value) => {
              setSelectedSchool(value);
              setSelectedPrincipal(null);
            }}
            disabled={!selectedZone}
            customStyles={styles.dropdown}
          />
        )}
        {selectedSchool && (
          <CustomDropdown
            items={roles}
            placeholder="Select a Role"
            onValueChange={(value) => {
              setSelectedRole(value);
              handleDropdownSelect(selectedZone, selectedSchool, value);
            }}
            customStyles={styles.dropdown}
          />
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (   
          <>
            {apiCalled && !selectedPrincipal && (
              <FlatList
                data={principalsData}
                keyExtractor={(item, index) => `${item.school}-${item.principalName}-${index}`}
                renderItem={renderPrincipalDetails}
                style={styles.detailsList}
              />
            )}
            {roleApiCalled && selectedPrincipal && (
              <View>
                {renderPrincipalDetails({ item: selectedPrincipal })}
              </View>
            )}

            {Isinfo ? (<Text style={styles.noInfoText}> No Infomation Available</Text>) : <View></View>}
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 30,
    marginVertical: 30,
    fontFamily: 'Ubuntu',
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    padding: 2,
    backgroundColor: '#fff',
    elevation: 10,
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    marginVertical: 10,
  },
  detailsContainer: {
    marginVertical: 20,
    backgroundColor:'#E3E3E3',
    borderRadius:10,
    padding:10,
    paddingHorizontal:20
  },
  detailsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight:'900'
  },
  principalDetails: {
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  resultItemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  resultItem: {
    fontSize: 16,
  },
  searchResults: {
    maxHeight: 200,
  },
  circle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.3,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#FFCDD2',
    top: -10,
    right: -50,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: '#E1BEE7',
    bottom: -100,
    left: -100,
  },
  circle3: {
    width: 70,
    height: 70,
    backgroundColor: '#E1BEE7',
    top: 350,
    right: 50,
  },
  noInfoText: {
    position:'absolute',
    width:'100%',
    bottom:"40%",
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PrincipalDetailsScreen;