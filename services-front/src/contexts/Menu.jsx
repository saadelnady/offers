import { createContext, useState } from 'react';

const MenuContext = createContext();

const MenuProvider = ({ children }) => {
    const [isMenu, setIsMenu] = useState(false);

    const toggleMenu = () => {
        setIsMenu((prevState) => !prevState);
    };

    const contextValue = {
        isMenu,
        toggleMenu,
        setIsMenu
    };

    return <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>;
};

export default MenuProvider;
export { MenuContext };
