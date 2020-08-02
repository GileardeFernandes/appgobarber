import React,
      {useRef, 
      useEffect,
      useImperativeHandle, 
      forwardRef,
      useState,
      useCallback
      
    } from 'react';
import {TextInputProperties} from 'react-native';
import {Container, TextInput, Icon} from './style';
import {useField} from '@unform/core';
interface InputProps extends TextInputProperties {
  name: string;
  icon: string;
}
interface InputValueReference{
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef ,InputProps> = ({name, icon, ...rest},ref) => {
  const inputElementRef = useRef<any>(null)
  const  {registerField, defaultValue = '',fieldName, error} = useField(name);
  const inputValueRef = useRef<InputValueReference>({value: defaultValue});
  
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(()=> {
    setIsFocused(true);
  },[]);

  const handleInputBlur = useCallback(()=> {
      setIsFocused(false);
      setIsFilled(!!inputValueRef.current.value);    
  },[])

  useImperativeHandle(ref, ()=> ({
    focus(){
      inputElementRef.current.focus();
    }
  }));

  useEffect(()=> {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref:any, value){
        inputValueRef.current.value = value;
        inputElementRef.current?.setNativeProps({text: value})
      },
      clearValue(){
        inputValueRef.current.value = '';
        inputElementRef.current.clean();
      }
    })
  },[fieldName, registerField])

  return  (
  <Container isFocused={isFocused} isError={!!error} >
    <Icon
      name={icon} size={20} color={ isFilled  || isFocused ? "#ff9000" : "#666360"}
    />
    <TextInput 
     onBlur={handleInputBlur}
     onFocus={handleInputFocus}
     ref={inputElementRef}
     keyboardAppearance="dark"
     placeholderTextColor="#666360"  
     defaultValue={defaultValue}
     onChangeText={value => {
       inputValueRef.current.value = value;
     }}
     {...rest}  />
  </Container>
  )
}



export default forwardRef(Input);