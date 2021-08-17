import * as React from 'react';

const viewportContext = React.createContext<WindowSize>({
    width: 0,
    height: 0,
});

interface WindowSize {
    width: number;
    height: number;
}

export const ViewportProvider: React.FunctionComponent = ({ children }) => {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);

    const handleWindowResize = (): void => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    React.useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        handleWindowResize();
        return (): void => window.removeEventListener('resize', handleWindowResize);
    }, []);

    return (
        <viewportContext.Provider value={{ width, height }}>{children}</viewportContext.Provider>
    );
};

export const useViewport = (): WindowSize => {
    const { width, height } = React.useContext(viewportContext);
    return { width, height };
};
