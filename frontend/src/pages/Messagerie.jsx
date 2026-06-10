// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { COLORS } from "../constants/colors";
// import { ArrowLeft, Send, UserCircle } from "lucide-react";

// export default function Messagerie() {
//   const navigate = useNavigate();
//   const { utilisateur } = useAuth();
//   const [conversations, setConversations] = useState([]);
//   const [activeConv, setActiveConv] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Charger les conversations existantes
//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const res = await api.get('chat/conversations/');
//         setConversations(res.data);
//         if (res.data.length > 0 && !activeConv) {
//           setActiveConv(res.data[0]);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchConversations();
//   }, []);

//   // Charger les messages d'une conversation
//   const fetchMessages = async (convId) => {
//     try {
//       const res = await api.get(`chat/messages/?conversation=${convId}`);
//       setMessages(res.data);
//       scrollToBottom();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (activeConv) {
//       fetchMessages(activeConv.id);
//     }
//   }, [activeConv]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;
//     setSending(true);
//     try {
//     //   await api.post(`chat/conversations/${activeConv.id}/send_message/`, { content: newMessage });
//     await api.post(`chat/conversations/${activeConv.id}/send/`, { content: newMessage });
//       setNewMessage("");
//       fetchMessages(activeConv.id);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSending(false);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Chargement...</div>;

//   return (
//     <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
//       <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//         <header style={{
//           padding: "20px", display: "flex", alignItems: "center", gap: "12px",
//           borderBottom: `1px solid ${COLORS.outlineVariant}30`,
//         }}>
//           <button onClick={() => navigate(-1)} style={{ background: "none", border: "none" }}>
//             <ArrowLeft size={24} color={COLORS.primary} />
//           </button>
//           <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>Messagerie</span>
//         </header>

//         <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
//           {/* Liste des conversations */}
//           <div style={{ width: "40%", borderRight: `1px solid ${COLORS.outlineVariant}`, overflowY: "auto" }}>
//             {conversations.map(conv => (
//               <div
//                 key={conv.id}
//                 onClick={() => setActiveConv(conv)}
//                 style={{
//                   padding: "12px",
//                   borderBottom: `1px solid ${COLORS.outlineVariant}`,
//                   backgroundColor: activeConv?.id === conv.id ? COLORS.surfaceContainer : "transparent",
//                   cursor: "pointer",
//                 }}
//               >
//                 <div style={{ fontWeight: 600 }}>
//                   {utilisateur.role === "parent" ? conv.medecin_name : conv.parent_name}
//                 </div>
//                 <div style={{ fontSize: "12px", color: COLORS.onSurfaceVariant }}>
//                   {conv.last_message?.slice(0, 30)}...
//                 </div>
//               </div>
//             ))}
//             {conversations.length === 0 && (
//               <div style={{ padding: "20px", textAlign: "center", color: COLORS.onSurfaceVariant }}>
//                 Aucune conversation. Veuillez contacter l'administrateur.
//               </div>
//             )}
//           </div>

//           {/* Zone de chat */}
//           <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
//             {activeConv ? (
//               <>
//                 <div style={{ padding: "12px", borderBottom: `1px solid ${COLORS.outlineVariant}`, fontWeight: 600 }}>
//                   {utilisateur.role === "parent" ? activeConv.medecin_name : activeConv.parent_name}
//                 </div>
//                 <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
//                   {messages.map(msg => (
//                     <div
//                       key={msg.id}
//                       style={{
//                         alignSelf: msg.sender === utilisateur.id ? "flex-end" : "flex-start",
//                         backgroundColor: msg.sender === utilisateur.id ? COLORS.primary : COLORS.surfaceContainerLow,
//                         color: msg.sender === utilisateur.id ? "white" : COLORS.onSurface,
//                         borderRadius: "20px",
//                         padding: "8px 12px",
//                         maxWidth: "80%",
//                       }}
//                     >
//                       <div style={{ fontSize: "12px" }}>{msg.content}</div>
//                       <div style={{ fontSize: "10px", opacity: 0.7 }}>
//                         {new Date(msg.created_at).toLocaleTimeString()}
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>
//                 <div style={{ padding: "12px", borderTop: `1px solid ${COLORS.outlineVariant}`, display: "flex", gap: "8px" }}>
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={e => setNewMessage(e.target.value)}
//                     onKeyPress={e => e.key === "Enter" && sendMessage()}
//                     placeholder="Écrivez votre message..."
//                     style={{ flex: 1, padding: "8px 12px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }}
//                   />
//                   <button onClick={sendMessage} disabled={sending} style={{ background: COLORS.primary, border: "none", borderRadius: "999px", padding: "8px 12px", color: "white" }}>
//                     <Send size={18} />
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div style={{ textAlign: "center", padding: "2rem", color: COLORS.onSurfaceVariant }}>
//                 Sélectionnez une conversation
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";
import { ArrowLeft, Send, UserCircle, PlusCircle, ChevronLeft } from "lucide-react";

export default function Messagerie() {
  const navigate = useNavigate();
  const { utilisateur } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMedecinList, setShowMedecinList] = useState(false);
  const [medecins, setMedecins] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('chat/conversations/');
        setConversations(res.data);
        if (res.data.length > 0 && !activeConv) {
          setActiveConv(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const fetchMessages = async (convId) => {
    try {
      const res = await api.get(`chat/messages/?conversation=${convId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
    }
  }, [activeConv]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await api.post(`chat/conversations/${activeConv.id}/send/`, { content: newMessage });
      setNewMessage("");
      fetchMessages(activeConv.id);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const loadMedecins = async () => {
  //   try {
  //     const res = await api.get('chat/conversations/medecins-disponibles/');
  //     setMedecins(res.data);
  //     setShowMedecinList(true);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Impossible de charger la liste des médecins");
  //   }
  // };

  // const startConversation = async (medecin) => {
  //   try {
  //     const res = await api.post('chat/conversations/creer-conversation/', {
  //       medecin_id: medecin.id
  //     });
  //     const newConv = {
  //       id: res.data.id,
  //       other_name: res.data.other_name,
  //       last_message: null
  //     };
  //     setConversations(prev => [newConv, ...prev]);
  //     setActiveConv(newConv);
  //     setShowMedecinList(false);
  //     fetchMessages(newConv.id);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Erreur lors de la création de la conversation");
  //   }
  // };

  const loadMedecins = async () => {
  try {
    const res = await api.get('chat/parent/medecins/');   // nouvelle URL
    setMedecins(res.data);
    setShowMedecinList(true);
  } catch (err) {
    console.error(err);
    alert("Impossible de charger la liste des médecins");
  }
};

const startConversation = async (medecin) => {
  try {
    const res = await api.post('chat/parent/medecins/', { medecin_id: medecin.id });   // nouvelle URL
    const newConv = {
      id: res.data.id,
      other_name: res.data.other_name,
      last_message: null
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConv(newConv);
    setShowMedecinList(false);
    fetchMessages(newConv.id);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la création de la conversation");
  }
};

  if (loading) return <div style={{ textAlign: "center", padding: "2rem" }}>Chargement...</div>;

  return (
    <div style={{ backgroundColor: "#1B3A4B", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "412px", backgroundColor: COLORS.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{
          padding: "20px", display: "flex", alignItems: "center", gap: "12px",
          borderBottom: `1px solid ${COLORS.outlineVariant}30`,
        }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none" }}>
            <ArrowLeft size={24} color={COLORS.primary} />
          </button>
          <span style={{ fontSize: "20px", fontWeight: 800, color: COLORS.primary }}>Messagerie</span>
        </header>

        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* Liste des conversations */}
          <div style={{ width: "40%", borderRight: `1px solid ${COLORS.outlineVariant}`, overflowY: "auto" }}>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                style={{
                  padding: "12px",
                  borderBottom: `1px solid ${COLORS.outlineVariant}`,
                  backgroundColor: activeConv?.id === conv.id ? COLORS.surfaceContainer : "transparent",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>{conv.other_name}</div>
                <div style={{ fontSize: "12px", color: COLORS.onSurfaceVariant }}>
                  {conv.last_message?.slice(0, 30) || "Nouvelle conversation"}
                </div>
              </div>
            ))}
            {utilisateur.role === "parent" && (
              <div
                onClick={loadMedecins}
                style={{ padding: "12px", textAlign: "center", cursor: "pointer", color: COLORS.primary, borderTop: `1px solid ${COLORS.outlineVariant}` }}
              >
                <PlusCircle size={20} style={{ display: "inline", marginRight: "8px" }} />
                Nouvelle conversation
              </div>
            )}
            {conversations.length === 0 && utilisateur.role !== "parent" && (
              <div style={{ padding: "20px", textAlign: "center" }}>Aucune conversation.</div>
            )}
          </div>

          {/* Zone de chat ou liste des médecins */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
            {showMedecinList ? (
              <>
                <div style={{ padding: "12px", borderBottom: `1px solid ${COLORS.outlineVariant}`, display: "flex", alignItems: "center", gap: "8px" }}>
                  <button onClick={() => setShowMedecinList(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <ChevronLeft size={20} color={COLORS.primary} />
                  </button>
                  <span style={{ fontWeight: 600 }}>Choisissez un médecin</span>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
                  {medecins.map(m => (
                    <div
                      key={m.id}
                      onClick={() => startConversation(m)}
                      style={{ padding: "12px", borderBottom: `1px solid ${COLORS.outlineVariant}`, cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}
                    >
                      <UserCircle size={32} color={COLORS.primary} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.nom}</div>
                        <div style={{ fontSize: "12px", color: COLORS.onSurfaceVariant }}>{m.specialite} - {m.ville}</div>
                      </div>
                    </div>
                  ))}
                  {medecins.length === 0 && (
                    <div style={{ textAlign: "center", padding: "2rem", color: COLORS.onSurfaceVariant }}>
                      Aucun médecin disponible pour le moment.
                    </div>
                  )}
                </div>
              </>
            ) : activeConv ? (
              <>
                <div style={{ padding: "12px", borderBottom: `1px solid ${COLORS.outlineVariant}`, fontWeight: 600 }}>
                  {activeConv.other_name}
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: msg.sender === utilisateur.id ? "flex-end" : "flex-start",
                        backgroundColor: msg.sender === utilisateur.id ? COLORS.primary : COLORS.surfaceContainerLow,
                        color: msg.sender === utilisateur.id ? "white" : COLORS.onSurface,
                        borderRadius: "20px",
                        padding: "8px 12px",
                        maxWidth: "80%",
                      }}
                    >
                      <div style={{ fontSize: "12px" }}>{msg.content}</div>
                      <div style={{ fontSize: "10px", opacity: 0.7 }}>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div style={{ padding: "12px", borderTop: `1px solid ${COLORS.outlineVariant}`, display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === "Enter" && sendMessage()}
                    placeholder="Écrivez votre message..."
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "40px", border: `1px solid ${COLORS.outlineVariant}`, backgroundColor: COLORS.surfaceContainerLow }}
                  />
                  <button onClick={sendMessage} disabled={sending} style={{ background: COLORS.primary, border: "none", borderRadius: "999px", padding: "8px 12px", color: "white" }}>
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", color: COLORS.onSurfaceVariant }}>
                Sélectionnez une conversation ou créez-en une nouvelle
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}