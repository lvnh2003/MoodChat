import Button from "@/components/Button";
import Input from "@/components/Input";
import { checkMood } from "@/feature/api/checkMood";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function Home() {
  const [value, setValue] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const handleClick = async() =>{
    try {
      const res = await checkMood({text: value});
      setMood(res.sentiment[0].label)
    } catch (error) {
      console.log(error);
       
    }
  }
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
     <Input
        name="text"
        onChange={(event) => {
          setValue(event.target.value); 
        }}
        value={value}
      />
      <Button text="Submit" onClick={handleClick}/>
      <div>Your mood: {mood}</div>
    </div>
  );
}
