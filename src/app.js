App = {
  loading: false,
  contracts: {},
  // captureFile: captureFile.bind(this),
  // onSubmit: onSubmit.bind(this),
  buffer: null,

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {

    App.account = account;
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#account").html(account);
      }
    }); 

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskID = $('.taskID')
    const $taskTemplate = $('.taskTemplate')
    const $taskTemplate2 = $('.taskTemplate2')


    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = "หัวข้อ: " + task[1] + " หมวดหมู่: " + task[2]
      const taskComment = "รายละเอียด: " + task[3]
      const taskCompleted = task[4]

      // Create the html for the task
      const $newTaskID = $taskID.clone()
      const $newTaskTemplate = $taskTemplate.clone()
      const $newTaskTemplate2 = $taskTemplate2.clone()
      $newTaskID.find('.content').html(taskId)
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate2.find('.content').html(taskComment)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('name', taskComment)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        console.log($newTaskTemplate2)
        $('#taskList').append($newTaskID,$newTaskTemplate,$newTaskTemplate2)
      }

      // Show the task
      $newTaskID.show()
      $newTaskTemplate.show()
      $newTaskTemplate2.show()
    }
  },

  createTask: async () => {
    App.setLoading(true)
    const content = $('#topic').val()
    const catagory = $('#catagory').val()
    const comment = $('#comment').val()
    await App.todoList.createTask(content,catagory,comment,{ from:  App.account}) 
    window.location.reload()
  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    console.log(taskId)
    await App.todoList.toggleCompleted(taskId ,{ from:  e.target.name})
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

  componentWillMount: async () => {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  },
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
