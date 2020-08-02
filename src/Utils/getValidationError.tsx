import {ValidationError} from 'yup';

interface ErrosProps {
  [key: string]: string;
}

export default function getValidationErros(err: ValidationError): ErrosProps {
  const erros: ErrosProps= {};
  
  err.inner.forEach(error => {
   erros[error.path] = error.message;
  })
  
  return erros;
}