import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";

export default function LoginPage() {
  const { route } = useAuthenticator((context) => [context.route]);
  const navigate = useNavigate();

  useEffect(() => {
    if (route === "authenticated") {
      navigate("/dashboard", { replace: true });
    }
  }, [route, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Authenticator />
    </div>
  );
}