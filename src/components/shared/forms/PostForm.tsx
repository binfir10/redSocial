
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import FileUploader from "../FileUploader"
import { PostValidations } from "@/lib/validation"
import {Models} from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { UseUserContext } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import Loader from "@/components/ui/loader"

type PostFormProps = {
  post?: Models.Document
  action: "create" | "update"
}


function PostForm({ post, action }: PostFormProps) {
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost()

  const { user } = UseUserContext()
  const navigate = useNavigate()
  const { toast } = useToast()

    const form = useForm<z.infer<typeof PostValidations>>({
    resolver: zodResolver(PostValidations),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidations>) {
    if (post && action === "update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      })
      if (!updatedPost) {
        toast({
          title: "Error",
          description: "algo salio mal",
          variant: "destructive",
        })
      }
      toast({
        title: "Post actualizado",
        description: "Post actualizado exitosamente",
        variant: "success",
      })
      return navigate(`/post/${post.$id}`)
    }
    try {
      const newPost = await createPost({
        ...values,
        userId: user.id,
      });
      
      if (!newPost) {
        toast({
          title: "Error",
          description: "algo salio mal",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Post creado",
          description: "Post creado exitosamente",
          variant: "success",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      console.error("Error in onSubmit:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Texto</FormLabel>
              <FormControl>
                <Textarea placeholder="Texto" {...field}  className="shad-textarea custom-scrollbar"/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Fotos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Lugar</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Lugar" {...field} className="shad-input" />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
     
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Tags</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Art, Expression, Learn" {...field} className="shad-input" />
              </FormControl>
              <FormDescription className="shad-form_description text-xs text-light-3">Agregar etiquetas separadas por comas</FormDescription>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button  variant={"outline"}>Cancelar</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isLoadingUpdate}>        {isLoadingCreate || isLoadingUpdate && <Loader />} {action === "create" ? "Publicar" : "Actualizar" }</Button>
  
        </div>
      </form>
    </Form>
  )
}

export default PostForm
