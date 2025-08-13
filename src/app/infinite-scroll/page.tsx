"use client";
import { FC, useEffect, useState, useRef } from "react";

interface pageProps {}

const page: FC<pageProps> = () => {
  const [count, setCount] = useState<number>(10);
  const [intersecting, setIntersecting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const elementRef = useRef(null);

  const fetchData = async function () {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setCount((prev) => prev + 6);
    setLoading(false);
  };

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          fetchData();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [loading]);

  return (
    <main className="w-screen overflow-x-hidden flex items-start justify-center">
      <section className="flex flex-col w-full items-center justify-center">
        <ul className="flex flex-col items-center justify-center gap-3">
          {Array.from({ length: count }).map((_, i) => (
            <li
              key={i}
              className="flex items-center justify-center text-4xl bg-amber-500 min-w-md min-h-20"
            >
              {i}
            </li>
          ))}
        </ul>
        <div>
          <p
            ref={elementRef}
            className="py-3 px-2 bg-white text-black min-w-md my-4 text-center"
          >
            {loading ? "Loading..." : "Show More"}
          </p>
        </div>
      </section>
    </main>
  );
};

export default page;
