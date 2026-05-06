import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";

type Role = "passenger" | "driver" | "admin" | null;
type AuthType = {
  currentUser: User | null;
  userRole: Role;
  userData: any;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthType>({} as AuthType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            setUserRole((data.role as Role) || null);
            setUserData(data);
          } else {
            setUserRole(null);
            setUserData(null);
          }
        } catch {
          setUserRole(null);
          setUserData(null);
        }
      } else {
        setUserRole(null);
        setUserData(null);
      }
      setLoading(false);
    });
  }, []);

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) return <LoadingSpinner />;
  return <AuthContext.Provider value={{ currentUser, userRole, userData, loading, logout }}>{children}</AuthContext.Provider>;
};
