import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Avatar, 
  Text, 
  VStack, 
  Button, 
  IconButton, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton, 
  FormControl, 
  FormLabel, 
  Input,
  useDisclosure, 
  FormErrorMessage,
  useToast,
  Divider,
  useBreakpointValue 
} from '@chakra-ui/react';
import { FaUser, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isChangePasswordOpen, onOpen: onChangePasswordOpen, onClose: onChangePasswordClose } = useDisclosure();
  const toast = useToast();
  
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+1234567890',
    designation: 'Software Engineer',
    profileImage: 'https://bit.ly/broken-link'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    profileImage: ''
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    reenterNewPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });

    if (name === 'newPassword') {
      const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
      setPasswordCriteria(!passwordValid);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        profileImage: reader.result
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setProfileData((prevData) => ({
      name: formData.name || prevData.name,
      email: formData.email || prevData.email,
      mobile: formData.mobile || prevData.mobile,
      profileImage: formData.profileImage || prevData.profileImage
    }));
    onEditClose();
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.reenterNewPassword) {
      setPasswordError('The passwords do not match');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwordData.newPassword)) {
      setPasswordError('The password does not meet the requirements');
    } else {
      console.log('Password changed:', passwordData.newPassword);
      setPasswordError('');
      onChangePasswordClose();
      toast({
        title: 'Password changed successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const boxRef = useRef(null);
  const editModalRef = useRef(null);
  const passwordModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        boxRef.current && 
        !boxRef.current.contains(event.target) && 
        !editModalRef.current?.contains(event.target) && 
        !passwordModalRef.current?.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [boxRef, onClose]);

  const boxWidth = useBreakpointValue({ base: '250px', md: '300px', lg: '350px' });
  const boxPadding = useBreakpointValue({ base: '4', md: '6', lg: '8' });

  return (
    <>
      <IconButton
        icon={<FaUser />}
        isRound
        size="lg"
        position="absolute"
        top="10px"
        right="20px"
        onClick={isOpen ? onClose : onOpen}
      />
      {isOpen && (
        <Box
          ref={boxRef}
          w={boxWidth}
          p={boxPadding}
          boxShadow="md"
          borderRadius="md"
          bg="white"
          position="absolute"
          top="50px"
          right="80px"
        >
          <VStack spacing="2" position="relative">
            <Box position="relative">
              <div className="avatar-container">
                <Avatar name={profileData.name} src={profileData.profileImage} size="xl" />
                <div className="avatar-border" />
              </div>
              <IconButton
                icon={<FaEdit />}
                size="sm"
                isRound
                position="absolute"
                bottom="0"
                right="0"
                colorScheme="blue"
                onClick={onEditOpen}
              />
            </Box>
            <Text fontWeight="bold" fontSize="md">
              {profileData.name}
            </Text>
            <Text color="gray.500" fontSize="sm">{profileData.mobile}</Text>
            <Text color="gray.500" fontSize="sm">{profileData.email}</Text>
            <Text fontSize="sm">{profileData.designation}</Text>
            <Divider />
            <Button variant="outline" w="100%" size="sm">
              To Do List
            </Button>
            <Divider />
            <Button variant="outline" w="100%" size="sm">
              Reminder
            </Button>
            <Divider />
            <Button variant="outline" w="100%" size="sm" onClick={onChangePasswordOpen}>
              Change Password
            </Button>
            <Divider />
            <Button colorScheme="red" variant="outline" w="100%" size="sm">
              Logout
            </Button>
          </VStack>
        </Box>
      )}

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent ref={editModalRef} width="600px" height="500px">
          <ModalHeader fontSize="sm">Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" justifyContent="center" mb="4">
              <div className="avatar-container">
                <Avatar name={formData.name || profileData.name} src={formData.profileImage || profileData.profileImage} size="xl" />
                <div className="avatar-border" />
              </div>
            </Box>
            <FormControl id="profileImage" mb="2">
              <FormLabel fontSize="sm">Profile Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                size="sm"
              />
            </FormControl>
            <FormControl id="name" mb="2">
              <FormLabel fontSize="sm">Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter new name"
                size="sm"
              />
            </FormControl>
            <FormControl id="email" mb="2">
              <FormLabel fontSize="sm">Email Id</FormLabel>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter new email"
                size="sm"
              />
            </FormControl>
            <FormControl id="mobile" mb="2">
              <FormLabel fontSize="sm">Mobile Number</FormLabel>
              <Input
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter new mobile number"
                size="sm"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter mt="-4">
            <Button colorScheme="blue" mr={3} onClick={handleSubmit} size="sm">
              Submit
            </Button>
            <Button variant="ghost" onClick={onEditClose} size="sm">Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isChangePasswordOpen} onClose={onChangePasswordClose}>
        <ModalOverlay />
        <ModalContent ref={passwordModalRef}>
          <ModalHeader fontSize="sm">Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="newPassword" mb="2" isInvalid={passwordError !== ''}>
              <FormLabel fontSize="sm">Enter New Password</FormLabel>
              <Input
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                onFocus={() => setPasswordCriteria(true)}
                size="sm"
              />
              {passwordCriteria && (
                <Text fontSize="xs" color="gray.500">
                  Password must contain at least 8 characters, one number, one special character, one uppercase letter, and one lowercase letter.
                </Text>
              )}
            </FormControl>
            <FormControl id="reenterNewPassword" mb="2" isInvalid={passwordError !== ''}>
              <FormLabel fontSize="sm">Reenter New Password</FormLabel>
              <Input
                name="reenterNewPassword"
                type="password"
                value={passwordData.reenterNewPassword}
                onChange={handlePasswordChange}
                placeholder="Reenter new password"
                size="sm"
              />
              {passwordError && <FormErrorMessage fontSize="xs">{passwordError}</FormErrorMessage>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePasswordSubmit} size="sm">
              Submit
            </Button>
            <Button variant="ghost" onClick={onChangePasswordClose} size="sm">Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profile;
