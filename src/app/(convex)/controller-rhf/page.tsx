"use client";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";

interface pageProps {}

const dataSchema = z.object({
  text: z.string().min(1),
  typeOfLaptop: z.enum(["apple", "windows", "linux"]),
  beverages: z.enum(["pepsi", "7up", "paperboat"]),
});

export type DataSchema = z.infer<typeof dataSchema>;

const page: FC<pageProps> = ({}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DataSchema>({
    resolver: zodResolver(dataSchema),
  });

  const submitHandler = async function (e: DataSchema) {
    // submitData(e);
  };

  const valueChangeHandler = function (e: ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
  };

  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="min-w-xl p-4 flex items-center justify-center flex-col gap-3"
      >
        <input
          required
          {...register("text")}
          type="text"
          className="w-full border-white border"
        />
        <select {...register("typeOfLaptop")} onChange={valueChangeHandler}>
          <option>apple</option>
          <option>windows</option>
          <option>linux</option>
        </select>
        <Controller
          control={control}
          name="beverages"
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue="comfortable"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="pepsi" id="r1" />
                <label htmlFor="r1">pepsi</label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="7up" id="r2" />
                <label htmlFor="r2">7up</label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="paperboat" id="r3" />
                <label htmlFor="r3">paperboat</label>
              </div>
            </RadioGroup>
          )}
        />
        <button
          className="bg-green-500 cursor-pointer px-4 py-2 rounded-md"
          type="submit"
        >
          submit
        </button>
      </form>
    </section>
  );
};

export default page;
