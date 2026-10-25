import { useEffect, useRef, useState } from "react";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

const STORAGE_KEY = "todo-app-tasks";

const loadTasks = () => {
  let savedTasks;

  try {
    savedTasks = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("Unable to read tasks from local storage.", error);
    return [];
  }

  if (savedTasks === null) return [];

  try {
    const tasks = JSON.parse(savedTasks);
    const isValidTaskList =
      Array.isArray(tasks) &&
      tasks.every(
        (task) =>
          task !== null &&
          typeof task === "object" &&
          Number.isInteger(task.id) &&
          typeof task.text === "string" &&
          typeof task.completed === "boolean",
      );

    if (!isValidTaskList) {
      console.error("Saved tasks have an invalid format. Starting with an empty list.");
      return [];
    }

    return tasks;
  } catch (error) {
    console.error("Unable to parse saved tasks from local storage.", error);
    return [];
  }
};

export const Todo = () => {
  const [inputVal, setInputVal] = useState("");
  const [inputText, setInputText] = useState(loadTasks);
  const nextTaskId = useRef(null);

  if (nextTaskId.current === null) {
    nextTaskId.current = inputText.reduce(
      (nextId, item) => Math.max(nextId, item.id + 1),
      0,
    );
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputText));
    } catch (error) {
      console.error("Unable to save tasks to local storage.", error);
    }
  }, [inputText]);

  const handleOnChange = (event) => {
    setInputVal(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!inputVal.trim()) return;

    setInputText((prevText) => [
      ...prevText,
      { id: nextTaskId.current++, text: inputVal.trim(), completed: false },
    ]);
    setInputVal("");
  };

  const handleClearBtn = () => {
    setInputText([]);
  };

  const handleDeleteItem = (indexToRemove) => {
    setInputText((prevText) => prevText.filter((item) => item.id !== indexToRemove));
  };

  const handleToggleItem = (idToToggle) => {
    setInputText((prevText) =>
      prevText.map((item) =>
        item.id === idToToggle ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  return (
    <main className="todo-page">
      <div className="todo-card">
        <section>
          <h3>To-Do App</h3>
        </section>

        <section>
          <form className="todo-form" onSubmit={handleSubmit}>
            <input
              className="todo-input"
              type="text"
              onChange={handleOnChange}
              value={inputVal}
              placeholder="Add a task"
            />
            <button className="todo-button" type="submit">Add</button>
          </form>
        </section>

        <section className="todo-list-wrap">
          <ul className="todo-list">
            {inputText.map((item) => (
              <li className="todo-item" key={item.id}>
                <span className="todo-item-main">
                  <button
                    className="todo-check-btn"
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    aria-label={item.completed ? "Mark task as incomplete" : "Mark task as complete"}
                    aria-pressed={item.completed}
                  >
                    {item.completed ? <RiCheckboxCircleLine /> : <RiCheckboxBlankCircleLine />}
                  </button>
                  <span className={`todo-item-text${item.completed ? " is-completed" : ""}`}>
                    {item.text}
                  </span>
                </span>
                <MdDelete className="todo-delete-btn" onClick={() => handleDeleteItem(item.id)} />
              </li>
            ))}
          </ul>
        </section>
        <section>
          <button className="todo-clear-button" type="button" onClick={handleClearBtn}>
            Clear All
          </button>
        </section>
      </div>
    </main>
  );
};