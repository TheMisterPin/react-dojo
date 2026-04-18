import { Playground } from "@/components/Playground"
import type { Concept } from "./types"

export const estado: Concept[] = [
  {
    id: "useState",
    label: "useState",
    kicker: "Hook · Estado local",
    title: "Una memoria mínima",
    lede: "useState convierte un componente en algo que recuerda. Cada llamada reserva una celda de memoria atada a esa instancia, y cada actualización agenda una nueva ronda de render.",
    sections: [
      {
        heading: "La firma",
        body: (
          <p>
            <code>const [estado, setEstado] = useState(inicial)</code>. El argumento puede ser un valor o una función — usa la función cuando el cálculo inicial es costoso, así solo corre en el primer render.
          </p>
        ),
      },
      {
        heading: "Actualización funcional",
        body: (
          <p>
            Cuando el siguiente estado depende del anterior, pasa una función a <code>setEstado</code>. React te entrega el valor más reciente, evitando carreras al actualizar varias veces seguidas dentro del mismo evento.
          </p>
        ),
      },
    ],
    playground: (
      <Playground
        files={{
          "/App.js": `import { useState } from "react";

// Inicial costoso → función. Solo corre una vez.
function inicial() {
  console.log("calculando inicial...");
  return 0;
}

export default function App() {
  const [count, setCount] = useState(inicial);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <p style={{ fontSize: 48, margin: 0 }}>{count}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={() => setCount((c) => c + 1)}>+1</button>
        <button onClick={() => setCount((c) => c - 1)}>−1</button>
        <button onClick={() => {
          // Tres updates funcionales se aplican en cadena.
          setCount((c) => c + 1);
          setCount((c) => c + 1);
          setCount((c) => c + 1);
        }}>+3 (funcional)</button>
        <button onClick={() => setCount(0)}>reset</button>
      </div>
    </div>
  );
}
`,
        }}
      />
    ),
    pitfalls: [
      "Usar setEstado(estado + 1) tres veces seguidas suma 1, no 3 — React lee el valor capturado por el render.",
      "El estado no se 'mezcla' como en clases: si guardas un objeto, debes copiarlo entero al actualizar.",
      "Cambiar el array de dependencias de useState no existe — el inicial solo se honra en el primer render.",
    ],
  },
  {
    id: "useReducer",
    label: "useReducer",
    kicker: "Hook · Estado complejo",
    title: "Transiciones explícitas",
    lede: "Cuando el siguiente estado depende del anterior y de qué pasó, useReducer convierte la lógica difusa de varios setEstado en una transición nombrada y testeable.",
    sections: [
      {
        heading: "Forma del reducer",
        body: (
          <p>
            <code>(estado, acción) =&gt; nuevoEstado</code>. Mantén el reducer puro: sin fetch, sin mutación, sin <code>Math.random()</code>. Si necesitas efectos, dispárlos después del <code>dispatch</code>.
          </p>
        ),
      },
      {
        heading: "Cuándo prefiere a useState",
        body: (
          <p>
            Cuando hay <em>varias formas</em> de modificar el mismo estado, cuando la lógica de transición se repite en varios eventos, o cuando quieres registrar/depurar cada cambio en un único punto.
          </p>
        ),
      },
    ],
    playground: (
      <Playground
        files={{
          "/App.js": `import { useReducer } from "react";

const initial = { items: [], next: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return {
        next: state.next + 1,
        items: [...state.items, { id: state.next, text: action.text, done: false }],
      };
    case "toggle":
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.id ? { ...it, done: !it.done } : it
        ),
      };
    case "remove":
      return { ...state, items: state.items.filter((it) => it.id !== action.id) };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initial);
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = e.currentTarget.text.value.trim();
          if (text) dispatch({ type: "add", text });
          e.currentTarget.reset();
        }}
      >
        <input name="text" placeholder="agregar tarea..." autoFocus />
      </form>
      <ul style={{ paddingLeft: 18 }}>
        {state.items.map((it) => (
          <li key={it.id} style={{ textDecoration: it.done ? "line-through" : "none" }}>
            <span onClick={() => dispatch({ type: "toggle", id: it.id })} style={{ cursor: "pointer" }}>
              {it.text}
            </span>
            <button onClick={() => dispatch({ type: "remove", id: it.id })} style={{ marginLeft: 8 }}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
        }}
      />
    ),
    pitfalls: [
      "El reducer DEBE ser puro: nada de fetch, console.log con efectos, o IDs aleatorios.",
      "No mutes el estado: state.items.push() rompe React. Devuelve siempre objetos/arrays nuevos.",
      "Si guardas valores que cambian poco, useReducer puede ser overkill — useState basta.",
    ],
  },
  {
    id: "useRef",
    label: "useRef",
    kicker: "Hook · Referencia mutable",
    title: "Una caja que persiste",
    lede: "useRef te da una caja con la propiedad .current que sobrevive entre renders pero, a diferencia del estado, no dispara re-renders cuando cambias su contenido.",
    sections: [
      {
        heading: "Dos usos honestos",
        body: (
          <>
            <p><strong>Acceder al DOM:</strong> pásala a un nodo con <code>ref={"{miRef}"}</code> y lee <code>miRef.current</code> después del montaje.</p>
            <p><strong>Guardar valores entre renders:</strong> contadores, IDs de timers, valores previos — cualquier cosa que necesitas recordar pero no quieres que dispare re-renders.</p>
          </>
        ),
      },
      {
        heading: "Por qué no estado",
        body: (
          <p>
            Si renderizar el valor no cambia el UI, no debe estar en el estado. Mantenerlo en una ref evita ciclos de render y mantiene el componente más rápido.
          </p>
        ),
      },
    ],
    playground: (
      <Playground
        files={{
          "/App.js": `import { useRef, useState, useEffect } from "react";

export default function App() {
  const inputRef = useRef(null);
  const renders = useRef(0);
  const [text, setText] = useState("");

  useEffect(() => { renders.current += 1; });

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="escribe algo..."
        style={{ padding: 8, width: "100%" }}
      />
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={() => inputRef.current?.focus()}>foco</button>
        <button onClick={() => { inputRef.current.value = ""; setText(""); }}>limpiar</button>
      </div>
      <p style={{ marginTop: 16, fontFamily: "monospace", color: "var(--fg-muted)" }}>
        renders: {renders.current} · texto: "{text}"
      </p>
      <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
        Fíjate: el contador NO dispara re-renders. Solo cambia al renderizar por otro motivo.
      </p>
    </div>
  );
}
`,
        }}
      />
    ),
    pitfalls: [
      "No leas ref.current durante el render para tomar decisiones — su valor puede no estar 'oficialmente' actualizado todavía.",
      "Mutar ref.current dentro del render rompe la pureza esperada. Hazlo en eventos o efectos.",
      "Si necesitas reaccionar a un cambio, necesitas estado, no una ref.",
    ],
  },
]
