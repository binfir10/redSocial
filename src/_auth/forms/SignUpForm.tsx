import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignUpValidations } from "@/lib/validation";
import Loader from "@/components/ui/loader";
import { Link, useNavigate } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { UseUserContext } from "@/context/AuthContext";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthUser} = UseUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount} =
    useSignInAccount();

  const form = useForm<z.infer<typeof SignUpValidations>>({
    resolver: zodResolver(SignUpValidations),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpValidations>) {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({
        title: "Registro Fallido",
        description: "Something went wrong. Please try again.",
      });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "Registro Fallido",

      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      toast({
        title: "Registro Exitoso",
        variant: "success",
      });
      navigate("/");
    } else {
      return toast({
        title: "Registro Fallido",
      });
    }
  }
  return (
    <section className="flex flex-col justify-center items-center">
      <Form {...form}>
        <div className="sm:w-420 flex justify-center items-center flex-col ">
          <img src="/assets/images/logo.svg" alt="" />
          <h2 className="h3-bold md:h2-bold">Crea una nueva cuenta</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
            Para usar Snapgram ingresa los datos de tu cuenta
          </p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nombre"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuario</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Usuario"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} placeholder="********" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount ? <Loader /> : "Crear cuenta"}
          </Button>
        </form>
        <p className="text-small-regular dark:text-light-2  text-light-4 text-center mt-2">
          ¿Ya tienes una cuenta?
          <Link
            to="/sign-in"
            className="text-primary-500 hover:text-primary-600 cursor-pointer">
            {" "}
            Iniciar sesión
          </Link>
        </p>
      </Form>
    </section>
  );
}
