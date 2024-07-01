"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

// const dispatch = useAppDispatch();

export default function Home() {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (user.role == "cleaner") {
      router.push("/client/dashboard/cleaner/scan-qr-cleaner");
    }
  }, []);

  return <main>main</main>;
}
