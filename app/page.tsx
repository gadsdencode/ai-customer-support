// app/page.tsx

import Image from "next/image";
import { CopilotCustomChatUI } from "./components/ai/CopilotCustomChatUI";
// import CopilotChatUI from "./copilot/CopilotChatUI";
import { Instructions } from "./components/Instructions";

export default function Home() {
  return (
    <div className="pb-28 font-[family-name:var(--font-geist-sans)] bg-white">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className='mt-5 m-3 p-3'>
        <Instructions />
        <CopilotCustomChatUI />
        {/* <CopilotChatUI /> */}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://overture-systems.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Overture Systems Solutions
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://kainbridge.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Kainbridge
        </a>
      </footer>
    </div>
  );
}
