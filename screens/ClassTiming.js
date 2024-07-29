import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import CustomDropdown from '../components/Dropdown';
import classTimings from '../utils/classTimings.json';
import Icon from 'react-native-vector-icons/FontAwesome';

const DetailScreen = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredSchools, setFilteredSchools] = useState([]);

  const zones = Object.keys(classTimings).map(zone => ({ label: zone, value: zone }));
  const schools = selectedZone ? Object.keys(classTimings[selectedZone] || {}).map(school => ({ label: school.replace(/([A-Z])/g, ' $1').trim(), value: school })) : [];
  const grades = selectedSchool ? Object.keys(classTimings[selectedZone]?.[selectedSchool] || {}).map(grade => ({ label: grade, value: grade })) : [];
  const sections = selectedGrade ? Object.keys(classTimings[selectedZone]?.[selectedSchool]?.[selectedGrade] || {}).map(section => ({ label: section, value: section })) : [];
  const classTimingsForSection = selectedSection ? classTimings[selectedZone]?.[selectedSchool]?.[selectedGrade]?.[selectedSection] || {} : {};

  const resetGrade = () => {
    setSelectedGrade(null);
    setSelectedSection(null);
  };

  const resetSection = () => {
    setSelectedSection(null);
  };

  const handleZoneChange = (value) => {
    setSelectedZone(value);
    setSelectedSchool(null);
    setSelectedGrade(null);
    setSelectedSection(null);
  };

  const handleSchoolChange = (value) => {
    setSelectedSchool(value);
    resetGrade();
  };

  const handleGradeChange = (value) => {
    setSelectedGrade(value);
    resetSection();
  };

  const handleSectionChange = (value) => {
    setSelectedSection(value);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const results = [];
      Object.keys(classTimings).forEach(zone => {
        Object.keys(classTimings[zone]).forEach(school => {
          if (school.toLowerCase().includes(text.toLowerCase())) {
            results.push({ label: school.replace(/([A-Z])/g, ' $1').trim(), value: school, zone });
          }
        });
      });
      setFilteredSchools(results);
    } else {
      setFilteredSchools([]);
    }
  };

  const handleSchoolSelect = (school) => {
    setSelectedZone(school.zone);
    setSelectedSchool(school.value);
    setSelectedGrade(null);
    setSelectedSection(null);
    setFilteredSchools([]);
    setSearchText(school.label);
  };

  useEffect(() => {
    if (searchText === '') {
      setFilteredSchools([]);
    }
  }, [searchText]);

  useEffect(() => {
  }, [selectedZone, selectedSchool, selectedGrade, selectedSection]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.circle, styles.circle1]}></View>
      <View style={[styles.circle, styles.circle2]}></View>
      <View style={[styles.circle, styles.circle3]}></View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Class Timings</Text>

        <View style={styles.inputContainer}>
          <Icon name="search" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            onChangeText={handleSearch}
            value={searchText}
            placeholder="Search"
            placeholderTextColor="#888"
          />
        </View>

        {filteredSchools.length > 0 && (
          <View style={styles.searchResults}>
            {filteredSchools.map((school) => (
              <TouchableOpacity
                key={school.value}
                style={styles.searchResultItem}
                onPress={() => handleSchoolSelect(school)}
              >
                <Text style={styles.searchResultText}>{school.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {(<CustomDropdown
          items={zones}
          placeholder="Select a zone"
          onValueChange={handleZoneChange}
          disabled={!searchText==""}
          style={styles.dropdown}
          selectedValue={selectedZone}
        />)}

        {(selectedZone && <CustomDropdown
          items={schools}
          placeholder="Select a school"
          onValueChange={handleSchoolChange}
          disabled={!selectedZone || !searchText==""}
          style={styles.dropdown}
          selectedValue={selectedSchool}
        />)}

        {
          (selectedSchool &&
         <CustomDropdown
          items={grades}
          placeholder="Select a grade"
          onValueChange={handleGradeChange}
          disabled={!selectedSchool}
          style={styles.dropdown}
          selectedValue={selectedGrade}
        />
      )}

        
        
        {(selectedGrade && <CustomDropdown
          items={sections}
          placeholder="Select a section"
          onValueChange={handleSectionChange}
          disabled={!selectedGrade}
          style={styles.dropdown}
          selectedValue={selectedSection}
        />)}

        <View style={styles.resultContainer}>
          {selectedSection ? (
            Object.keys(classTimingsForSection).map((subject) => (
              <Text key={subject} style={styles.resultText}>
                {subject}: {classTimingsForSection[subject]}
              </Text>
            ))
          ) : (
            <Text style={styles.resultText}>Please select all options</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
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
    padding: 5,
    backgroundColor: '#fff',
    elevation: 3,
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#344955',
  },
  searchResults: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    marginBottom: 20,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchResultText: {
    fontSize: 16,
    color: '#344955',
    
  },
  dropdown: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 3,
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    padding: 20,
    borderRadius: 10,
  },
  resultText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  circle: {
    position: 'absolute',
    opacity: 0.3,
  },
  circle1: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#D8BFD8',
    top: -100,
    left: -30,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: '#46D6AA',
    borderRadius: 150,
    bottom: -140,
    right: -50,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: '#E0C76C',
    borderRadius: 150,
    bottom: 140,
    left: 20,
  },
});

export default DetailScreen;
