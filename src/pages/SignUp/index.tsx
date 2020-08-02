import React, {useCallback, useRef} from 'react';
import { Image,
         View,
         ScrollView, 
         KeyboardAvoidingView, 
         Platform, 
         TextInput,
         Alert
        } from 'react-native';
import * as Yup from 'yup';
import getValidationError from '../../Utils/getValidationError';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import logoImg from '../../assets/logo.png';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import { Container, 
         Title,  
         BackButtonToSigIn , 
         BackButtonToSigInText } from './style';
import api from '../../services/api';

interface FormData {
  email: string;
  name: string;
  password: string;

}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const inputEmailRef = useRef<TextInput>(null)
  const inputPasswordRef = useRef<TextInput>(null)
 
  const handleSignUp = useCallback( async (data: FormData)=> {
     try {
      formRef.current?.setErrors({});

      const  schema = Yup.object().shape({
        name: Yup.string().required('Nome Obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
        password: Yup.string().required('Senha obrigatória').min(6,'No mínimo 6 dígitos')
      });

     await schema.validate(data,{abortEarly: false});
     await api.post('/users',data);

     Alert.alert('Cadastro realizado com sucesso!','Você já pode fazer logon na aplicação');
     
     navigation.navigate('SignIn'); 
    } catch (error) {
         if(error instanceof Yup.ValidationError){
           const errorObject = getValidationError(error);
           formRef.current?.setErrors(errorObject);
           return;
         }
         console.log(error);
         Alert.alert('Erro no servidor','Erro ao tentar realizar cadastro, tente mais tarde');
         
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
     keyboardShouldPersistTaps="handled"
   >   
      <Container>
          <Image source={logoImg} />
          <View>
          <Title>Criar uma conta</Title>
          </View>
          <Form style={{width: '100%'}}  
               ref={formRef} 
               onSubmit={handleSignUp}>
            <Input 
                autoCapitalize="words"
                autoCorrect={false}
                name="name" 
                icon="user" 
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={()=>{
                  inputEmailRef.current?.focus();
                }}
                />
            <Input 
               ref={inputEmailRef}
               autoCapitalize="none"
               autoCorrect={false}
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
               placeholder="Senha"
               secureTextEntry
               returnKeyType="send"
               onSubmitEditing={()=> {
                formRef.current?.submitForm();
              }}
              textContentType="newPassword"
               />

            <Button onPress={()=> {
              formRef.current?.submitForm();
            }}>Entrar</Button>
          </Form>
        </Container>
    </ScrollView>
    </KeyboardAvoidingView>
     
     <BackButtonToSigIn onPress={()=> navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff"/>
        <BackButtonToSigInText>Voltar para logon
        </BackButtonToSigInText>
     </BackButtonToSigIn>
    </>
  );
};

export default SignUp;
