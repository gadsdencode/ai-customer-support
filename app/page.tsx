// app/page.tsx

import { CopilotCustomChatUI } from "./components/ai/CopilotCustomChatUI";
// import CopilotChatUI from "./copilot/CopilotChatUI";
export default function Home() {
  return (
    <div className="pb-28 font-[family-name:var(--font-geist-sans)] bg-white">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className='mt-5 mx-auto'>
        <CopilotCustomChatUI />
        {/* <CopilotChatUI /> */}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
