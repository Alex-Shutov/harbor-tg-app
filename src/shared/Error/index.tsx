import React from 'react';
interface IProps {
  children: React.ReactNode;
}
const PageError:React.FC<IProps> = ({children}) => {
  return (
    <div style={{color:'black'}}>
      Error: {children}
    </div>
  );
};

export default PageError;