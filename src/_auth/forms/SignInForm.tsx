import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SignInValidations} from "@/lib/validation"
import Loader from "@/components/ui/loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { UseUserContext } from "@/context/AuthContext"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"


export default function SignInForm() {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = UseUserContext()
const navigate = useNavigate()


  const { mutateAsync: signInAccount, isPending: isSignInPending} = useSignInAccount()


  const form = useForm<z.infer<typeof SignInValidations>>({
    resolver: zodResolver(SignInValidations),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignInValidations>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({
        title: "Inicio Fallido submit",
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      })
    }
    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      toast({
        title: "inicio Exitoso",
        variant: "success",
      })
      navigate("/");
    } else {
      return toast({
        title: "Registro Fallido ya estas registrado",
        variant: "destructive",
      })

    }
  }
  return (
    <section className="flex flex-col justify-center items-center">

      <Form {...form}>
        <div className="sm:w-420 flex justify-center items-center flex-col ">
          <img src="/assets/images/logo.svg" alt="" className="bg-background2 p-1 rounded-full" />
          <h2 className="h3-bold md:h2-bold">Ingresa a tu cuenta</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">Para usar Snapgram ingresa los datos de tu cuenta</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" className="shad-input" {...field} />
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
            {isUserLoading || isSignInPending ? <Loader /> : "Inicia Sesion"}
          </Button>
        </form>
        <p className="text-small-regular dark:text-light-2 text-light-4 text-center mt-2">
          ¿No tienes una cuenta?
          <Link to="/sign-up" className="text-primary-500 ml-1 hover:text-primary-600 cursor-pointer">Registrate</Link>

        </p>
      </Form>
    </section>

  )
}
