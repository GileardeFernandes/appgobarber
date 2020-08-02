import styled,{css} from 'styled-components/native';
import FeatherIcons from 'react-native-vector-icons/Feather';

interface InputProps {
  isFocused: boolean;
  isError: boolean;
}

export const Container = styled.View<InputProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  margin-bottom:8px; 
  border-width: 1px;
  border-color: #232129;

  ${props => props.isError && css`
    border-color: #e53030;
  ` } 

  
  ${props => props.isFocused && css`
    border-color: #ff9000;
  ` } 
  flex-direction: row;
  align-items: center;
`;


export const TextInput = styled.TextInput`
   flex:1;
   color: #fff;
   font-size: 16px;
   font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcons)`
  margin-right: 16px;
`;