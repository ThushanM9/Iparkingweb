import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, TouchableOpacity, ScrollView } from 'react-native'
import { Button, CheckBox } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import { withFirebaseHOC } from '../config/Firebase'
import { HideWithKeyboard } from 'react-native-hide-with-keyboard'
import AppLogo from '../components/AppLogo'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password should be at least 6 characters '),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must matched Password')
    .required('Confirm Password is required'),
  gender: Yup.string()
    .label('Gender')
    .required(),
  job: Yup.string()
    .label('Job')   
    .required(),
  phone: Yup.string()
    .label('Phone')
    .required()
    .matches(phoneRegExp, "Enter a valid phone number" ),
  vehicle_type: Yup.string()
    .label('Vehicle type')
    .required(),
    
  vehicle_number: Yup.string()
    .label('Vehicle number')
    .required(),
    
  check: Yup.boolean().oneOf([true], 'Please check the agreement')
})

class Signup extends Component {
  state = {
    passwordVisibility: true,
    confirmPasswordVisibility: true,
    passwordIcon: 'ios-eye',
    confirmPasswordIcon: 'ios-eye'
  }

  goToLogin = () => this.props.navigation.navigate('Login')

  handlePasswordVisibility = () => {
    this.setState(prevState => ({
      passwordIcon:
        prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
      passwordVisibility: !prevState.passwordVisibility
    }))
  }

  handleConfirmPasswordVisibility = () => {
    this.setState(prevState => ({
      confirmPasswordIcon:
        prevState.confirmPasswordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
      confirmPasswordVisibility: !prevState.confirmPasswordVisibility
    }))
  }

  handleOnSignup = async (values, actions) => {
    const { name, email, password, gender, job, phone, vehicle_type, vehicle_number } = values

    try {
      const response = await this.props.firebase.signupWithEmail(
        email,
        password
      )

      if (response.user.uid) {
        const { uid } = response.user
        const userData = { email, name, uid, gender, job, phone, vehicle_type, vehicle_number }
        await this.props.firebase.createNewUser(userData)
        this.props.navigation.navigate('App')
      }
    } catch (error) {
      // console.error(error)
      actions.setFieldError('general', error.message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  render() {
    const {
      passwordVisibility,
      confirmPasswordVisibility,
      passwordIcon,
      confirmPasswordIcon
    } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
        <HideWithKeyboard style={styles.logoContainer}>
          <AppLogo />
        </HideWithKeyboard>
        
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: '',
            job: '',
            phone: '',
            vehicle_number: '',
            vehicle_type: '',
            check: false
          }}
          onSubmit={(values, actions) => {
            this.handleOnSignup(values, actions)
          }}
          validationSchema={validationSchema}>
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting,
            setFieldValue
          }) => (
            
            <Fragment>
              <FormInput
                name='name'
                value={values.name}
                onChangeText={handleChange('name')}
                placeholder='Enter your full name'
                iconName='md-person'
                iconColor='#2C384A'
                onBlur={handleBlur('name')}
              />
              <ErrorMessage errorValue={touched.name && errors.name} />
              <FormInput
                name='email'
                value={values.email}
                onChangeText={handleChange('email')}
                placeholder='Enter email'
                autoCapitalize='none'
                iconName='ios-mail'
                iconColor='#2C384A'
                onBlur={handleBlur('email')}
              />
              <ErrorMessage errorValue={touched.email && errors.email} />
              <FormInput
                name='password'
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder='Enter password'
                iconName='ios-lock'
                iconColor='#2C384A'
                onBlur={handleBlur('password')}
                secureTextEntry={passwordVisibility}
                rightIcon={
                  <TouchableOpacity onPress={this.handlePasswordVisibility}>
                    <Ionicons name={passwordIcon} size={28} color='grey' />
                  </TouchableOpacity>
                }
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <FormInput
                name='password'
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                placeholder='Confirm password'
                iconName='ios-lock'
                iconColor='#2C384A'
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry={confirmPasswordVisibility}
                rightIcon={
                  <TouchableOpacity
                    onPress={this.handleConfirmPasswordVisibility}>
                    <Ionicons
                      name={confirmPasswordIcon}
                      size={28}
                      color='grey'
                    />
                  </TouchableOpacity>
                }
              />
              <ErrorMessage
                errorValue={touched.confirmPassword && errors.confirmPassword}
              />
              <FormInput
                name='gender'
                value={values.gender}
                onChangeText={handleChange('gender')}
                placeholder='Enter your gender    (type male or female)'
                iconName='md-male'
                iconColor='#2C384A'
                onBlur={handleBlur('gender')}
              />
              <ErrorMessage
                errorValue={touched.gender && errors.gender}
              />
              <FormInput
                name='job'
                value={values.job}
                onChangeText={handleChange('job')}
                placeholder='Enter your job'
                iconName='md-briefcase'
                iconColor='#2C384A'
                onBlur={handleBlur('job')}
              />
              <ErrorMessage
                errorValue={touched.job && errors.job}
              />
              <FormInput
                name='phone'
                value={values.phone}
                onChangeText={handleChange('phone')}
                placeholder='Enter your phone number'
                
                iconName='md-call'
                iconColor='#2C384A'
                onBlur={handleBlur('phone')}
              />
              <ErrorMessage
                errorValue={touched.phone && errors.phone}
              />
               <FormInput
                name='vehicle_type'
                value={values.vehicle_type}
                onChangeText={handleChange('vehicle_type')}
                placeholder='Enter your vehicle type  (eg: car, van, etc..)'
                iconName='md-car'
                iconColor='#2C384A'
                onBlur={handleBlur('vehicle_type')}
              />
              <ErrorMessage
                errorValue={touched.vehicle_type && errors.vehicle_type}
              />
              <FormInput
                name='vehicle_number'
                value={values.vehicle_number}
                onChangeText={handleChange('vehicle_number')}
                placeholder='Enter your vehicle number '
                iconName='md-car'
                iconColor='#2C384A'
                onBlur={handleBlur('vehicle_number')}
              />
              <ErrorMessage
                errorValue={touched.vehicle_number && errors.vehicle_number}
              />
              <CheckBox
                containerStyle={styles.checkBoxContainer}
                checkedIcon='check-box'
                iconType='material'
                uncheckedIcon='check-box-outline-blank'
                title='Agree to terms and conditions'
                checkedTitle='You agreed to our terms and conditions'
                checked={values.check}
                onPress={() => setFieldValue('check', !values.check)}
              />
              <View style={styles.buttonContainer}>
                <FormButton
                  buttonType='outline'
                  onPress={handleSubmit}
                  title='SIGNUP'
                  buttonColor='#F57C00'
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                />
              </View>
              <ErrorMessage errorValue={errors.general} />
            </Fragment>
            
          )}
        </Formik>
        </ScrollView>
        <Button
          title='Have an account? Login'
          onPress={this.goToLogin}
          titleStyle={{
            color: '#039BE5'
          }}
          type='clear'
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50
  },
  logoContainer: {
    marginBottom: 15,
    alignItems: 'center'
  },
  buttonContainer: {
    margin: 25
  },
  checkBoxContainer: {
    backgroundColor: '#fff',
    borderColor: '#fff'
  }
})

export default withFirebaseHOC(Signup)
