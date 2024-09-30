import { checkIfCurrentIsGuestProfile } from "@/hooks/checkIfCurrentIsGuestProfile";
import { Navigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

export function ProtectedRoute({ children }: Readonly<{ children: JSX.Element }>) {
  const isItGuest = checkIfCurrentIsGuestProfile();
  const { toast } = useToast();
  if (isItGuest) {
    toast({
      title: "Protected route",
      description: "You are not logged in.",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  } else {
    return children;
  }
}
