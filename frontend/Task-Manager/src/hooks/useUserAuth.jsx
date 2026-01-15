import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { getSession } from "../utils/authStorage";

export const useUserAuth = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Attendre la fin du chargement initial
    if (loading) return;

    // Si on a un utilisateur, c'est bon
    if (user) return;

    // Vérifier s'il y a un token dans le stockage
    // Si oui, ne pas rediriger immédiatement (le bootstrap est en cours)
    const { token } = getSession();
    if (token && loading === false) {
      // On a un token mais pas d'utilisateur chargé - attendre
      return;
    }

    // Pas de token et pas d'utilisateur = rediriger à la connexion
    if (!token && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
};