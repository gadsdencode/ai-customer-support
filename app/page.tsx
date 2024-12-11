// app/page.tsx

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
      </footer>
    </div>
  );
}
