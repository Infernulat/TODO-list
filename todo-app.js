(function () {
    let listArray = []; //Массив для списка дел

    let listName = '';

    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
};

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function() {
            if(input.value !== '') {
            button.disabled = false
        } else {
            button.disabled = true
        }
    });
            // <form class="input-group mb-3">
            // <input class="form-control" placeholder="Введите название нового дела">
            // <div class="input-group=append">
            //     <button class="btn btn-primary">Добавить дело</button>
            // </div>
            // </form>

        return {
            form,
            input,
            button,
        };
    };

    // Создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    };
    
    // Создание DOM-элемента с делом
    function createTodoItem(obj) {
        let item = document.createElement('li');
        // Кнопки помещаются в элемент
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

    // Установка стилей для элемента списка, и размещение кнопок в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if(obj.done == true) item.classList.add('list-group-item-success')

        // добавляем обработчик на кнопки
        doneButton.addEventListener('click', function(){
            item.classList.toggle('list-group-item-success');

            for (const listItem of listArray) {
                if(listItem.id == obj.id) listItem.done = !listItem.done
            }

            saveList(listArray, listName);
        });
        deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                item.remove();
            
                for (let i = 0; i < listArray.length; i++) {

                    if (listArray[i].id == obj.id) listArray.splice(i, 1)
                }

                saveList(listArray, listName);
            }
        })

    // Вкладываем кнопки в отдельный элемент, чтобы они объеденились в один блок 
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        }
    };

    // Функция для добавления id к записи
    function getNewId(arr) {
        let max = 0;
        for (const item of arr) {
            if(item.id > max) max = item.id
        }
        return max + 1;
    };

    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr));
    }

    function createTodoApp(container, title = 'Список дел', keyName) {
        
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let = localData = localStorage.getItem(listName)

        if(localData !== null && localData !== '') listArray = JSON.parse(localData)
        
        for (const itemList of listArray) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }
        
        // браузер создает событие submit на форме по нажатию на enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e){
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера 
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // игнорирум создание элементаБ если пользователь ничего не ввёл в поле
            if (!todoItemForm.input.value) {
                return;
            }

            let newItem = {
                id: getNewId(listArray),
                name: todoItemForm.input.value,
                done: false
            }
            // // создаём и добавляем в список новое дело с названием из поля для ввода
            // todoList.append(createTodoItem(todoItemForm.input.value).item);

            let todoItem = createTodoItem(newItem);

            // Добавление новой записи(дела)
            listArray.push(newItem);

            saveList(listArray, listName);

            // создаём и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);
            // обнуляем значение в поле, чтобы не стирать его вручную
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });
    }

    window.createTodoApp = createTodoApp;
})();