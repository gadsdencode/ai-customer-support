import * as React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, ThumbsUp, AlertCircle } from 'lucide-react'

const Instructions: React.FC = () => {
  return (
    <Card className="w-full max-w-full mx-auto border border-blue-500/30 rounded-lg">
      {/* <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">How to Interact with Customer Support AI</CardTitle>
      </CardHeader> */}
      <CardContent className="space-y-4 border border-blue-500/30 rounded-lg m-2 p-3">
      <p className="text-2xl font-bold text-center">How to Interact with Customer Support AI</p>
        <InstructionItem
          icon={<MessageCircle className="w-6 h-6 text-blue-500" />}
          title="Ask Your Question"
          description="Type your question in the chat box below. Use the keyword 'research' and the Customer Support AI will search for relevant information and provide sources."
        />
        <InstructionItem
          icon={<ThumbsUp className="w-6 h-6 text-green-500" />}
          title="Try asking..."
          description="Please research Inteleos' POCUS certification program and requirements."
        />
        <InstructionItem
          icon={<AlertCircle className="w-6 h-6 text-yellow-500" />}
          title="Follow-up if Needed"
          description="If you need more clarity, don't hesitate to ask follow-up questions or request further explanation from Customer Support AI."
        />
      </CardContent>
    </Card>
  )
}

interface InstructionItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

const InstructionItem: React.FC<InstructionItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  )
}

export { Instructions }