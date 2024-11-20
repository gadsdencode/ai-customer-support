import { CopilotChat } from "@copilotkit/react-ui";
 
export function CopilotCustomerSupport() {
  return (
    <CopilotChat
      instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
      labels={{
        title: "Customer Support AI",
        initial: "Hi! 👋 How can I assist you today?",
      }}
    />
  );
}