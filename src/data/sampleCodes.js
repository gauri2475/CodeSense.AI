export const SAMPLE_CODES = [
  {
    id: 'js-debounce',
    name: 'JavaScript • Debounce Function',
    language: 'javascript',
    code: `// Custom Debounce Implementation
function debounce(callback, delay = 300) {
  let timerId;

  return function (...args) {
    const context = this;
    
    // Clear the previous timeout if called again before delay completes
    clearTimeout(timerId);

    // Set new timer
    timerId = setTimeout(() => {
      callback.apply(context, args);
    }, delay);
  };
}

// Usage Example:
const handleSearch = debounce((query) => {
  console.log("Searching API for:", query);
}, 500);`,
    purpose: "Regulates high-frequency event firing by delaying execution until a period of inactivity has elapsed, optimizing client performance and network bandwidth.",
    mockExplanation: {
      beginner: `### 🎯 Simple Summary
This code is a **Debounce** utility. Think of it like an elevator: instead of closing immediately when one person steps in, it waits a few seconds. If someone else runs in, the timer resets. It on[...]

---

### 🔍 How it Works (Step-by-Step)
1. **\`let timerId;\`**: Holds a reference to the pending timer.
2. **Returning a new function**: Creates a *closure*, remembering the \`timerId\` across multiple calls.
3. **\`clearTimeout(timerId)\`**: Cancels any previous countdown if the user types or clicks again quickly.
4. **\`setTimeout\`**: Waits for the specified delay (default 300ms) of total inactivity before finally running the callback.

---

### 💡 Why do we use it?
It prevents expensive operations (like API searches or window resize calculations) from firing dozens of times per second while a user is actively typing.`,
      detailed: `### 📌 Overview
An implementation of a higher-order **Debounce** function in JavaScript leveraging closures and the asynchronous event loop (\`setTimeout\`).

---

### ⚙️ Line-by-Line Breakdown
- **Lines 2-3**: Declares the outer function taking a \`callback\` and \`delay\`. Holds \`timerId\` within its lexical scope.
- **Lines 5-7**: Returns a wrapped variadic function retaining \`this\` context and \`arguments\`.
- **Line 10**: Calls \`clearTimeout(timerId)\` to reset any active timers, ensuring previous invocations within the threshold are cancelled.
- **Lines 13-15**: Schedules execution of \`callback.apply(context, args)\` after \`delay\` milliseconds of silence.

---

### ⚡ Practical Applications
- Search input autocomplete / live search.
- Window resize and scroll recalculations.
- Preventing duplicate button clicks or form submissions.`,
      interview: `### 📊 Technical & Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(1)$ for scheduling each invocation. The underlying callback maintains its native complexity.
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory (retains a single timer ID integer and argument reference in closure scope).

---

### ⚠️ Potential Edge Cases & Improvements
1. **Immediate Execution (Leading vs. Trailing)**: Currently only handles *trailing* edge. Adding an \`immediate: boolean\` flag would allow firing instantly on the first trigger and debouncing su[...]
2. **Cancellation Method**: Attaching a \`.cancel()\` method to the returned function allows React components to cancel pending timers in \`useEffect\` cleanup functions.`
    }
  },
  {
    id: 'py-binary-search',
    name: 'Python • Binary Search',
    language: 'python',
    code: `def binary_search(arr: list[int], target: int) -> int:
    """Finds the index of target in a sorted list, or -1 if not found."""
    left = 0
    right = len(arr) - 1

    while left <= right:
        # Avoid potential integer overflow
        mid = left + (right - left) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

# Example
numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print("Found at index:", binary_search(numbers, 23))`,
    purpose: "Locates a target integer in a sorted sequence in logarithmic O(log N) time by repeatedly dividing the remaining search space in half.",
    mockExplanation: {
      beginner: `### 🎯 Simple Summary
Imagine looking for a word in a physical dictionary. You don't read page by page from the beginning! Instead, you flip directly to the middle. If your word comes after, you throw away the first h[...]

---

### 🔍 How it Works
1. Starts with two pointers: **\`left\`** at the beginning and **\`right\`** at the end.
2. Computes the **\`mid\`** point.
3. If the middle item equals your target, you're done!
4. If the target is bigger, move the \`left\` pointer past the middle.
5. If the target is smaller, move the \`right\` pointer before the middle.
6. If the pointers cross without finding the item, returns **-1**.`,
      detailed: `### 📌 Overview
An iterative implementation of the **Binary Search** algorithm in Python with type annotations and integer-safe midpoint calculation.

---

### ⚙️ Mechanics
- Requires the input list to be strictly sorted in ascending order.
- Calculates \`mid = left + (right - left) // 2\` which prevents integer overflow errors in languages with fixed integer sizes.
- Halves the search space on each iteration: $\\frac{N}{2}, \\frac{N}{4}, \\dots, 1$.

---

### 💡 Key Takeaway
Logarithmic time scaling means searching through 1,000,000 items takes at most ~20 comparisons!`,
      interview: `### 📊 Technical & Complexity Analysis
- **Time Complexity**: $\\mathcal{O}(\\log N)$ worst/average case; $\\mathcal{O}(1)$ best case (target is at exact middle).
- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary space because it uses an iterative loop rather than recursive call stack frames.

---

### ⚡ Interview Discussion Points
- **Why \`left + (right - left) // 2\` instead of \`(left + right) // 2\`?** While Python 3 supports arbitrary-precision integers, this idiom is standard best-practice to prevent integer overflow[...]
    }
  },
  {
    id: 'react-use-fetch',
    name: 'React • Custom useFetch Hook',
    language: 'javascript',
    code: `import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController prevents state updates if component unmounts
    const controller = new AbortController();
    setIsLoading(true);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP error! Status: \${res.status}\`);
        return res.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [url]);

  return { data, isLoading, error };
}`,
    purpose: "Manages the asynchronous HTTP lifecycle (loading, data, and error state) while automatically cancelling inflight requests on component unmount via AbortController.",
    mockExplanation: {
      beginner: `### 🎯 Simple Summary
This is a custom React hook called \`useFetch\`. It acts like an automatic delivery assistant for data: you give it a website URL, and it automatically handles downloading the information, lettin[...]

---

### 🔍 Key Features
- **\`data\`**: Holds the downloaded data once it arrives.
- **\`isLoading\`**: A flag you can use to show a spinner icon.
- **\`error\`**: Displays an error message if the server failed.
- **Safe Cleanup**: If the user leaves the page before the download finishes, it cancels the download so the app doesn't crash!`,
      detailed: `### 📌 Overview
A production-ready React custom hook encapsulating asynchronous HTTP data fetching with state management and race-condition prevention using the Web **AbortController** API.

---

### ⚙️ Component Lifecycle
1. Triggered on mount and whenever the \`url\` dependency changes.
2. Initializes \`AbortController\` and passes its \`signal\` to \`window.fetch\`.
3. Handles standard JSON resolution and HTTP status code validation (\`res.ok\`).
4. Ignores \`AbortError\` exceptions during unmount cleanup to avoid false-positive error state updates.
5. Returns a clean declarative object: \`{ data, isLoading, error }\`.`,
      interview: `### 📊 Technical & Complexity Analysis
- **Lifecycle Guarantees**: Prevents the dreaded *"Can't perform a React state update on an unmounted component"* memory leak.
- **Race Condition Handling**: If \`url\` changes rapidly (e.g. user toggles filters), the unmount cleanup aborts the inflight request, ensuring only the latest response resolves.

---

### 🚀 Production Enhancements
- Add caching (like TanStack Query / SWR) to avoid refetching identical URLs.
- Support manual re-fetch and custom fetch options (\`headers\`, \`method\`, \`body\`).`
    }
  },
  {
    id: 'sql-window',
    name: 'SQL • Window Function & Running Total',
    language: 'sql',
    code: `WITH MonthlySales AS (
  SELECT
    DATE_TRUNC('month', order_date) AS sales_month,
    department_id,
    SUM(amount) AS total_revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY 1, 2
)
SELECT
  sales_month,
  department_id,
  total_revenue,
  -- Calculate running total per department across months
  SUM(total_revenue) OVER (
    PARTITION BY department_id
    ORDER BY sales_month
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_revenue,
  -- Rank departments by revenue in that month
  DENSE_RANK() OVER (
    PARTITION BY sales_month
    ORDER BY total_revenue DESC
  ) AS monthly_rank
FROM MonthlySales
ORDER BY department_id, sales_month;`,
    purpose: "Computes cumulative rolling revenue totals and dense performance rankings across partitioned departments without collapsing row-level data.",
    mockExplanation: {
      beginner: `### 🎯 Simple Summary
This SQL query calculates sales performance over time. It answers two big questions:
1. What is the **cumulative running total** of sales for each department month-by-month?
2. Which department was **#1, #2, #3** in sales during each month?

---

### 🔍 How it Works
- **CTE (Common Table Expression)**: \`WITH MonthlySales AS (...)\` first aggregates raw orders into clean monthly totals.
- **Window Function 1**: Calculates a running sum that builds up over time for each department.
- **Window Function 2**: Ranks the top-selling departments each month without needing multiple separate queries.`,
      detailed: `### 📌 Overview
An advanced SQL analytical query demonstrating Common Table Expressions (CTEs) combined with window functions (\`SUM() OVER\` and \`DENSE_RANK() OVER\`).

---

### ⚙️ Mechanics
- **\`PARTITION BY department_id\`**: Resets the window calculation boundary for each individual department.
- **\`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`**: Frame specification ensuring the aggregate sums every preceding record up to the current row.
- **\`DENSE_RANK()\`**: Ensures consecutive ranks without gaps (e.g., 1, 2, 2, 3) if two departments tie in revenue.`,
      interview: `### 📊 Technical & Optimization Analysis
- **Execution Plan**: Modern SQL engines execute the CTE materialization first, followed by a window sort buffer.
- **Indexing Recommendations**: An index on \`(status, order_date, department_id, amount)\` optimizes the CTE filter and grouping phase.`
    }
  }
];

export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'react', label: 'React / JSX' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html-css', label: 'HTML / CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'cpp', label: 'C / C++' },
  { value: 'java', label: 'Java' },
  { value: 'general', label: 'Auto / Other' },
];

export const EXPLANATION_LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner Friendly',
    badge: '👶 ELI5',
    shortBadge: 'ELI5',
    desc: 'Plain analogies, simple terms, no heavy jargon.'
  },
  {
    id: 'detailed',
    label: 'Standard Breakdown',
    badge: '💡 Thorough',
    shortBadge: 'Standard',
    desc: 'Step-by-step logic walkthrough & key concepts.'
  },
  {
    id: 'interview',
    label: 'Interview / Deep Dive',
    badge: '⚡ Big-O & Bugs',
    shortBadge: 'Deep Dive',
    desc: 'Time/space complexity, edge cases & optimizations.'
  }
];
