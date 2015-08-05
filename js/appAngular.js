/**
 * Created by Adnan Irfan on 05-Aug-15.
 */

(function () {
    angular.module('app', ['pouchdb'])
        .service('service', function (pouchDB) {

        })
        .controller('MainController', function ($scope, pouchDB) {
            var db = pouchDB('myDatabase');
            //var doc = {name: 'Adnan Irfan'};
            $scope.todos = [];
            $scope.name = 'Adnan Irfan';
            $scope.addTodo = addTodo;
            $scope.deleteButtonPressed = deleteButtonPressed;
            $scope.checkboxChanged = checkboxChanged;

            showTodos();

            db.changes({
                since: 'now',
                live: true
            }).on('change', showTodos);
            function checkboxChanged(todo) {
                db.put(todo);
            }
            function deleteButtonPressed(deleteTodo) {
                db.remove(deleteTodo.doc)
                .then(function(){
                    showTodos();
                })
                .catch(function(err){
                    
                });
            }
            function addTodo(event) {
                db.post({
                    _id: new Date().toISOString(),
                    title: $scope.todoText,
                    checked: false,
                    created_at: new Date()
                })
                    .then(function () {
                        console.log('Saved Successfully!!')
                    })
                    .catch(function (err) {
                        console.log('Error: ' + err)
                    })
                // showTodos();
                $scope.todoText = '';
            }

            function showTodos() {
                $scope.todos = [];
                db.allDocs({include_docs: true, descending: true}, function (err, doc) {
                    angular.forEach(doc.rows, function(data, index){
                        $scope.todos.push(data);
                    })
                    //redrawTodosUI(doc.rows);
                });
            }

        })
})()