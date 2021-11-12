pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content; 
    string catagory;
    string comment;
    uint vote;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(
    uint id,
    string content,
    string catagory,
    string comment,
    uint vote,
    bool completed
  );

  event TaskCompleted(
    uint id,
    bool completed
  );

  event TaskVote(
    uint id,
    uint vote
  );



  function createTask(string memory _content , string memory _catagory, string memory _comment) public {
    taskCount ++;
    tasks[taskCount].id = taskCount;
    tasks[taskCount].content = _content;
    tasks[taskCount].catagory = _catagory;
    tasks[taskCount].comment = _comment;
    tasks[taskCount].vote = 0;
    tasks[taskCount].completed = false;
    emit TaskCreated(taskCount, _content  , _catagory, _comment, 0, false);
  }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }

  function vote(uint _id) public{
    Task memory _tasks = tasks[_id];
    _tasks.vote = _tasks.vote + 1;
    tasks[_id] = _tasks;
    emit TaskVote(_id, _tasks.vote);
  }
}