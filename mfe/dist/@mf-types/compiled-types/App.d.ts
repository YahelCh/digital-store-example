interface User {
    id: string;
    name: string;
    email: string;
}
interface Props {
    user?: User;
    setUser?: (user: User) => void;
}
declare function App({ user, setUser }: Props): import("react/jsx-runtime").JSX.Element;
export default App;
