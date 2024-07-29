import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomDropdown = ({
  items = [],
  placeholder = 'Select an item',
  onValueChange,
  disabled,
  customStyles = {},
  loading = false,
  errorMessage = 'No items available'
}) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSelect = (item) => {
    setSelectedValue(item);
    onValueChange(item.value);
    setIsModalVisible(false);
  };

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={[styles.container, customStyles.container]}>
      <TouchableOpacity
        style={disabled ? [disabledStyles.dropdown, customStyles.dropdown] : [styles.dropdown, customStyles.dropdown]}
        onPress={() => setIsModalVisible(true)}
        disabled={disabled}
      >
        <Text style={disabled ? [disabledStyles.selectedText, customStyles.selectedText] : [styles.selectedText, customStyles.selectedText]}>
          {selectedValue ? selectedValue.label : placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color={disabled ? '#aaa' : '#888'} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setIsModalVisible(false)}>
          <View style={[styles.modal, customStyles.modal]}>
            <TextInput
              style={[styles.searchInput, customStyles.searchInput]}
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              filteredItems.length > 0 ? (
                <FlatList
                  data={filteredItems}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.item, customStyles.item]} onPress={() => handleSelect(item)}>
                      <Text style={[styles.itemText, customStyles.itemText]}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={[styles.errorText, customStyles.errorText]}>{errorMessage}</Text>
              )
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
});

const disabledStyles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
  },
  selectedText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
});

export default CustomDropdown;
