'use client'
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

export default function Index() {
  const [prediction, setPrediction] = useState<{
    output: string[];
    status: string;
  } | null>(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction })
      setPrediction(prediction);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className='container'>
        <p>
          Dream something with{" "}
          <a href="https://replicate.com/stability-ai/stable-diffusion">SDXL</a>:
        </p>

        <form className='form' onSubmit={handleSubmit}>
          <input type="text" name="prompt" placeholder="Enter a prompt to display an image" className="bg-transparent" />
          <button type="submit">Go!</button>
        </form>

        {error && <div>{error}</div>}

        {prediction && (
          <div>
            {prediction.output && (
              <div className='imageWrapper'>
                <Image
                  fill
                  src={prediction.output[prediction.output.length - 1]}
                  alt="output"
                  sizes='100vw'
                />
              </div>
            )}
            <p>status: {prediction.status}</p>
          </div>
        )}
      </div>

    </div>
  );
}

{/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
  <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
    <DeployButton />
    {isSupabaseConnected && <AuthButton />}
  </div>
</nav> */}

{/* <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
  <Header />
  <main className="flex-1 flex flex-col gap-6">
    <h2 className="font-bold text-4xl mb-4">Next steps</h2>
    {isSupabaseConnected ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
  </main>
</div> */}

{/* <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
  <p>
    Powered by{" "}
    <a
      href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
      target="_blank"
      className="font-bold hover:underline"
      rel="noreferrer"
    >
      Supabase
    </a>
  </p>
</footer> */}