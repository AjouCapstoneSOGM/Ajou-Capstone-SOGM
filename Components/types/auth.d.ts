declare global {
  type AuthContextTypes = {
    isLoggedIn: boolean;
    userName: string;
    login: () => void;
    logout: () => Promise<void>;
  };

  type AuthProviderProps = {
    children: ReactNode;
  };
}
export {};
