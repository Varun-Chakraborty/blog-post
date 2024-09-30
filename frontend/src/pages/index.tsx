export { Home } from "./home";
export { Messages } from "./messages";
export { Notifications } from "./notifications";
export { Dashboard } from "./dashboard";
export { CreatePost } from "./createPost";
export { Search } from "./search";
export { NotFound } from "./notFound";
export { ShowPost } from "./showPost";
export { Settings } from "./settings";
export { Profile } from "./profile";

import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
} from "@/components/forms";

export function Login() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <LoginForm />
    </div>
  );
}

export function Register() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <RegisterForm />
    </div>
  );
}

export function ForgotPassword() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <ForgotPasswordForm />
    </div>
  );
}
