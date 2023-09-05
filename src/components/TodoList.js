import React from 'react';

const TodoList = ({ todoList }) => (
    <div>
        <h4>Things ToDo to Calculate the Temperature:</h4>
        <ul>
            {todoList.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
        {todoList.length === 0 && <p>You can calculate</p>}
    </div>
);

export default TodoList;