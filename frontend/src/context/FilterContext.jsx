import { createContext, useContext, useState } from "react";

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <FilterContext.Provider
            value={{
                selectedCategory,
                setSelectedCategory,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    return useContext(FilterContext);
}