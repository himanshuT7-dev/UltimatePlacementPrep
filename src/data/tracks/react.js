export const REACT_TRACK = {
  id: 'react',
  label: 'React.js',
  icon: 'react',
  color: '#8b5cf6',
  totalTopics: 20,
  description: 'Master React.js from fundamentals to advanced concepts, hooks, and routing.',
  modules: [
    {
      id: 'react-m1',
      title: 'Module 1: React Fundamentals & Advanced Concepts',
      topics: [
        {
          id: 'react-1',
      title: 'JSX, Virtual DOM & Fiber Architecture',
      level: 'Beginner',
      badge: 'badge-purple',
      summary: `React uses a Virtual DOM to optimize updates.

• Virtual DOM: A lightweight in-memory representation of the real DOM.
• Diffing Algorithm: Compares the new Virtual DOM with the old one to identify minimum changes needed.
• Reconciliation: The process of batching updates and applying them to the real DOM.
• React Fiber: A complete rewrite of the core algorithm that makes rendering interruptible and prioritizes urgent updates.
• JSX: A syntax extension that looks like HTML but compiles to React.createElement() calls.`,
      native: {
        Hinglish: "Virtual DOM ek rough copy ki tarah hai. Direct original copy me changes karne se pehle, rough copy me check karke sirf zaruri changes original me daalte hain.",
        Hindi: "वर्चुअल डोम एक रफ कॉपी की तरह है। सीधे मूल में परिवर्तन करने के बजाय, रफ कॉपी में जांच करके केवल आवश्यक परिवर्तन मूल में डाले जाते हैं।",
        Tamil: "Virtual DOM என்பது ஒரு வரைவு நகல் போன்றது. நேரடி மாற்றங்களுக்கு பதிலாக முதலில் இதில் சோதித்து தேவையானது மட்டும் அசல் DOM இல் சேர்க்கப்படும்.",
        Telugu: "వర్చువల్ డామ్ అనేది రఫ్ కాపీ లాంటిది. డైరెక్ట్ గా ఒరిజినల్ లో మార్పులు చేసే బదులు ఇందులో చెక్ చేసి అవసరమైనవి మాత్రమే అసలుకి జోడిస్తారు."
      },
      code: `// JSX Example
const element = <h1 className="greeting">Hello, world!</h1>;

// Compiles to:
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);`,
      lang: 'javascript',
      quiz: {
        question: 'What is the main advantage of the Virtual DOM?',
        options: ['It directly manipulates the browser DOM faster', 'It batches updates and minimizes direct DOM manipulation', 'It is a new type of database', 'It allows writing HTML in JavaScript'],
        correct: 1,
        explanation: 'The Virtual DOM improves performance by batching updates and determining the absolute minimum number of changes required to the real DOM, which is traditionally a slow operation.'
      }
    },
    {
      id: 'react-2',
      title: 'Props vs State & Component Basics',
      level: 'Beginner',
      badge: 'badge-purple',
      summary: `Props (Properties) and State are both plain JavaScript objects that hold information, but they have different purposes.

• Props: Properties passed from a parent component to a child component that are read-only (immutable) from the child's perspective.
• State: Data managed internally by the component itself that can change over time.
• Lifting State Up: A pattern where state shared by multiple sibling components is moved to their closest common parent.
• Controlled Components: Components that have their form data controlled by React state.
• Uncontrolled Components: Components that keep their own state internally and use refs to access the DOM values.`,
      native: {
        Hinglish: "Props matlab jo parents se milta hai (unchangeable), aur State apna personal bank balance hai jo hum change kar sakte hain.",
        Hindi: "प्रॉप्स माता-पिता से मिलने वाली चीजों की तरह हैं (अपरिवर्तनीय), और स्टेट आपका निजी बैंक बैलेंस है जिसे आप बदल सकते हैं।",
        Tamil: "Props என்பது பெற்றோர் தருவது (மாற்ற முடியாது), State என்பது நமது சொந்த பணம், அதை நாமே நிர்வகிக்கலாம்.",
        Telugu: "Props అనేది తల్లిదండ్రులు ఇచ్చేవి (మార్చలేము), State అనేది మన సొంత డబ్బు, దాన్ని మనమే మార్చుకోవచ్చు."
      },
      code: `// Controlled Component & Lifting State
function Parent() {
  const [text, setText] = useState('');
  return <Child value={text} onChange={(e) => setText(e.target.value)} />
}

function Child({ value, onChange }) {
  // Props 'value' and 'onChange' are read-only here
  return <input type="text" value={value} onChange={onChange} />
}`,
      lang: 'javascript',
      quiz: {
        question: 'Which of the following is true about Props?',
        options: ['They are mutable by the receiving component', 'They are strictly for styling', 'They are read-only for the receiving component', 'They replace State in functional components'],
        correct: 2,
        explanation: 'Props are passed down from parents and cannot be directly modified by the child component receiving them.'
      }
    },
    {
      id: 'react-3',
      title: 'useState Deep Dive',
      level: 'Intermediate',
      badge: 'badge-purple',
      summary: `useState is a Hook that lets you add state to functional components.

• State Updates: Asynchronous operations where calling the setter does not immediately change the state variable in the current render cycle.
• Functional Updates: Form used when updates depend on the previous state (e.g., setCount(prev => prev + 1)).
• Lazy Initialization: Passing a function to useState for expensive initial state computations.
• Automatic Batching: In React 18, multiple setState calls inside a single event handler trigger only one re-render for better performance.`,
      native: {
        Hinglish: "State update turant nahi hota, thoda time leta hai. Agar purani value pe update depend karta hai, toh hamesha 'prev => prev + 1' use karo.",
        Hindi: "स्टेट अपडेट तुरंत नहीं होता। यदि नया अपडेट पुराने मान पर निर्भर करता है, तो हमेशा फंक्शनल अपडेट (prev => prev + 1) का उपयोग करें।",
        Tamil: "State update உடனடியாக நடக்காது. முந்தைய மதிப்பை பொறுத்து இருந்தால் எப்போதும் 'prev => prev + 1' முறையை பயன்படுத்தவும்.",
        Telugu: "State అప్‌డేట్ వెంటనే జరగదు. పాత విలువపై ఆధారపడితే ఎప్పుడూ 'prev => prev + 1' వాడాలి."
      },
      code: `function Counter() {
  // Lazy init: only runs on first render
  const [count, setCount] = useState(() => getInitialCount());

  const handleIncrement = () => {
    // Functional update guarantees latest state
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); 
    // Result: +2 (Batching handles this properly)
  };
}`,
      lang: 'javascript',
      quiz: {
        question: 'Why should you use a functional update (e.g., setCount(prev => prev + 1))?',
        options: ['It makes the code run faster', 'It prevents re-renders', 'It ensures you are working with the most up-to-date state', 'It is required for strings'],
        correct: 2,
        explanation: 'Because state updates are batched and asynchronous, using the previous state directly might give stale values. Functional updates guarantee the latest state.'
      }
    },
    {
      id: 'react-4',
      title: 'useEffect & Lifecycle',
      level: 'Intermediate',
      badge: 'badge-purple',
      summary: `useEffect lets you perform side effects in function components.

• Dependency Array: Controls when the effect re-runs (no array for every render, empty array for once on mount, values array for when values change).
• Cleanup Function: The return function that runs before the component unmounts or before the effect runs again.
• Stale Closures: Issues caused by missing dependencies in the dependency array.
• Infinite Loops: A common mistake caused by omitting objects or functions from dependencies.`,
      native: {
        Hinglish: "useEffect hook side works ke liye hai like API calls. Dependency array dhyaan se use karna chahiye warna infinite loop ban sakta hai.",
        Hindi: "useEffect का उपयोग API कॉल जैसे बाहरी कार्यों के लिए होता है। डिपेंडेंसी ऐरे का ध्यान रखें, अन्यथा इनफिनिट लूप बन सकता है।",
        Tamil: "API அழைப்புகள் போன்ற வேலைகளுக்கு useEffect பயன்படும். Dependency array ஐ கவனமாக கையாளாவிட்டால் முடிவிலா சுழல் (infinite loop) ஏற்படும்.",
        Telugu: "API కాల్స్ లాంటి పనులకు useEffect వాడతాం. Dependency array సరిగ్గా వాడకపోతే ఇన్ఫినిట్ లూప్ వస్తుంది."
      },
      code: `useEffect(() => {
  let isMounted = true;
  const fetchData = async () => {
    const data = await api.getData(id);
    if (isMounted) setData(data); // Prevent state update on unmounted component
  };
  fetchData();

  // Cleanup function
  return () => {
    isMounted = false;
  };
}, [id]); // Re-run only if 'id' changes`,
      lang: 'javascript',
      quiz: {
        question: 'What happens if you omit the dependency array in useEffect?',
        options: ['It runs only once on mount', 'It throws an error', 'It runs after every single render', 'It never runs'],
        correct: 2,
        explanation: 'Without a dependency array, useEffect executes after every render, which can lead to performance issues or infinite loops if it updates state.'
      }
    },
    {
      id: 'react-5',
      title: 'useRef & DOM Access',
      level: 'Intermediate',
      badge: 'badge-purple',
      summary: `useRef returns a mutable ref object whose .current property is initialized to the passed argument.

• Mutable Storage: Stores values across renders without causing UI updates when changed.
• DOM Access: The most common use case, allowing direct access to DOM elements.
• React.forwardRef(): A wrapper required when passing a ref from a parent to a custom child component.`,
      native: {
        Hinglish: "useRef ek box ki tarah hai jisme value save hoti hai par value change hone pe component re-render nahi hota. Direct DOM ko touch karne ke liye best hai.",
        Hindi: "useRef एक बॉक्स की तरह है जिसमें मान सुरक्षित रहता है, लेकिन इसके बदलने पर री-रेंडर नहीं होता। डोम (DOM) को सीधे एक्सेस करने के लिए यह सबसे अच्छा है।",
        Tamil: "useRef என்பது ஒரு பெட்டி போன்றது. இதில் உள்ள மதிப்பு மாறினால் re-render நடக்காது. DOM ஐ நேரடியாக அணுக இது சிறந்தது.",
        Telugu: "useRef అనేది ఒక పెట్టె లాంటిది. ఇందులో వాల్యూ మారినా రీ-రెండర్ జరగదు. DOM ని డైరెక్ట్ గా పట్టుకోడానికి ఇది వాడతాం."
      },
      code: `const CustomInput = React.forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

function Parent() {
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current.focus();

  return (
    <>
      <CustomInput ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}`,
      lang: 'javascript',
      quiz: {
        question: 'When should you use useRef instead of useState?',
        options: ['When you want the UI to update automatically', 'When storing a value that shouldn\'t trigger a re-render when changed', 'When passing data to child components', 'For fetching data from an API'],
        correct: 1,
        explanation: 'Mutating the .current property of a ref does not cause a re-render, making it ideal for mutable instance variables or DOM references.'
      }
    },
    {
      id: 'react-6',
      title: 'useContext & Context API',
      level: 'Advanced',
      badge: 'badge-purple',
      summary: `The Context API provides a way to pass data through the component tree without having to pass props down manually.

• Prop Drilling: The process of passing props down manually at every level, which Context API avoids.
• Provider: Created with React.createContext() and used to provide data to nested components.
• useContext: Hook used by deeply nested components to consume context data.
• Performance Optimization: Splitting contexts or memoizing the provider value to prevent re-rendering all consuming components.`,
      native: {
        Hinglish: "Props ko baar baar pass karne (prop drilling) se bachne ke liye Context use karte hain. Jaise ghar ka WiFi, ek router se sab connect hote hain.",
        Hindi: "प्रॉप्स को बार-बार पास करने से बचने के लिए कॉन्टेक्स्ट का उपयोग होता है। यह घर के वाई-फाई की तरह है, जिससे सभी जुड़े रहते हैं।",
        Tamil: "ஒவ்வொரு நிலைக்கும் props அனுப்புவதை தவிர்க்க Context பயன்படுகிறது. வீட்டின் WiFi போல, ஒரு இடத்திலிருந்து எல்லாரும் இணைக்கலாம்.",
        Telugu: "ప్రతిసారీ props పంపకుండా ఉండటానికి Context వాడతాం. ఇంట్లో WiFi లాగా, ఒకచోట నుండి అందరికీ వస్తుంది."
      },
      code: `const ThemeContext = React.createContext('light');

function App() {
  const [theme, setTheme] = useState('dark');
  // Provider wraps the app
  return (
    <ThemeContext.Provider value={theme}>
      <DeepChild />
    </ThemeContext.Provider>
  );
}

function DeepChild() {
  // Consumer uses the hook
  const theme = useContext(ThemeContext);
  return <div>Current theme: {theme}</div>;
}`,
      lang: 'javascript',
      quiz: {
        question: 'What is a major performance consideration when using Context API?',
        options: ['It causes memory leaks', 'It re-renders all consuming components when the provider value changes', 'It slows down initial load time significantly', 'It only works with class components'],
        correct: 1,
        explanation: 'Whenever the value prop of a Context Provider changes, all components that use useContext for that context will re-render, regardless of React.memo.'
      }
    },
    {
      id: 'react-7',
      title: 'useMemo, useCallback & React.memo',
      level: 'Advanced',
      badge: 'badge-purple',
      summary: `These are optimization tools to prevent unnecessary re-renders.

• React.memo: A higher-order component that prevents a component from re-rendering if its props haven't changed.
• useMemo: Caches the result of an expensive calculation so it is not recomputed on every render.
• useCallback: Caches a function definition between renders to preserve referential equality.
• Memoization Cost: The overhead associated with using these tools, meaning they should not be overused.`,
      native: {
        Hinglish: "Faltu re-renders rokne ke liye ye tools hain. useMemo heavy calculations save karta hai, aur useCallback functions ko baar baar banne se rokata hai.",
        Hindi: "अनावश्यक री-रेंडर रोकने के लिए ये टूल हैं। useMemo भारी गणनाओं को सेव करता है, और useCallback फंक्शन्स को बार-बार बनने से रोकता है।",
        Tamil: "தேவையற்ற re-renders ஐ தடுக்க இவை பயன்படும். useMemo கணக்கீடுகளையும், useCallback functionகளையும் சேமித்து வைக்கும்.",
        Telugu: "అనవసరమైన రీ-రెండర్స్ ఆపడానికి ఇవి వాడతాం. useMemo క్యాలిక్యులేషన్స్ ని, useCallback ఫంక్షన్స్ ని సేవ్ చేస్తాయి."
      },
      code: `// Caching a function reference
const handleAction = useCallback(() => {
  console.log('Action performed with:', someDependency);
}, [someDependency]);

// Caching an expensive value
const sortedList = useMemo(() => {
  return list.sort((a, b) => a - b);
}, [list]);

// Preventing child re-renders
const MemoizedChild = React.memo(ChildComponent);`,
      lang: 'javascript',
      quiz: {
        question: 'Why would you use useCallback in React?',
        options: ['To cache API responses', 'To delay the execution of a function', 'To maintain referential equality of a function passed to optimized child components', 'To trigger a re-render automatically'],
        correct: 2,
        explanation: 'useCallback returns a memoized callback, keeping the function reference the same across renders, which prevents unnecessary re-renders in child components wrapped in React.memo.'
      }
    },
    {
      id: 'react-8',
      title: 'useReducer & State Management',
      level: 'Advanced',
      badge: 'badge-purple',
      summary: `useReducer is an alternative to useState for complex state logic.

• Reducer Function: A function (state, action) => newState that determines how state changes.
• Dispatch: Called with an action object to trigger state changes.
• Decoupling: Separates state update logic from component rendering logic, making testing easier.
• Related State: Highly recommended for managing multiple related state variables that update together.`,
      native: {
        Hinglish: "Jab state bohot complex ho jaye, tab useReducer use karo. Ye ek strict manager (reducer) banata hai jo sirf specific rules (actions) se state change karta hai.",
        Hindi: "जब स्टेट बहुत जटिल हो जाए, तो useReducer का उपयोग करें। यह नियमों (एक्शन्स) के आधार पर स्टेट को सुरक्षित रूप से अपडेट करता है।",
        Tamil: "State மிகவும் சிக்கலாக மாறும் போது useReducer ஐ பயன்படுத்தவும். இது குறிப்பிட்ட விதிகள் மூலம் மட்டுமே State ஐ மாற்றும்.",
        Telugu: "State కాంప్లెక్స్ అయినప్పుడు useReducer వాడాలి. ఇది నిర్దిష్ట రూల్స్ ద్వారా మాత్రమే State ని మారుస్తుంది."
      },
      code: `const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + action.payload };
    case 'decrement': return { count: state.count - 1 };
    default: throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <button onClick={() => dispatch({type: 'increment', payload: 2})}>
    {state.count}
  </button>;
}`,
      lang: 'javascript',
      quiz: {
        question: 'When is it generally better to use useReducer over useState?',
        options: ['Always, it is faster', 'When state transitions are complex and involve multiple sub-values', 'Only in Class components', 'For simple boolean toggles'],
        correct: 1,
        explanation: 'useReducer is preferable when you have complex state logic, when the next state depends heavily on the previous state, or when updating multiple states together.'
      }
    },
    {
      id: 'react-9',
      title: 'Custom Hooks',
      level: 'Advanced',
      badge: 'badge-purple',
      summary: `Custom Hooks let you extract component logic into reusable functions.

• Naming Convention: Must be a JavaScript function whose name starts with "use".
• Shared Logic: Allows sharing of stateful logic, but not state itself (each call gets isolated state).
• Rules of Hooks: Must only be called at the top level and only from React functions or other custom hooks.`,
      native: {
        Hinglish: "Custom hooks apni khud ki factory banane jaisa hai jisme React hooks use hote hain. Code reuse karne ka sabse best tareeka hai.",
        Hindi: "कस्टम हुक्स कोड को बार-बार इस्तेमाल करने का सबसे अच्छा तरीका है। यह आपकी अपनी फैक्ट्री बनाने जैसा है जिसमें रिएक्ट हुक्स काम करते हैं।",
        Tamil: "Custom hooks மூலம் ஒரே குறியீட்டை மீண்டும் பயன்படுத்தலாம். இது சொந்தமாக ஒரு hook ஐ உருவாக்குவதாகும்.",
        Telugu: "Custom hooks ద్వారా ఒకే కోడ్ ని మళ్ళీ వాడొచ్చు. ఇది సొంతగా ఒక ఫ్యాక్టరీ తయారు చేయడం లాంటిది."
      },
      code: `// useDebounce Custom Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup clears timeout on unmount or value change
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
      lang: 'javascript',
      quiz: {
        question: 'What is a fundamental rule for naming a Custom Hook?',
        options: ['It must end with "Hook"', 'It must be written in TypeScript', 'It must start with the word "use" (e.g., useFetch)', 'It must be exported as default'],
        correct: 2,
        explanation: 'Starting with "use" is a strict convention that allows React (and ESLint plugins) to identify it as a hook and enforce the Rules of Hooks.'
      }
    },
    {
      id: 'react-10',
      title: 'React Router v6',
      level: 'Intermediate',
      badge: 'badge-purple',
      summary: `React Router v6 is the standard routing library for React applications.

• BrowserRouter: The wrapper component for your application to enable routing.
• Routes and Route: Components used to define mappings between URL paths and UI elements.
• Link and NavLink: Components used to navigate without full page reloads.
• useNavigate: Hook for programmatic navigation.
• useParams: Hook to access dynamic URL parameters.
• Protected Routes: Implemented using a wrapper component and Navigate for redirection.`,
      native: {
        Hinglish: "React Router single page application me alag-alag pages dikhane ka kaam karta hai. Bina page load kiye URL change karna iska main feature hai.",
        Hindi: "रिएक्ट राउटर बिना पेज रीलोड किए विभिन्न पेजों (URL) पर जाने में मदद करता है। यह सिंगल पेज एप्लिकेशन की जान है।",
        Tamil: "பக்கத்தை ரீலோட் செய்யாமல் URL ஐ மாற்ற React Router பயன்படுகிறது. இது Single Page Application களுக்கு முக்கியமானது.",
        Telugu: "పేజీ రీలోడ్ కాకుండా URL మార్చడానికి React Router వాడతాం. ఇది Single Page Application కి చాలా ముఖ్యం."
      },
      code: `import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/user/123')}>Go to User</button>;
}`,
      lang: 'javascript',
      quiz: {
        question: 'In React Router v6, which component is used to define a mapping between a URL path and a UI component?',
        options: ['<RouterMap>', '<Link>', '<Route>', '<Switch>'],
        correct: 2,
        explanation: 'The <Route> component specifies the path and the element to render when the URL matches that path.'
      }
    },
    // Module: Performance & Advanced Patterns
    {
      id: 'react-query',
      title: 'React Query (TanStack Query)',
      level: 'Intermediate',
      badge: 'badge-amber',
      summary: `React Query (now TanStack Query) is a powerful data synchronization and server-state management library for React.

• useQuery: Used to fetch data and automatically handle loading, error, and data states.
• useMutation: Used for creating, updating, or deleting data.
• Caching & Stale Time: Caches responses and serves them instantly; staleTime determines freshness.
• Background Refetches: Automatically refetches data on window focus or network reconnect.
• Interview Trap: Confusing staleTime (when data is old) with cacheTime (how long inactive data stays in memory).`,
      native: {
        Hinglish: "React Query ek smart assistant ki tarah hai jo data laata hai aur cache karta hai. Baar baar server se same data maangne ke bajaye, ye saved copy dikhata hai aur background me update kar leta hai."
      },
      code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Todos() {
  const queryClient = useQueryClient();

  // Fetch data with useQuery
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 mins
  });

  // Mutate data with useMutation
  const mutation = useMutation({
    mutationFn: newTodo => postTodo(newTodo),
    onSuccess: () => {
      // Invalidate and refetch cache after mutation
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {error.message}</span>;

  return (
    <div>
      <button onClick={() => mutation.mutate({ title: 'New task' })}>
        Add Todo
      </button>
      <ul>{data.map(todo => <li key={todo.id}>{todo.title}</li>)}</ul>
    </div>
  );
}`,
      lang: 'javascript',
      quiz: {
        question: 'What is the primary difference between staleTime and cacheTime (or gcTime in v5) in React Query?',
        options: [
          'staleTime is for mutations, cacheTime is for queries.',
          'staleTime dictates when data is refetched, cacheTime dictates when inactive data is garbage collected.',
          'They are exactly the same thing, just renamed in v5.',
          'cacheTime determines when data is refetched, staleTime determines when the component re-renders.'
        ],
        correct: 1,
        explanation: 'staleTime defines the duration until a query transitions from fresh to stale, triggering a background refetch on next use. cacheTime/gcTime dictates how long inactive cache data remains in memory before garbage collection.'
      }
    },
    {
      id: 'react-error-boundaries',
      title: 'Error Boundaries',
      level: 'Intermediate',
      badge: 'badge-amber',
      summary: `Error Boundaries are React components that catch JavaScript errors in their child component tree.

• Lifecycle Methods: componentDidCatch and getDerivedStateFromError are required to make a class component an Error Boundary.
• Fallback UI: A customized error message displayed instead of crashing the component tree.
• Limitations: They do not catch errors in event handlers, asynchronous code, server-side rendering, or within the boundary itself.
• Interview Edge Case: Function components cannot be Error Boundaries directly as there is no hook equivalent for componentDidCatch.`,
      native: {
        Hinglish: "Error Boundary building ke fuse-box jaisa kaam karta hai. Agar kisi room (component) me short-circuit (error) ho, toh pura ghar dark hone ke bajaye sirf us room ki light jaati hai aur backup chal jaata hai."
      },
      code: `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Update state so the next render shows the fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Log error to an error reporting service
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return <h2>Something went wrong.</h2>;
    }
    return this.props.children; 
  }
}

// Usage:
// <ErrorBoundary>
//   <MyWidget />
// </ErrorBoundary>`,
      lang: 'javascript',
      quiz: {
        question: 'Which of the following errors will an Error Boundary successfully catch?',
        options: [
          'Errors inside a button click event handler.',
          'Errors thrown inside a setTimeout callback.',
          'Errors thrown during the render phase of a child component.',
          'Errors thrown during Server Side Rendering (SSR).'
        ],
        correct: 2,
        explanation: 'Error Boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. They do not catch errors in event handlers, asynchronous code, or SSR.'
      }
    },
    {
      id: 'react-suspense-lazy',
      title: 'React.lazy & Suspense',
      level: 'Intermediate',
      badge: 'badge-amber',
      summary: `Code splitting is a technique to split your code into smaller chunks to improve load times.

• React.lazy: Lets you render a dynamic import as a regular component, handling code splitting automatically.
• Suspense: A component that specifies a loading indicator (fallback UI) while child components are not yet ready.
• Dynamic Imports: React.lazy requires a function calling a dynamic import() that resolves to a module with a default export.
• Loading States: Placing Suspense higher in the tree allows a single loading state for multiple lazy components.
• Interview Context: Impacts Webpack bundle splitting and improves the Time to Interactive (TTI) metric.`,
      native: {
        Hinglish: "Jaise online streaming me thoda buffer hota hai aage ka video load hone tak. React.lazy aur Suspense heavy components ko tabhi load karte hain jab zarurat ho, aur tab tak loading spinner dikhate hain."
      },
      code: `import React, { Suspense } from 'react';

// Dynamically import the heavy component
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <div>
      <h1>User Dashboard</h1>
      {/* Fallback UI while HeavyChart chunk is downloading */}
      <Suspense fallback={<div>Loading chart data...</div>}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}

export default Dashboard;`,
      lang: 'javascript',
      quiz: {
        question: 'What is a strict requirement for the module imported via React.lazy?',
        options: [
          'It must have named exports for all its functions.',
          'It must be a Class component, not a Functional component.',
          'It must return a Promise that resolves to a module with a default export containing a React component.',
          'It must be wrapped in a React.memo call.'
        ],
        correct: 2,
        explanation: 'React.lazy requires the dynamic import() to return a Promise that resolves to a module with a default export. If using named exports, you must re-export them as default.'
      }
    },
    {
      id: 'react-portals-refs',
      title: 'Portals & Refs Forwarding',
      level: 'Advanced',
      badge: 'badge-violet',
      summary: `Sometimes you need to render outside the parent's DOM hierarchy or expose a child's DOM node.

• createPortal: Renders a component into a different part of the DOM, useful for Modals and Tooltips.
• Event Bubbling: Works identically through portals despite being in a different DOM node.
• forwardRef: Allows a component to receive a ref and pass it down to a child DOM element.
• useImperativeHandle: Customizes the instance value exposed to parent components when using refs.
• Interview Edge Case: A portal behaves like a normal React child for Context API and Event Bubbling.`,
      native: {
        Hinglish: "Portal ek jaadui darwaza hai. Component bhale hi div ke andar banaya ho, portal use karke use direct body me bhej sakte hain (Modals ke liye best). forwardRef parent ko child ka control deta hai."
      },
      code: `import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

// Portal Component for a Modal
function Modal({ children }) {
  return createPortal(
    <div className="modal-backdrop">{children}</div>,
    document.body // Renders outside the parent DOM hierarchy
  );
}

// Custom Input using forwardRef and useImperativeHandle
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  // Expose only the focus method to the parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));

  return <input ref={inputRef} type="text" {...props} />;
});

function App() {
  const fancyRef = useRef();
  return <FancyInput ref={fancyRef} />;
}`,
      lang: 'javascript',
      quiz: {
        question: 'Which statement about React Portals is FALSE?',
        options: [
          'They allow rendering outside the parent component\'s DOM hierarchy.',
          'Events fired inside a portal do NOT bubble up to the React parent.',
          'They are commonly used for rendering Modals and Tooltips.',
          'They require the react-dom library to create.'
        ],
        correct: 1,
        explanation: 'This statement is FALSE. Despite being elsewhere in the DOM, a portal still exists in the React tree in its original position, so event bubbling works exactly as expected across the portal.'
      }
    },
    {
      id: 'react-state-management',
      title: 'State Management: Zustand vs Redux vs Context',
      level: 'Advanced',
      badge: 'badge-violet',
      summary: `Global state management tools impact application performance and developer experience.

• Context API: Built-in solution best for low-frequency updates like themes, though it can cause unnecessary re-renders.
• Redux Toolkit (RTK): Industry standard for complex, high-frequency updates with strict unidirectional data flow.
• Zustand: Fast, minimalistic state management that uses hooks, requires zero boilerplate, and prevents unnecessary re-renders.
• Interview Tip: Be prepared to justify choosing Zustand over Redux (simpler API) or Context over Redux (no external dependencies).`,
      native: {
        Hinglish: "Context chhote kaamo ke liye hai jaise theme change. Redux bada manager hai jo sab control karta hai par thoda strict hai. Zustand naya smart manager hai jo bina kisi jhanjhat ke fast kaam karta hai."
      },
      code: `// Zustand Example (Very minimal!)
import { create } from 'zustand';

// 1. Create a store
const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

// 2. Use it in components without wrapping in a Provider!
function BearCounter() {
  // Select specific state to prevent unnecessary re-renders
  const bears = useBearStore((state) => state.bears);
  return <h1>{bears} around here ...</h1>;
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation);
  return <button onClick={increasePopulation}>one up</button>;
}`,
      lang: 'javascript',
      quiz: {
        question: 'What is a major reason why Zustand can be more performant than the React Context API?',
        options: [
          'Zustand uses WebAssembly under the hood.',
          'Zustand completely bypasses React rendering.',
          'Zustand allows components to subscribe to specific parts of the state, avoiding unnecessary re-renders.',
          'React Context API uses local storage synchronously.'
        ],
        correct: 2,
        explanation: 'With Context API, any change to the value re-renders all consumers. Zustand allows you to select specific slices of state, ensuring the component only re-renders when that specific slice changes.'
      }
    },
    // Module: Testing & Production
    {
      id: 'react-testing-library',
      title: 'React Testing Library',
      level: 'Advanced',
      badge: 'badge-violet',
      summary: `React Testing Library (RTL) focuses on testing components from the user's perspective.

• Core Philosophy: Tests should resemble how software is used to provide confidence.
• Queries: Functions like getByRole or findByText used to find elements on the page.
• userEvent vs fireEvent: userEvent simulates real user interactions more realistically than fireEvent.
• Async Testing: Uses waitFor or findBy queries for testing asynchronous state changes.
• Interview Focus: Using ARIA roles (getByRole) is preferred as it promotes accessibility.`,
      native: {
        Hinglish: "RTL testing ka naya standard hai. Isme hum internal code nahi check karte, balki ye dekhte hain ki user ko button click karne ke baad sahi message dikh raha hai ya nahi. Jaise car chalate waqt steering check karna, na ki engine ke parts."
      },
      code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

test('shows error message on invalid credentials', async () => {
  // 1. Render component
  render(<Login />);
  
  // 2. Setup userEvent
  const user = userEvent.setup();

  // 3. Find elements (accessible queries preferred)
  const emailInput = screen.getByRole('textbox', { name: /email/i });
  const submitBtn = screen.getByRole('button', { name: /login/i });

  // 4. Interact with the DOM
  await user.type(emailInput, 'wrong@test.com');
  await user.click(submitBtn);

  // 5. Assert the result (findBy for async updates)
  const errorMsg = await screen.findByText(/invalid credentials/i);
  expect(errorMsg).toBeInTheDocument();
});`,
      lang: 'javascript',
      quiz: {
        question: 'In React Testing Library, which query should you use to check if an element is NOT present in the DOM without throwing an error?',
        options: [
          'getByText',
          'queryByText',
          'findByText',
          'assertNotByText'
        ],
        correct: 1,
        explanation: 'queryBy* queries return null when no elements are found, making them perfect for asserting that an element does not exist in the document. getBy* will throw an error immediately.'
      }
    },
    {
      id: 'react-vitest-jest',
      title: 'Vitest & Jest Setup',
      level: 'Intermediate',
      badge: 'badge-amber',
      summary: `Jest and Vitest are popular JavaScript testing frameworks and test runners.

• Test Runner: Executes test files, provides assertion functions, and outputs pass/fail results.
• Mocking: Isolating components by replacing modules or functions with fake data to avoid real network requests.
• Spies: Functions that track if, how often, and with what arguments a function was called.
• Best Practices: Avoid testing implementation details and mock external dependencies for deterministic tests.
• Interview Insight: Understand the difference between a Test Runner and a Testing Utility.`,
      native: {
        Hinglish: "Jest aur Vitest judge ki tarah hain jo aapke code ka test lete hain. Mocking ka matlab hai asli API ki jagah duplicate (fake) API use karna taaki test fast ho aur internet ki zarurat na pade."
      },
      code: `// Using Vitest (API is very similar to Jest)
import { describe, it, expect, vi } from 'vitest';
import { fetchUser } from './api';

// Mocking an external dependency
vi.mock('./api', () => ({
  fetchUser: vi.fn(),
}));

describe('User Module', () => {
  it('should call fetchUser with correct ID', () => {
    // Setup the mock return value
    fetchUser.mockResolvedValue({ id: 1, name: 'Alice' });

    // Call the function you want to test (mocked)
    fetchUser(1);

    // Assertions using spies
    expect(fetchUser).toHaveBeenCalledTimes(1);
    expect(fetchUser).toHaveBeenCalledWith(1);
  });
});`,
      lang: 'javascript',
      quiz: {
        question: 'What is the primary purpose of "mocking" in unit tests?',
        options: [
          'To make the code run slower so errors are visible.',
          'To isolate the unit of code being tested by replacing external dependencies with controlled fakes.',
          'To write the test descriptions in a funny, mocking tone.',
          'To bypass security checks in the production environment.'
        ],
        correct: 1,
        explanation: 'Mocking replaces dependencies (like APIs, databases, or complex modules) with controlled fake versions, ensuring the unit test only tests the logic of the specific component or function in isolation.'
      }
    },
    {
      id: 'react-nextjs-fundamentals',
      title: 'Next.js Fundamentals',
      level: 'Advanced',
      badge: 'badge-violet',
      summary: `Next.js is a React framework for production providing hybrid static and server rendering.

• SSR (Server-Side Rendering): Pages generated on the server on each request, ideal for dynamic data and SEO.
• SSG (Static Site Generation): Pages generated at build time, highly cacheable and fast.
• ISR (Incremental Static Regeneration): Updates static pages in the background without rebuilding the whole site.
• App Router: The modern Next.js 13+ paradigm using React Server Components by default.
• Server Components: Render exclusively on the server, sending zero JavaScript to the client.`,
      native: {
        Hinglish: "Normal React (CSR) client ko kachcha khana bhejta hai jo browser me pakta hai. Next.js (SSR/SSG) server pe hi khana paka kar ready bhejta hai, jisse website fast khulti hai aur Google ko samajh aati hai (SEO)."
      },
      code: `// Next.js App Router (Server Component by default)
// Runs ONLY on the server. Zero JS sent to client for this component!

export default async function Page() {
  // Direct database or API calls are safe here
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // ISR: Revalidate every hour
  });
  const data = await res.json();

  return (
    <main>
      <h1>Server Rendered Dashboard</h1>
      <ul>
        {data.items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </main>
  );
}`,
      lang: 'javascript',
      quiz: {
        question: 'What is a major advantage of React Server Components in the Next.js App Router?',
        options: [
          'They allow the use of useState and useEffect directly on the server.',
          'They send their JavaScript bundle to the client to render interactively.',
          'They execute only on the server, resulting in zero JavaScript being added to the client bundle.',
          'They replace the need for writing CSS.'
        ],
        correct: 2,
        explanation: 'Server Components run exclusively on the server and generate static HTML. Their code is never sent to the browser, significantly reducing the JavaScript bundle size.'
      }
    },
    {
      id: 'react-performance-profiling',
      title: 'React Performance Profiling',
      level: 'Advanced',
      badge: 'badge-violet',
      summary: `Identifying and fixing performance bottlenecks is critical for React applications.

• React DevTools Profiler: Browser extension recording component render times and reasons for unnecessary re-renders.
• Flamegraph: Visual representation of the component tree and render times where wider bars indicate expensive renders.
• Avoiding Re-renders: Techniques include moving state down, or using React.memo, useMemo, and useCallback.
• Lighthouse: Tool built into Chrome to measure overall Web Vitals (LCP, FID, CLS).
• Interview Trap: Premature optimization; avoid overusing useMemo before identifying an actual bottleneck.`,
      native: {
        Hinglish: "React Profiler ek doctor ke stethoscope ki tarah hai. Ye check karta hai ki kaunsa component faltu me baar baar render ho raha hai aur app ko slow kar raha hai. Bina check kiye useMemo lagana nuksan dayak ho sakta hai."
      },
      code: `import React, { useState, memo } from 'react';

// Using React.memo to prevent unnecessary re-renders
const ExpensiveComponent = memo(({ data }) => {
  console.log("Expensive component rendered");
  // Imagine heavy lifting here...
  return <div>Data: {data}</div>;
});

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState("Constant Data");

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      
      {/* Changing count won't trigger re-render of ExpensiveComponent 
          because 'data' prop hasn't changed. */}
      <ExpensiveComponent data={data} />
    </div>
  );
}`,
      lang: 'javascript',
      quiz: {
        question: 'What does a "Flamegraph" in the React DevTools Profiler represent?',
        options: [
          'The number of CSS animations currently active.',
          'The hierarchy of components and the time each took to render in a specific commit.',
          'The network requests made by the application.',
          'The number of errors thrown by Error Boundaries.'
        ],
        correct: 1,
        explanation: 'The Flamegraph visualizes the component tree for a specific render commit. The width and color of the bars represent the time spent rendering, helping identify bottlenecks.'
      }
    },
    {
      id: 'react-accessibility',
      title: 'Accessibility (a11y) in React',
      level: 'Intermediate',
      badge: 'badge-amber',
      summary: `Accessibility (a11y) ensures web applications are usable by everyone, including those with disabilities.

• Semantic HTML: Using correct tags (e.g., <nav>, <button>) to provide built-in keyboard navigation and screen reader support.
• ARIA Roles: Attributes used in custom UI to communicate state to assistive technologies.
• Keyboard Navigation: Ensuring interactive elements are reachable via Tab and usable with Enter/Space.
• Focus Management: Properly managing focus movement (e.g., trapping it in a modal) using React refs.
• alt Text: Providing meaningful descriptive text for images.`,
      native: {
        Hinglish: "Accessibility ka matlab hai website ko sabke liye banana, unke liye bhi jo mouse nahi use kar sakte ya dekh nahi sakte. Har button keyboard se dabna chahiye aur screen reader usko padh paana chahiye."
      },
      code: `import React, { useRef, useEffect } from 'react';

function AccessibleModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Focus management: shift focus when modal opens
  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // aria-modal and role="dialog" inform screen readers
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
      ref={modalRef}
      className="modal-overlay"
    >
      <div className="modal-content">
        <h2 id="modal-title">Important Notice</h2>
        <p>This is accessible content.</p>
        
        {/* Button can be triggered by keyboard Space/Enter */}
        <button 
          ref={closeBtnRef} 
          onClick={onClose}
          aria-label="Close dialog"
        >
          Close
        </button>
      </div>
    </div>
  );
}`,
      lang: 'javascript',
      quiz: {
        question: 'Why is it important to manage focus manually when opening a custom React modal?',
        options: [
          'To make the opening animation smoother.',
          'So that keyboard and screen reader users aren\'t left interacting with the background page behind the modal.',
          'Because React removes automatic focus capabilities from HTML.',
          'To prevent the browser from crashing.'
        ],
        correct: 1,
        explanation: 'When a modal opens, focus must be shifted into the modal (and trapped there) so users relying on keyboards or screen readers don\'t accidentally interact with the obscured background content.'
      }
    }
      ]
    }
  ]
};
