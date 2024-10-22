"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { v4 as uuidv4 } from 'uuid';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const close = async (uuid) => {
    const liff = (await import('@line/liff')).default;

    // Construct the URI with the UUID as a query parameter
    const uriWithUuid = `https://liff.line.me/2006477887-2orv54av?uuid=${uuid}`;

    // Send the message with the updated URI
    liff
      .sendMessages([
        {
          "type": "template",
          "altText": "This is a buttons template",
          "template": {
            "type": "buttons",
            "title": "Mood Check",
            "text": "Click the button below to share your mood.",
            "actions": [
              {
                "type": "uri",
                "label": "Click Here",
                "uri": uriWithUuid // Use the URI with UUID
              }
            ]
          }
        }
      ])
      .then(() => {
        console.log("Message sent successfully.");
      })
      .catch((err) => {
        console.error("Error sending message:", err);
      });

    // Check if the LIFF app is running inside the LINE client
    if (!liff.isInClient()) {
        window.alert('This button is unavailable as LIFF is currently being opened in an external browser.');
    } else {
        liff.closeWindow(); // Close the LIFF window if inside the LINE client
    }
}

const items = [
  {
    id: "mood_check",
    label: "Mood Check",
  },
  {
    id: "relationship",
    label: "Relationship",
  },
  {
    id: "interested_topics",
    label: "Interested Topics",
  },
]

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
})

export default function CheckboxReactHookFormMultiple() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  })

  function onSubmit(data) {
    const uuid = uuidv4(); // Generate a unique UUID

    // (Optional) Store the UUID with the form data in Firebase Realtime Database
    // This ensures you can reference the submission using the UUID
    // Refer to section 4 for detailed implementation

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-auto">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    form.reset() // Reset the form fields
    close(uuid) // Pass the generated UUID to the close function
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">What do you want to measure</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormDescription>
                      Select the areas you want to measure.
                    </FormDescription>
                  </div>
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex items-center space-x-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, item.id])
                                  } else {
                                    field.onChange(
                                      field.value.filter((value) => value !== item.id)
                                    )
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}