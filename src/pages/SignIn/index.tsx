import React,{useRef, useCallback} from 'react';
import { Image,
         View,
        ScrollView, 
        KeyboardAvoidingView, 
        Platform,
        TextInput,
        Alert
      } from 'react-native';
import * as Yup   from 'yup';     
import Input from '../../components/Input';
import Button from '../../components/Button';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import logoImg from '../../assets/logo.png';
import { Container, 
         Title, 
         ForgotPassword, 
         ForgotPasswordText, 
         CreateAccountButton , 
         CreateAccountButtonText} from './style';
import getValidationErros from '../../Utils/getValidationError';


interface loginFormData{
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
   const formRef = useRef<FormHandles>(null);
   const inputPasswordRef = useRef<TextInput>(null);
   const navigation = useNavigation();

   const handleSigIn = useCallback(async (data: loginFormData)=>{ 
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string().required('Email obrigatório').email('Digite um Email valido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data,{abortEarly: false});


      } catch (error) {
        if (error instanceof Yup.ValidationError){
          const errorObject = getValidationErros(error);
          formRef.current?.setErrors(errorObject);
          return;
        }

        Alert.alert('Erro no servidor','Erro ao tentar fazer o logon');
      }

   },[])
  return (
   <>
   <KeyboardAvoidingView 
    style={{flex:1}}
    behavior={Platform.OS === 'ios' ? 'padding': undefined}
    enabled
    >
   <ScrollView 
    contentContainerStyle={{flex:1}}
     keyboardShouldPersistTaps="always"
   >   
      <Container>
          <Image source={logoImg} />
          <View>
          <Title>Faça seu logon</Title>
          </View>
          <Form
            onSubmit={handleSigIn}
            ref={formRef}
            style={{width:'100%'}}
          >
              <Input 
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  name="email" 
                  icon="mail" 
                  placeholder="E-mail"
                  returnKeyType="next"
                  onSubmitEditing={()=>{
                    inputPasswordRef.current?.focus();
                  }}
                  />
              <Input 
                  ref={inputPasswordRef}
                  name="password" 
                  icon="lock" 
                  placeholder="senha"
                  secureTextEntry
                  returnKeyType="send"
                  onSubmitEditing={()=> {
                    formRef.current?.submitForm();
                  }}
                  />

              <Button onPress={()=> {
                formRef.current?.submitForm();
              }}>Entrar</Button>
          </Form>
          <ForgotPassword>
            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
          </ForgotPassword>
        </Container>
    </ScrollView>
    </KeyboardAvoidingView>
     
     <CreateAccountButton onPress={()=> navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000"/>
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
     </CreateAccountButton>
    </>
  );
};

export default SignIn;
