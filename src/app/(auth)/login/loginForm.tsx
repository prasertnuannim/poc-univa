"use client";

import { useActionState, useState } from "react";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/form/SubmitButton";
import FormInput from "@/components/form/FormInput";
import { LoginFormState } from "@/types/auth.type";
import FormAlert from "@/components/form/FormAlert";
import { loginUser } from "./action";
import RegisterModal from "../../../components/auth/RegisterForm";

export default function LoginForm() {
  const initialState: LoginFormState = {
    errors: {},
    values: { email: "admin1@example.com", password: "admin123" },
  };

  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );
  const [openRegister, setOpenRegister] = useState(false);

  if (state.success) {
    redirect("/");
  }

  return (
    <>
      <form action={formAction} className="space-y-1">
        <p className="flex justify-center text-md text-black/30 font-bold">Login with Email</p>
        <FormInput
          name="email"
          type="email"
          label="Email"
          placeholder="Your email"
          defaultValue={state.values?.email}
          error={state.errors?.email}
        />
        <FormInput
          name="password"
          type="password"
          label="Password"
          placeholder="Your password"
          defaultValue={state.values?.password}
          error={state.errors?.password}
        />
        <SubmitButton text="Login" isPending={isPending} />

        {state.errors?.general && (
          <FormAlert
            variant="error"
            title="Login failed"
            message={state.errors?.general}
          />
        )}

        <div className="flex justify-end">
          <button
            type="button"
             onClick={() => setOpenRegister(true)}
            className="hover:text-gray-400 text-gray-500 transition text-sm"
          >
            Register here
          </button>
        </div>
      </form>

      <RegisterModal open={openRegister} onOpenChange={setOpenRegister} />
    </>
  );
}
