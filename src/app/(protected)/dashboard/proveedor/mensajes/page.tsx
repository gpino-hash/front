"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "me" | "other";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "c1",
    name: "Laura Giménez",
    initials: "LG",
    lastMessage: "Perfecto, te espero el jueves a las 9",
    time: "Hace 5 min",
    unread: 2,
    messages: [
      { id: "m1", sender: "other", text: "Hola, necesito instalar un ventilador de techo en el living", time: "10:15" },
      { id: "m2", sender: "me", text: "Hola Laura! Sí, puedo hacerlo. Necesitaría saber si ya tiene la conexión eléctrica en el techo.", time: "10:20" },
      { id: "m3", sender: "other", text: "Sí, ya hay un punto de luz ahí", time: "10:22" },
      { id: "m4", sender: "me", text: "Genial, entonces sería un trabajo de aprox 1 hora. Te puedo pasar el jueves a las 9 hs. El costo sería $8.500.", time: "10:25" },
      { id: "m5", sender: "other", text: "Perfecto, te espero el jueves a las 9", time: "10:30" },
    ],
  },
  {
    id: "c2",
    name: "Mateo Rossi",
    initials: "MR",
    lastMessage: "Dale, mañana confirmo el horario",
    time: "Hace 2h",
    unread: 0,
    messages: [
      { id: "m6", sender: "other", text: "Buen día, necesito una revisión del tablero eléctrico", time: "08:00" },
      { id: "m7", sender: "me", text: "Buen día Mateo. Puedo ir esta semana. Tengo disponibilidad martes o jueves a la tarde.", time: "08:15" },
      { id: "m8", sender: "other", text: "Dale, mañana confirmo el horario", time: "08:20" },
    ],
  },
  {
    id: "c3",
    name: "Delfina Sosa",
    initials: "DS",
    lastMessage: "Gracias por el presupuesto!",
    time: "Ayer",
    unread: 1,
    messages: [
      { id: "m9", sender: "other", text: "Hola! Necesito hacer un cableado nuevo en una oficina de 50m2", time: "14:00" },
      { id: "m10", sender: "me", text: "Hola Delfina! Necesitaría pasar a ver el espacio para darte un presupuesto preciso. ¿Te sirve esta semana?", time: "14:30" },
      { id: "m11", sender: "other", text: "Sí, miércoles a la mañana puedo", time: "14:35" },
      { id: "m12", sender: "me", text: "Perfecto, te paso el presupuesto después de la visita. Calculo $28.000 aprox por los materiales + mano de obra.", time: "15:00" },
      { id: "m13", sender: "other", text: "Gracias por el presupuesto!", time: "15:05" },
    ],
  },
  {
    id: "c4",
    name: "Pablo Méndez",
    initials: "PM",
    lastMessage: "Ok, nos vemos",
    time: "Hace 3 días",
    unread: 0,
    messages: [
      { id: "m14", sender: "me", text: "Pablo, ya terminé la reparación del circuito. Quedó todo funcionando.", time: "17:00" },
      { id: "m15", sender: "other", text: "Ok, nos vemos", time: "17:10" },
    ],
  },
];

export default function MensajesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockConversations.find((c) => c.id === selectedId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100 lg:hidden">Mensajes</h1>

      <div className="flex bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden min-h-[calc(100vh-16rem)]">
        {/* Conversation list */}
        <div
          className={cn(
            "w-full lg:w-80 shrink-0 border-r border-slate-200 dark:border-zinc-800",
            selectedId ? "hidden lg:block" : ""
          )}
        >
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 hidden lg:block">Mensajes</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50",
                  selectedId === conv.id && "bg-orange-50 dark:bg-orange-950/20"
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                    {conv.initials}
                  </div>
                  {conv.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 truncate">
                      {conv.name}
                    </p>
                    <span className="text-[10px] text-zinc-400 shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message thread */}
        <div className={cn("flex-1 flex flex-col", !selectedId ? "hidden lg:flex" : "")}>
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-zinc-300 dark:text-zinc-700 mb-2 block">
                  chat
                </span>
                <p className="text-sm text-zinc-500">Seleccioná una conversación para ver los mensajes</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-zinc-800">
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                  {selected.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">{selected.name}</p>
                  <p className="text-[11px] text-zinc-400">Cliente</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selected.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5",
                        msg.sender === "me"
                          ? "bg-orange-500 text-white rounded-br-md"
                          : "bg-slate-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-md"
                      )}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={cn(
                          "text-[10px] mt-1",
                          msg.sender === "me" ? "text-orange-200" : "text-zinc-400"
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Escribí un mensaje..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                  <button className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-lg">send</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}