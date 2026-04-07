"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bot,
  Send,
  User,
  Sparkles,
  MessageSquare,
  History,
  Search,
} from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "bot" | "user"
  time: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "مرحباً بك! أنا مساعدك الذكي في نظام خطوة. كيف يمكنني مساعدتك اليوم؟",
      sender: "bot",
      time: "١٠:٠٠ ص",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Mock bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: "bot",
        time: new Date().toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (input: string) => {
    const text = input.toLowerCase()
    if (text.includes("تطعيم"))
      return "يمكنك إدارة التطعيمات من قسم إدارة التطعيمات في القائمة الجانبية. هل تريد مني عرض جدول التطعيمات الإلزامي؟"
    if (text.includes("طفل"))
      return "لإضافة طفل جديد، انتقل إلى صفحة إدارة الأطفال واضغط على زر «إضافة طفل جديد». هل تحتاج لمساعدة في ملء البيانات؟"
    if (text.includes("طبيب") || text.includes("دكتور"))
      return "لدينا دليل شامل للأطباء والعيادات. يمكنك البحث بالتخصص أو الموقع الجغرافي."
    return "شكراً لاستفسارك. أنا أتعلم باستمرار لخدمتك بشكل أفضل. يمكنك سؤالي عن التطعيمات، إضافة الأطفال، أو البحث عن الأطباء."
  }

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-6 lg:flex-row">
      {/* Sidebar - Recent Chats */}
      <div className="hidden w-80 shrink-0 flex-col gap-4 lg:flex">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground">
            <History className="h-5 w-5 text-primary" />
            المحادثات السابقة
          </h2>
          <div className="relative mb-4">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث في المحادثات"
              className="w-full rounded-lg border border-border bg-background py-2 ps-9 pe-3 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            {[
              "الاستفسار عن تطعيم الشلل",
              "إضافة طفل جديد",
              "البحث عن طبيب أطفال",
              "تغيير إعدادات الإشعارات",
            ].map((chat, i) => (
              <button
                key={i}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-start text-sm hover:bg-muted transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="truncate text-foreground">{chat}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2 font-bold text-primary">
            <Sparkles className="h-4 w-4" />
            نصيحة اليوم
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            تأكد من تحديث بيانات الأطفال بانتظام لضمان تلقي التنبيهات في المواعيد
            المحددة بدقة.
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              المساعد الذكي (Bot)
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">متصل الآن</span>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-muted/5 p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-start" : "justify-end"
              } gap-3`}
            >
              {message.sender === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] space-y-1`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    message.sender === "user"
                      ? "rounded-ts-none border border-border bg-card text-foreground"
                      : "rounded-te-none bg-primary text-primary-foreground"
                  }`}
                >
                  {message.text}
                </div>
                <p className="px-1 text-[10px] text-muted-foreground">
                  {message.time}
                </p>
              </div>
              {message.sender === "bot" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-end gap-3">
              <div className="rounded-2xl rounded-te-none bg-primary px-4 py-3 text-primary-foreground">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-foreground" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-foreground [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-foreground [animation-delay:0.4s]" />
                </div>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4">
          <div className="relative flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-5 w-5 -rotate-90" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            قد يقوم المساعد الذكي بتقديم معلومات غير دقيقة أحياناً، يرجى مراجعة
            البيانات الرسمية.
          </p>
        </div>
      </div>
    </div>
  )
}
