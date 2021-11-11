pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content; 
    string catagory;
    string comment;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(
    uint id,
    string content,
    string catagory,
    string comment,
    bool completed
  );

  event TaskCompleted(
    uint id,
    bool completed
  );

  constructor() public {
    
  }

  function createTask(string memory _content , string memory _catagory, string memory _comment) public {
    taskCount ++;
    tasks[taskCount].id = taskCount;
    tasks[taskCount].content = _content;
    tasks[taskCount].catagory = _catagory;
    tasks[taskCount].comment = _comment;
    tasks[taskCount].completed = false;
    emit TaskCreated(taskCount, _content  , _catagory, _comment, false);
  }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }
}