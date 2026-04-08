import { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext();

export const useCarrinho = () => {
  return useContext(CarrinhoContext);
};

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarProdutoAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarProdutoAoCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  );
};