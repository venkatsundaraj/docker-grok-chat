"use client";
import {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { Icon } from "@/app/_components/icons";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const createTodo = useMutation(api.todos.createTodo);
  const getTodos = useQuery(api.todos.getTodos);
  const deleteTodos = useMutation(api.todos.deleteTodos);
  const submitHandler = async function (e: FormEvent) {
    e.preventDefault();
    await createTodo({ text: inputValue });
    setInputValue("");
  };

  useEffect(() => {
    console.log(true);
    if (getTodos && getTodos?.length > 10) {
      console.log("the length is more than ten");
      const fetchData = async function () {
        const res = await deleteTodos();
        console.log(getTodos, res);
      };
      fetchData();
    }
  }, [getTodos]);

  const changeHandler = function (e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  };
  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen">
      <h2>
        <Link
          target="_blank"
          className="underline inline-flex items-center justify-center gap-3"
          href={"www.venkatsundaraj.dev/blog/my-journey-with-convex"}
        >
          My Journey with Convex <Icon.ArrowRight />
        </Link>
      </h2>
      <form
        onSubmit={submitHandler}
        className="min-w-xl p-4 flex items-center justify-center flex-col gap-3"
      >
        <input
          value={inputValue}
          onChange={changeHandler}
          type="text"
          className="w-full border-white border"
        />
        <button
          className="bg-green-500 cursor-pointer px-4 py-2 rounded-md"
          type="submit"
        >
          submit
        </button>
      </form>
      <ul className="flex flex-col items-start justify-center gap-2">
        {getTodos?.map((item, i) => (
          <li className="text-white text-center w-full" key={i}>
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default page;
