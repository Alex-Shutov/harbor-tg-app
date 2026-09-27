import React from 'react';

interface IProps{
  children:React.ReactNode
}

const Index:React.FC<IProps> = ({children}) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Index;
