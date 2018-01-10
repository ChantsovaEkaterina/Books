angular.module("booksApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    books: function(Books) {
                        return Books.getBooks();
                    }
                }
            })
            .when("/new/book", {
                controller: "NewBookController",
                templateUrl: "book-creation.html"
            })
            .when("/book/:bookId", {
                controller: "EditBooksController",
                templateUrl: "book-details.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Books", function($http) {
        this.getBooks = function() {
            return $http.get("/books").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding books.");
                });
        }
        this.createBook = function(book) {
            return $http.post("/books", book).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating book.");
                });
        }
        this.getBook = function(bookId) {
            var url = "/books/" + bookId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this book.");
                });
        }
        this.editBook = function(book) {
            var url = "/books/" + book._id;
            return $http.put(url, book).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this book.");
                });
        }
        this.deleteBook = function(bookId) {
            var url = "/books/" + bookId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this book.");
                });
        }
    })
    .controller("ListController", function(books, $scope) {
        $scope.books = books.data;
    })
    .controller("NewBookController", function($scope, $location, Books) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveBook = function(book) {
            Books.createBook(book).then(function(doc) {
                var bookUrl = "/book/" + doc.data._id;
                $location.path(bookUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditBooksController", function($scope, $routeParams, Books) {
        Books.getBook($routeParams.bookId).then(function(doc) {
            $scope.book = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.bookFormUrl = "book-creation.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.bookFormUrl = "";
        }

        $scope.saveBook = function(book) {
            Books.editBook(book);
            $scope.editMode = false;
            $scope.bookFormUrl = "";
        }

        $scope.deleteBook = function(bookId) {
            Books.deleteBook(bookId);
        }
    });